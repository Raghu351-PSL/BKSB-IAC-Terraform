import * as cdk from 'aws-cdk-lib'; 
import { Construct } from 'constructs'; 
import * as iam from 'aws-cdk-lib/aws-iam'; 
import * as ec2 from 'aws-cdk-lib/aws-ec2'; 
import * as ecs from 'aws-cdk-lib/aws-ecs'; 
import * as servicediscovery from 'aws-cdk-lib/aws-servicediscovery'; 
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice'; 
import * as rds from 'aws-cdk-lib/aws-rds'; 
import * as logs from 'aws-cdk-lib/aws-logs'; 
import * as kms from 'aws-cdk-lib/aws-kms'; 
import { Aws, Duration, RemovalPolicy, Size, Tags } from 'aws-cdk-lib'; 
import { InstanceClass, InstanceSize, MachineImage } from 'aws-cdk-lib/aws-ec2'; 
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'; 
import { FileSystem } from 'aws-cdk-lib/aws-efs'; 
import { ContainerDependencyCondition, Secret } from 'aws-cdk-lib/aws-ecs'; 
import { PerformanceInsightRetention, StorageType } from 'aws-cdk-lib/aws-rds'; 
import { EngineVersion } from 'aws-cdk-lib/aws-opensearchservice'; 
import { EnvironmentName } from '../../base/lib/definitions'; 
import { MigrationBackend } from './migration-backend'; 
interface ManagementStackProps extends cdk.StackProps { 
  environment: string, 
  managementSubnetAz: string, 
  managementSubnetCidr: string, 
  bksbManagementAppsSubnetAz: string, 
  bksbManagementAppsSubnetCidr: string, 
  cloudflareSubnetAz: string, 
  cloudflareSubnetCidr: string, 
  bastionSubnetAz: string, 
  bastionSubnetCidr: string, 
  natGatewayId: string, 
  managementInstanceName: string, 
  managementInstanceAz: string, 
  importRdsBastionSecurityGroup: boolean, 
  grafanaSubnetAAz: string, 
  grafanaSubnetBAz: string, 
  grafanaDockerVersion: string, 
  grafanaDatabaseSubnetACidr: string, 
  grafanaDatabaseSubnetBCidr: string, 
  grafanaDatabaseInstanceFamily: InstanceClass, 
  grafanaDatabaseInstanceSize: InstanceSize, 
  grafanaDatabaseAllocatedStorage: number, 
  grafanaDatabaseMaxStorage: number, 
  grafanaDomain: string, 
  elasticSearchDomain: string, 
  elasticSearchClusterType: string, 
  externalNetworkResources: { 
    bl2DatabaseSubnetCidrBlocks: string[], 
    bl2DatabaseSecurityGroupId: string, 
    bl2DatabaseSubnetAclId: string, 
    internalDatabaseSubnetCidrBlocks: string[], 
    internalDatabaseSecurityGroupId: string, 
    internalDatabaseSubnetAclId: string, 
  } 
} 
export class ManagementStack extends cdk.Stack { 
  generatedConstructs: { 
    ecsCluster: ecs.ICluster, 
    bksbManagementAppsSubnets: ec2.PrivateSubnet[], 
    bksbManagementAppsSubnetAcl: ec2.NetworkAcl, 
    cloudflareSubnets: ec2.PrivateSubnet[], 
    cloudflareSubnetAcl: ec2.NetworkAcl, 
    cloudflareSecurityGroup: ec2.SecurityGroup, 
    serviceDiscoveryNamespace: servicediscovery.PrivateDnsNamespace, 
  }; 
  constructor(scope: Construct, id: string, props: ManagementStackProps) { 
    super(scope, id, props); 
    const account = props.env?.account ?? Aws.ACCOUNT_ID; 
    const region = props.env?.region ?? Aws.REGION; 
    const rootVpc = ec2.Vpc.fromLookup(this, 'root_vpc', { 
      tags: { 
        name: `${props.environment}_vpc_live2_${region}`, 
      }, 
    }); 
    const internalKmsKey = kms.Key.fromLookup(this, "KmsKey", { 
      aliasName: `alias/${props.environment}/Live2InternalData/${props.env?.region}` 
    }); 
    const bl2DatabaseSubnetACL = ec2.NetworkAcl.fromNetworkAclId(this, "BL2DatabaseSubnetACL", props.externalNetworkResources.bl2DatabaseSubnetAclId); 
    const bl2DatabaseSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, "BL2DatabaseSecurityGroup", props.externalNetworkResources.bl2DatabaseSecurityGroupId); 
    const internalDatabaseSubnetACL = ec2.NetworkAcl.fromNetworkAclId(this, "InternalDatabaseSubnetACL", props.externalNetworkResources.internalDatabaseSubnetAclId); 
    const internalDatabaseSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, "InternalDatabaseSecurityGroup", props.externalNetworkResources.internalDatabaseSecurityGroupId); 
    const managementSubnet = new ec2.PrivateSubnet(this, 'ManagementSubnet', { 
      availabilityZone: props.managementSubnetAz, 
      cidrBlock: props.managementSubnetCidr, 
      vpcId: rootVpc.vpcId 
    }); 
    managementSubnet.addDefaultNatRoute(props.natGatewayId); 
    const bastionSubnet = new ec2.PrivateSubnet(this, 'BastionSubnet', { 
      availabilityZone: props.bastionSubnetAz, 
      cidrBlock: props.bastionSubnetCidr, 
      vpcId: rootVpc.vpcId 
    }); 
    const bksbManagementAppsSubnet = new ec2.PrivateSubnet(this, 'BKSBManagementAppsSubnet', { 
      availabilityZone: props.bksbManagementAppsSubnetAz, 
      cidrBlock: props.bksbManagementAppsSubnetCidr, 
      vpcId: rootVpc.vpcId 
    }) 
    bksbManagementAppsSubnet.addDefaultNatRoute(props.natGatewayId); 
    const bksbManagementAppsSubnetAcl = new ec2.NetworkAcl(this, "BKSBManagementAppsSubnetAcl", { 
      vpc: rootVpc, 
      subnetSelection: { 
        subnets: [bksbManagementAppsSubnet] 
      } 
    }); 
    bksbManagementAppsSubnetAcl.addEntry(`BKSBManagementAppsSubnetAclIngressEphemeral`, { 
      cidr: ec2.AclCidr.anyIpv4(), 
      ruleNumber: 100, 
      traffic: ec2.AclTraffic.tcpPortRange(32768, 65535), 
      direction: ec2.TrafficDirection.INGRESS 
    }); 
    bksbManagementAppsSubnetAcl.addEntry(`BKSBManagementAppsSubnetAclEgressHTTP`, { 
      cidr: ec2.AclCidr.anyIpv4(), 
      ruleNumber: 100, 
      traffic: ec2.AclTraffic.tcpPort(80), 
      direction: ec2.TrafficDirection.EGRESS 
    }); 
    bksbManagementAppsSubnetAcl.addEntry(`BKSBManagementAppsSubnetAclEgressHTTPS`, { 
      cidr: ec2.AclCidr.anyIpv4(), 
      ruleNumber: 110, 
      traffic: ec2.AclTraffic.tcpPort(443), 
      direction: ec2.TrafficDirection.EGRESS 
    }); 
    const cloudflareSubnet = new ec2.PrivateSubnet(this, 'CloudflareSubnet', { 
      availabilityZone: props.cloudflareSubnetAz, 
      cidrBlock: props.cloudflareSubnetCidr, 
      vpcId: rootVpc.vpcId 
    }); 
    cloudflareSubnet.addDefaultNatRoute(props.natGatewayId); 
    const cloudflareSubnetAcl = new ec2.NetworkAcl(this, "cloudflareSubnetAcl", { 
      vpc: rootVpc, 
      subnetSelection: { 
        subnets: [cloudflareSubnet] 
      } 
    }); 
    cloudflareSubnetAcl.addEntry(`ephemeralTcpEntry`, { 
      cidr: ec2.AclCidr.anyIpv4(), 
      ruleNumber: 100, 
      traffic: ec2.AclTraffic.tcpPortRange(1024, 65535), 
      direction: ec2.TrafficDirection.INGRESS 
    }); 
    cloudflareSubnetAcl.addEntry(`ephemeralUdpEntry`, { 
      cidr: ec2.AclCidr.anyIpv4(), 
      ruleNumber: 110, 
      traffic: ec2.AclTraffic.udpPortRange(1024, 65535), 
      direction: ec2.TrafficDirection.INGRESS 
    }); 
    cloudflareSubnetAcl.addEntry(`httpsEntry`, { 
      cidr: ec2.AclCidr.anyIpv4(), 
      ruleNumber: 100, 
      traffic: ec2.AclTraffic.tcpPort(443), 
      direction: ec2.TrafficDirection.EGRESS 
    }); 
    cloudflareSubnetAcl.addEntry(`httpEntry`, { 
      cidr: ec2.AclCidr.anyIpv4(), 
      ruleNumber: 110, 
      traffic: ec2.AclTraffic.tcpPort(80), 
      direction: ec2.TrafficDirection.EGRESS 
    }); 
    cloudflareSubnetAcl.addEntry(`cloudflaredUDP`, { 
      cidr: ec2.AclCidr.anyIpv4(), 
      ruleNumber: 120, 
      traffic: ec2.AclTraffic.udpPort(7844), 
      direction: ec2.TrafficDirection.EGRESS 
    }); 
    cloudflareSubnetAcl.addEntry(`cloudflaredTCP`, { 
      cidr: ec2.AclCidr.anyIpv4(), 
      ruleNumber: 130, 
      traffic: ec2.AclTraffic.tcpPort(7844), 
      direction: ec2.TrafficDirection.EGRESS 
    }); 
    cloudflareSubnetAcl.addEntry(`cloudflaredGrafana`, { 
      cidr: ec2.AclCidr.anyIpv4(), 
      ruleNumber: 140, 
      traffic: ec2.AclTraffic.tcpPort(3000), 
      direction: ec2.TrafficDirection.EGRESS 
    }); 
    let rdsBastionSecurityGroup; 
    if (props.importRdsBastionSecurityGroup) { 
      rdsBastionSecurityGroup = ec2.SecurityGroup.fromLookupByName(this, 'rdsBastionSecurityGroup', 'RDS Bastion Instance Security Group', rootVpc); 
    } else { 
      rdsBastionSecurityGroup = new ec2.SecurityGroup(this, "rdsBastionSecurityGroup", { 
        vpc: rootVpc, 
        allowAllOutbound: false, 
        description: "Security Group for RDS Bastion Instance Ingress/Egress", 
        securityGroupName: 'RDS Bastion Instance Security Group', 
      }); 
      rdsBastionSecurityGroup.applyRemovalPolicy(RemovalPolicy.RETAIN); 
    } 
    rdsBastionSecurityGroup.addEgressRule( 
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(443), 
      "Egress rule for SSM Session Manager & HTTPS traffic" 
    ); 
    rdsBastionSecurityGroup.addEgressRule( 
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(80), 
      "Egress rule for HTTP traffic" 
    ); 
    rdsBastionSecurityGroup.addEgressRule( 
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(1433), 
      "Egress rule for MSSQL traffic" 
    ); 
    rdsBastionSecurityGroup.addEgressRule( 
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(3306), 
      "Egress rule for MySQL traffic" 
    ); 
    const SSMPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"); 
    const rdsBastionIAMRole = new iam.Role(this, "rdsBastionInstanceRole", { 
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"), 
    }); 
    rdsBastionIAMRole.addManagedPolicy(SSMPolicy) 
    rdsBastionIAMRole.addToPolicy(new iam.PolicyStatement({ 
      actions: [ 
        "kms:Decrypt" 
      ], 
      resources: [internalKmsKey.keyArn] 
    })); 
    const rdsBastionInstance = new ec2.Instance(this, 'rdsBastionInstance', { 
      vpc: rootVpc, 
      instanceType: new ec2.InstanceType('t3a.medium'), 
      machineImage: ec2.MachineImage.latestAmazonLinux({ 
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2, 
      }), 
      instanceName: props.managementInstanceName, 
      vpcSubnets: { 
        subnets: [bastionSubnet] 
      }, 
      securityGroup: rdsBastionSecurityGroup, 
      availabilityZone: props.managementInstanceAz, 
      blockDevices: [ 
        { 
          deviceName: '/dev/xvda', 
          volume: ec2.BlockDeviceVolume.ebs(10, { 
            encrypted: true, 
            kmsKey: internalKmsKey, 
            volumeType: ec2.EbsDeviceVolumeType.GP3, 
          }), 
        } 
      ], 
      role: rdsBastionIAMRole, 
      requireImdsv2: true 
    }); 
    const cloudflareInstanceSecurityGroup = new ec2.SecurityGroup(this, "cloudflareSecurityGroup", { 
      vpc: rootVpc, 
      allowAllOutbound: false, 
      description: "Security Group for Cloudflared Instance Ingress/Egress", 
      securityGroupName: 'Cloudflared Instance Security Group' 
    }); 
    cloudflareInstanceSecurityGroup.addEgressRule( 
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(443), 
      "Egress rule for SSM Session Manager & HTTPS traffic" 
    ); 
    cloudflareInstanceSecurityGroup.addEgressRule( 
      ec2.Peer.anyIpv4(), 
      ec2.Port.udp(7844), 
      "Egress rule for cloudflared traffic" 
    ); 
    cloudflareInstanceSecurityGroup.addEgressRule( 
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(7844), 
      "Egress rule for cloudflared traffic" 
    ); 
    cloudflareInstanceSecurityGroup.addEgressRule( 
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(80), 
      "Egress rule for HTTP traffic" 
    ); 
    cloudflareInstanceSecurityGroup.addEgressRule( 
      ec2.Peer.ipv4(props.managementSubnetCidr), 
      ec2.Port.tcp(3000), 
      "Egress rule for Grafana ECS Container - Management Subnet" 
    ); 
    cloudflareInstanceSecurityGroup.addEgressRule( 
      ec2.Peer.ipv4(props.bastionSubnetCidr), 
      ec2.Port.tcp(3000), 
      "Egress rule for Grafana ECS Container - Bastion Subnet" 
    ); 
    // Add Migration Backend 
    const migrationBackend = new MigrationBackend(this, 'MigrationBackend', { 
      bucketName: 'terraform-state-bucket', 
      dynamoTableName: 'terraform-state-lock-table', 
      kmsAliasName: 'terraform-key-alias', 
      region: this.node.tryGetContext('region') || Aws.REGION, 
    }); 
    new cdk.CfnOutput(this, 'BackendS3Bucket', { 
      value: migrationBackend.s3Bucket.bucketName, 
      description: 'S3 Bucket for Terraform Backend Storage', 
    }); 
    new cdk.CfnOutput(this, 'BackendDynamoDBTable', { 
      value: migrationBackend.dynamoDBTable.tableName, 
      description: 'DynamoDB Table for Terraform State Locking', 
    }); 
    new cdk.CfnOutput(this, 'BackendKmsKeyArn', { 
      value: migrationBackend.kmsKey.keyArn, 
      description: 'KMS Key ARN for Terraform Backend Encryption', 
    }); 
  } 
}