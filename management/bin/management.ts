#!/usr/bin/env node 
import 'source-map-support/register'; 
import * as cdk from 'aws-cdk-lib'; 
import * as readlineSync from 'readline-sync'; 
import { ManagementStack } from '../lib/management-stack'; 
import { DeploymentDocGenerator } from '../lib/deploymentDocGenerator'; // Added deployment documentation generator import 
const app = new cdk.App(); 
// ---------------------------------------------------------------------------- 
// Migration Interface Integration 
// ---------------------------------------------------------------------------- 
const useMigrationInterface = readlineSync.question('Do you want to access the Migration Interface? (yes/no): '); 
if (useMigrationInterface.trim().toLowerCase() === 'yes') { 
  const migrationInterface = new MigrationInterface(app); 
  migrationInterface.analyzeAppStructure(); 
  process.exit(); // Exit after analysis to prevent further stack synthesis 
} 
// ---------------------------------------------------------------------------- 
// Terraform Architecture Mapping Tool Integration 
// ---------------------------------------------------------------------------- 
const useTerraformMappingTool = readlineSync.question('Do you want to use the Terraform Architecture Mapping Tool? (yes/no): '); 
if (useTerraformMappingTool.trim().toLowerCase() === 'yes') { 
  const cdkResources = [ 
    { type: 'AWS::EC2::VPC', properties: { CidrBlock: '10.0.0.0/16', Tags: { Name: 'TestVPC' } } }, 
    { type: 'AWS::ECS::Cluster', properties: { ClusterName: 'TestCluster', Tags: {} } }, 
  ]; 
  try { 
    console.log('Initializing Terraform Architecture Mapping Tool...'); 
    const terraformResources = mapCDKToTerraform(cdkResources); 
    console.log('Mapped Terraform Resources:', terraformResources); 
  } catch (error) { 
    console.error('Error during mapping:', error.message); 
    console.error('Error stack:', error.stack); 
  } 
  process.exit(); // Exit after mapping to prevent further stack synthesis 
} 
// ---------------------------------------------------------------------------- 
// Deployment Documentation Generator Integration 
// ---------------------------------------------------------------------------- 
const useDeploymentDocGenerator = readlineSync.question('Do you want to use the Deployment Documentation Generator? (yes/no): '); 
if (useDeploymentDocGenerator.trim().toLowerCase() === 'yes') { 
  try { 
    console.log('Starting Deployment Documentation Generator...'); 
    const outputDir = 'deployment_docs'; // Define the output directory 
    const docGenerator = new DeploymentDocGenerator(outputDir); 
    // Generate documentation 
    const documentation = docGenerator.generateDocumentation(); 
    console.log('Deployment documentation generated successfully.'); 
    console.log('Terraform Configuration:', documentation.terraformConfig); 
    console.log('Installation Steps:', documentation.installationSteps.join('\n')); 
    console.log('Deployment Pipeline:', JSON.stringify(documentation.deploymentPipeline, null, 2)); 
  } catch (error) { 
    console.error('Error during deployment documentation generation:', error.message); 
    console.error('Error stack:', error.stack); 
  } 
  process.exit(); // Exit after generating documentation to prevent further stack synthesis 
} 
// ---------------------------------------------------------------------------- 
// Initialisation (Global) 
// ---------------------------------------------------------------------------- 
let accountId: string | undefined = undefined; 
const environment = app.node.tryGetContext("environment"); 
const region = app.node.tryGetContext("region"); 
if (environment === undefined || !(typeof environment === 'string') || environment.trim() === '') { 
  throw new Error("Must pass a '-c environment=<environment>' context parameter e.g environment=Staging"); 
} 
let resolvedRegionName: RegionName; 
if (Object.values(RegionName).some((regionEnum: string) => regionEnum === region)) { 
  resolvedRegionName = region as RegionName; 
} else { 
  throw new Error("Must pass a valid region name, see definitions.ts"); 
} 
if (region === undefined || !(typeof region === 'string') || region.trim() === '') { 
  throw new Error("Must pass a '-c region=<region>' context parameter e.g environment=EuWest3"); 
} 
let resolvedEnvironmentName: EnvironmentName; 
if (Object.values(EnvironmentName).some((environmentEnum: string) => environmentEnum === environment)) { 
  resolvedEnvironmentName = environment as EnvironmentName; 
} else { 
  throw new Error("Must pass a valid environment name, see definitions.ts"); 
} 
const environmentNameUpper = getEnvironmentShortName(resolvedEnvironmentName, true); 
const environmentNameLower = getEnvironmentShortName(resolvedEnvironmentName, false); 
const regionCityName = getRegionCityName(resolvedRegionName); 
const regionLongName = getRegionLongName(resolvedRegionName); 
const regionShortName = getRegionShortName(resolvedRegionName); 
const regionFirstTwoCidr = getRegionIpCidr(resolvedRegionName); 
const secondaryAvailabilityZone = regionLongName + "b"; 
const internalAvailabilityZone = regionLongName + "c"; 
let natGatewayId: string; 
let grafanaDockerVersion: string; 
let grafanaDatabaseInstanceFamily: cdk.aws_ec2.InstanceClass; 
let grafanaDatabaseInstanceSize: cdk.aws_ec2.InstanceSize; 
let grafanaDatabaseAllocatedStorage: number; 
let grafanaDatabaseMaxStorage: number; 
let importRdsBastionSecurityGroup: boolean; 
let elasticSearchClusterType: string; 
let BKSBLive2ManagerAppStackVariables: EcsContainerConfiguration; 
let BKSBBuilderV5AppStackVariables: EcsContainerConfiguration; 
let bl2DatabaseSecurityGroupId: string; 
let bl2DatabaseSubnetAclId: string; 
let internalDatabaseSecurityGroupId: string; 
let internalDatabaseSubnetAclId: string; 
let retainAppSecrets: boolean; 
let importAppSecrets: boolean; 
switch (environmentNameLower) { 
  case "prod": 
    accountId = "203616038615"; 
    switch (regionLongName) { 
      case "eu-west-2": 
        natGatewayId = "nat-0803dcc7804983227"; 
        grafanaDockerVersion = "9.3.1"; 
        grafanaDatabaseInstanceFamily = cdk.aws_ec2.InstanceClass.T4G; 
        grafanaDatabaseInstanceSize = cdk.aws_ec2.InstanceSize.SMALL; 
        grafanaDatabaseAllocatedStorage = 50; 
        grafanaDatabaseMaxStorage = 150; 
        importRdsBastionSecurityGroup = false; 
        retainAppSecrets = true; 
        importAppSecrets = true; 
        elasticSearchClusterType = "r6g.xlarge.search"; 
        BKSBLive2ManagerAppStackVariables = { 
          ecrImageTag: "89-windows-ltsc2019-x86_64", 
          ecsContainerEnvVars: { 
            BKSB_APPSETTING_AWSEndPoint: "eu-west-1", 
            BKSB_APPSETTING_S3Feedback: "bksb-client-feedback", 
            BKSB_APPSETTING_S3AssessmentData: "bksbdevenginecontent", 
            BKSB_APPSETTING_S3ASSOBucket: "bksb-prod-asso-authorisation-eu-west-1", 
            BKSB_APPSETTING_AISTokenURL: "https://identity.oneadvanced.com/auth/realms/advanced-information-store/protocol/openid-connect/token", 
            BKSB_APPSETTING_AISURL: "https://information-store.prod.advancedplatform.services/v1/", 
            BKSB_APPSETTING_ASSOServiceUrl: "https://api.oneadvanced.com/identity/v3", 
            BKSB_APPSETTING_ASSOAuthTokenUrl: "https://identity.oneadvanced.com/auth/realms/", 
          }, 
        }; 
        BKSBBuilderV5AppStackVariables = { 
          ecrImageTag: "29-linux-x86_64", 
          ecsContainerEnvVars: { 
            Logging__IncludeScopes: "false", 
            Logging__LogLevel__Default: "Error", 
            Logging__LogLevel__System: "Error", 
            Logging__LogLevel__Microsoft: "Error", 
            Cookies__SameSitePolicy: "strict", 
            Cookies__SecurePolicy: "always", 
            BKSB__XSRF__CookieDomain: `builder5.${environmentNameLower}.${regionShortName}.bksb.dev`, 
            BKSB__XSRF__CookieName: "X-CSRF-TOKEN-BKSB-AUTH", 
            BKSB__XSRF__CookiePath: "/", 
            BKSB__XSRF__HeaderName: "X-CSRF-TOKEN-BKSB-AUTH", 
            BKSB__AUTH__ClaimIssuer: `builder5.${environmentNameLower}.${regionShortName}.bksb.dev`, 
            BKSB__AUTH__CookieDomain: `builder5.${environmentNameLower}.${regionShortName}.bksb.dev`, 
            BKSB__AUTH__CookieKeyPath: "path", 
            BKSB__AUTH__CookieKeyPartition: `builder5.${environmentNameLower}.${regionShortName}.bksb.dev`, 
            BKSB__AUTH__CookieKeyRegion: "eu-west-1", 
            BKSB__AUTH__CookieName: "auth-session", 
            BKSB__APP__CDNFileStore__UseLocal: "false", 
            BKSB__APP__CDNFileStore__Region: "eu-west-1", 
            BKSB__APP__CDNFileStore__RootPartition: "cdn.private.bksb.co.uk", 
            BKSB__APP__CDNFileStore__RootPath: "ecl/0.3.4/", 
            BKSB__APP__QuestionFileStore__UseLocal: "false", 
            BKSB__APP__QuestionFileStore__Region: "eu-west-1", 
            BKSB__APP__QuestionFileStore__RootPartition: "bksbbuildercontentdev", 
            BKSB__APP__QuestionFileStore__RootPath: "builderv5/questions_dev/", 
            BKSB__APP__PublishedQuestionFileStore__UseLocal: "false", 
            BKSB__APP__PublishedQuestionFileStore__Region: "eu-west-1", 
            BKSB__APP__PublishedQuestionFileStore__RootPartition: "bksbdevenginecontent", 
            BKSB__APP__PublishedQuestionFileStore__RootPath: "assessment-engine/questions/", 
            BKSB__APP__ResourceFileStore__UseLocal: "false", 
            BKSB__APP__ResourceFileStore__Region: "eu-west-1", 
            BKSB__APP__ResourceFileStore__RootPartition: "bksbbuildercontentdev", 
            BKSB__APP__ResourceFileStore__RootPath: "builderv5/resources_dev/", 
            BKSB__APP__PublishedResourceFileStore__UseLocal: "false", 
            BKSB__APP__PublishedResourceFileStore__Region: "eu-west-1", 
            BKSB__APP__PublishedResourceFileStore__RootPartition: "bksbdevenginecontent", 
            BKSB__APP__PublishedResourceFileStore__RootPath: "resource-engine/questions/", 
            BKSB__APP__MediaFileStore__UseLocal: "false", 
            BKSB__APP__MediaFileStore__Region: "eu-west-1", 
            BKSB__APP__MediaFileStore__RootPartition: "bksbbuildercontentdev", 
            BKSB__APP__MediaFileStore__RootPath: "builderv5/media_dev/", 
            BKSB__APP__PublishedMediaFileStore__UseLocal: "false", 
            BKSB__APP__PublishedMediaFileStore__Region: "eu-west-1", 
            BKSB__APP__PublishedMediaFileStore__RootPartition: "bksbcloudfront", 
            BKSB__APP__PublishedMediaFileStore__RootPath: "/", 
          }, 
        }; 
        bl2DatabaseSecurityGroupId = "sg-05f9f0299f14a9948"; 
        bl2DatabaseSubnetAclId = "acl-0750a8d498105e905"; 
        internalDatabaseSecurityGroupId = "sg-0c53519e9ed9d867b"; 
        internalDatabaseSubnetAclId = "acl-023c492b5ac62cbb2"; 
        break; 
      case "ap-southeast-2": 
        natGatewayId = "nat-08063b2296f962a40"; 
        grafanaDockerVersion = "9.3.1"; 
        grafanaDatabaseInstanceFamily = cdk.aws_ec2.InstanceClass.T4G; 
        grafanaDatabaseInstanceSize = cdk.aws_ec2.InstanceSize.SMALL; 
        grafanaDatabaseAllocatedStorage = 50; 
        grafanaDatabaseMaxStorage = 150; 
        importRdsBastionSecurityGroup = true; 
        retainAppSecrets = true; 
        importAppSecrets = true; 
        elasticSearchClusterType = "r6g.large.search"; 
        BKSBLive2ManagerAppStackVariables = { 
          ecrImageTag: "89-windows-ltsc2019-x86_64", 
          ecsContainerEnvVars: { 
            BKSB_APPSETTING_AWSEndPoint: "eu-west-1", 
            BKSB_APPSETTING_S3Feedback: "bksb-client-feedback", 
          }, 
        }; 
        BKSBBuilderV5AppStackVariables = { 
          ecrImageTag: "", 
          ecsContainerEnvVars: {}, 
        }; 
        bl2DatabaseSecurityGroupId = "sg-08f8e6e10bb2dc9f3"; 
        bl2DatabaseSubnetAclId = "acl-02fe19505b9ed7dcb"; 
        internalDatabaseSecurityGroupId = "sg-05c0398ef49c4b801"; 
        internalDatabaseSubnetAclId = "acl-09c6ad97da6997523"; 
        break; 
      default: 
        throw new Error(`Please define default variables for ${regionLongName}.`); 
    } 
    break; 
  case "stage": 
    accountId = "352515133004"; 
    switch (regionLongName) { 
      case "eu-west-2": 
        natGatewayId = "nat-019f4440ede199167"; 
        grafanaDockerVersion = "9.3.1"; 
        grafanaDatabaseInstanceFamily = cdk.aws_ec2.InstanceClass.T4G; 
        grafanaDatabaseInstanceSize = cdk.aws_ec2.InstanceSize.SMALL; 
        grafanaDatabaseAllocatedStorage = 50; 
        grafanaDatabaseMaxStorage = 150; 
        importRdsBastionSecurityGroup = true; 
        retainAppSecrets = true; 
        importAppSecrets = true; 
        elasticSearchClusterType = "r6g.xlarge.search"; 
        BKSBLive2ManagerAppStackVariables = { 
          ecrImageTag: "89-windows-ltsc2019-x86_64", 
          ecsContainerEnvVars: { 
            BKSB_APPSETTING_AWSEndPoint: "eu-west-1", 
            BKSB_APPSETTING_S3Feedback: "bksb-client-feedback", 
            BKSB_APPSETTING_S3AssessmentData: "bksbdevenginecontent-stage", 
            BKSB_APPSETTING_S3ASSOBucket: "bksb-stage-asso-authorisation-eu-west-1", 
            BKSB_APPSETTING_AISTokenURL: "https://dev.identity.oneadvanced.io/auth/realms/advanced-information-store/protocol/openid-connect/token", 
            BKSB_APPSETTING_AISURL: "https://information-store.dev.advancedplatform.services/v1/", 
            BKSB_APPSETTING_ASSOAuthTokenUrl: "https://dev.identity.oneadvanced.io/auth/realms/", 
            BKSB_APPSETTING_ASSOServiceUrl: "https://api.oneadvanced.io/identity/v3", 
          }, 
        }; 
        BKSBBuilderV5AppStackVariables = { 
          ecrImageTag: "29-linux-x86_64", 
          ecsContainerEnvVars: { 
            Logging__IncludeScopes: "false", 
            Logging__LogLevel__Default: "Error", 
            Logging__LogLevel__System: "Error", 
            Logging__LogLevel__Microsoft: "Error", 
            Cookies__SameSitePolicy: "strict", 
            Cookies__SecurePolicy: "always", 
            BKSB__XSRF__CookieDomain: `builder5.${environmentNameLower}.${regionShortName}.bksb.dev`, 
            BKSB__XSRF__CookieName: "X-CSRF-TOKEN-BKSB-AUTH", 
            BKSB__XSRF__CookiePath: "/", 
            BKSB__XSRF__HeaderName: "X-CSRF-TOKEN-BKSB-AUTH", 
            BKSB__AUTH__ClaimIssuer: `builder5.${environmentNameLower}.${regionShortName}.bksb.dev`, 
            BKSB__AUTH__CookieDomain: `builder5.${environmentNameLower}.${regionShortName}.bksb.dev`, 
            BKSB__AUTH__CookieKeyPath: "path", 
            BKSB__AUTH__CookieKeyPartition: `builder5.${environmentNameLower}.${regionShortName}.bksb.dev`, 
            BKSB__AUTH__CookieKeyRegion: "eu-west-1", 
            BKSB__AUTH__CookieName: "auth-session", 
            BKSB__APP__CDNFileStore__UseLocal: "false", 
            BKSB__APP__CDNFileStore__Region: "eu-west-1", 
            BKSB__APP__CDNFileStore__RootPartition: "cdn.private.bksb-dev.co.uk", 
            BKSB__APP__CDNFileStore__RootPath: "ecl/0.3.7/", 
            BKSB__APP__QuestionFileStore__UseLocal: "false", 
            BKSB__APP__QuestionFileStore__Region: "eu-west-1", 
            BKSB__APP__QuestionFileStore__RootPartition: "bksbdevenginecontent-stage", 
            BKSB__APP__QuestionFileStore__RootPath: "dev/builderv5/questions_dev/", 
            BKSB__APP__PublishedQuestionFileStore__UseLocal: "false", 
            BKSB__APP__PublishedQuestionFileStore__Region: "eu-west-1", 
            BKSB__APP__PublishedQuestionFileStore__RootPartition: "bksbdevenginecontent-stage", 
            BKSB__APP__PublishedQuestionFileStore__RootPath: "assessment-engine/questions/", 
            BKSB__APP__ResourceFileStore__UseLocal: "false", 
            BKSB__APP__ResourceFileStore__Region: "eu-west-1", 
            BKSB__APP__ResourceFileStore__RootPartition: "bksbdevenginecontent-stage", 
            BKSB__APP__ResourceFileStore__RootPath: "dev/builderv5/resources_dev/", 
            BKSB__APP__PublishedResourceFileStore__UseLocal: "false", 
            BKSB__APP__PublishedResourceFileStore__Region: "eu-west-1", 
            BKSB__APP__PublishedResourceFileStore__RootPartition: "bksbdevenginecontent-stage", 
            BKSB__APP__PublishedResourceFileStore__RootPath: "resource-engine/questions/", 
            BKSB__APP__MediaFileStore__UseLocal: "false", 
            BKSB__APP__MediaFileStore__Region: "eu-west-1", 
            BKSB__APP__MediaFileStore__RootPartition: "bksbdevenginecontent-stage", 
            BKSB__APP__MediaFileStore__RootPath: "dev/builderv5/media_dev/", 
            BKSB__APP__PublishedMediaFileStore__UseLocal: "false", 
            BKSB__APP__PublishedMediaFileStore__Region: "eu-west-1", 
            BKSB__APP__PublishedMediaFileStore__RootPartition: "bksbcloudfront-staging", 
            BKSB__APP__PublishedMediaFileStore__RootPath: "/", 
          }, 
        }; 
        bl2DatabaseSecurityGroupId = "sg-05f2aa0eb8433912f"; 
        bl2DatabaseSubnetAclId = "acl-0e1e624befa56cc04"; 
        internalDatabaseSecurityGroupId = "sg-0a449d47d101b25eb"; 
        internalDatabaseSubnetAclId = "acl-09ec5c80313bbd224"; 
        break; 
      default: 
        throw new Error(`Please define default variables for ${regionLongName}.`); 
    } 
    break; 
  default: 
    throw new Error(`The environment ${environmentNameLower} does not have any regions.`); 
} 
if (accountId === undefined) { 
  throw new Error("accountId must be defined as part of the environment configuration."); 
} 
// ---------------------------------------------------------------------------- 
// Stack Code (Global) 
// ---------------------------------------------------------------------------- 
const managementStack = new ManagementStack(app, `${environmentNameUpper}ManagementStack${regionCityName}`, { 
  env: { account: accountId, region: regionLongName }, 
  environment: environmentNameLower, 
  managementSubnetAz: internalAvailabilityZone, 
  managementSubnetCidr: `${regionFirstTwoCidr}.10.0/24`, 
  bksbManagementAppsSubnetAz: internalAvailabilityZone, 
  bksbManagementAppsSubnetCidr: `${regionFirstTwoCidr}.13.0/24`, 
  cloudflareSubnetAz: internalAvailabilityZone, 
  cloudflareSubnetCidr: `${regionFirstTwoCidr}.14.0/24`, 
  bastionSubnetAz: internalAvailabilityZone, 
  bastionSubnetCidr: `${regionFirstTwoCidr}.17.0/24`, 
  natGatewayId, 
});