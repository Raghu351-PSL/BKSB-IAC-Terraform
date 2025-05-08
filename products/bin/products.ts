#!/usr/bin/env node 
import 'source-map-support/register'; 
import * as cdk from 'aws-cdk-lib'; 
import { ProductStack } from '../lib/product-stack'; 
import * as ec2 from 'aws-cdk-lib/aws-ec2'; 
import { CloudfrontStack } from '../lib/cloudfront-stack'; 
import { bksbUpdatesLambdaStack } from '../lib/bksb-updates-lambda-stack'; 
import * as rds from 'aws-cdk-lib/aws-rds'; 
import { BKSBAppsCoreStack } from '../lib/bksb-apps-core-stack'; 
import { BKSBNewsAppStack } from '../lib/bksb-news-app-stack'; 
import { BKSBStandaloneAPIAppStack } from '../lib/bksb-standalone-api-app-stack'; 
import { BKSBLive2AppStack } from '../lib/bksblive2-app-stack'; 
import { BKSBLive2ReportsAppStack } from '../lib/bksblive2-reports-app-stack'; 
import { BKSBLive2APIAppStack } from '../lib/bksblive2-api-app-stack'; 
import { BKSBReformsAPIStack } from '../lib/bksb-reforms-api-app-stack'; 
import { BKSBReformsWebClientStack } from '../lib/bksb-reforms-web-client-app-stack'; 
import { EcsContainerConfiguration, EnvironmentName, getEnvironmentLongName, getEnvironmentShortName, getRegionCityName, getRegionIpCidr, getRegionLongName, getRegionShortName, RegionName } from '../../base/lib/definitions'; 
import { DataPlatformAppStack } from '../lib/bksb-data-platform-stack'; 
const app = new cdk.App(); 
// ---------------------------------------------------------------------------- 
// Initialisation (Global) 
// ---------------------------------------------------------------------------- 
let accountId = undefined; 
const environment = app.node.tryGetContext("environment"); 
const region = app.node.tryGetContext("region"); 
if (environment === undefined || !(typeof (environment) === 'string') || environment.trim() === '') { 
  throw new Error("Must pass a '-c environment=<environment>' context parameter e.g environment=Staging"); 
} 
let resolvedRegionName: RegionName; 
if (Object.values(RegionName).some((regionEnum: string) => regionEnum === region)) { 
  resolvedRegionName = <RegionName>region; 
} else { 
  throw new Error("Must pass a valid region name, see definitions.ts"); 
} 
if (region === undefined || !(typeof (region) === 'string') || region.trim() === '') { 
  throw new Error("Must pass a '-c region=<region>' context parameter e.g environment=EuWest3"); 
} 
let resolvedEnvironmentName: EnvironmentName; 
if (Object.values(EnvironmentName).some((environmentEnum: string) => environmentEnum === environment)) { 
  resolvedEnvironmentName = <EnvironmentName>environment; 
} else { 
  throw new Error("Must pass a valid environment name, see definitions.ts"); 
} 
const environmentNameUpper = getEnvironmentShortName(resolvedEnvironmentName, true); 
const environmentNameLower = getEnvironmentShortName(resolvedEnvironmentName, false); 
const environmentNameLong = getEnvironmentLongName(resolvedEnvironmentName, false); 
const regionCityName = getRegionCityName(resolvedRegionName); 
const regionLongName = getRegionLongName(resolvedRegionName); 
const regionShortName = getRegionShortName(resolvedRegionName); 
const regionFirstTwoCidr = getRegionIpCidr(resolvedRegionName); 
const primaryAvailabilityZone = regionLongName + "a"; 
const secondaryAvailabilityZone = regionLongName + "b"; 
const internalAvailabilityZone = regionLongName + "c"; 
let natGatewayId: string; 
let productionInstanceFamily: ec2.InstanceClass; 
let productionInstanceSize: ec2.InstanceSize; 
let productionMssqlEngineType: rds.IInstanceEngine; 
let productionAllocatedStorage: number; 
let productionMaxAllocatedStorage: number; 
let productionRedisInstanceType: string; 
let live2RDSOptionGroup: string; 
let live2RDSParameterGroup: string; 
let internalInstanceFamily: ec2.InstanceClass; 
let internalInstanceSize: ec2.InstanceSize; 
let internalAllocatedStorage: number; 
let internalMssqlEngineType: rds.IInstanceEngine; 
let internalMaxAllocatedStorage: number; 
let internalRDSOptionGroup: string; 
let internetGatewayId: string; 
let cloudfrontSSLCertificateArn: string; //US-EAST-1 ACM ARN ONLY 
let albLiveTGSSLCertificateArn: string; 
let albTestTGSSLCertificateArn: string; 
let cloudfrontDomains: string[]; 
let bksbUpdatesCloudfrontDomains: string[]; 
let deployBksbUpdatesCloudfront: boolean; 
let cloudMapNamespaceId: string; 
let BKSBStandaloneAPIAppVariables: EcsContainerConfiguration; 
let BKSBLive2AppVariables: EcsContainerConfiguration; 
let BKSBLive2ReportsAppVariables: EcsContainerConfiguration; 
let BKSBLive2APIAppVariables: EcsContainerConfiguration; 
let BKSBNewsAppVariables: EcsContainerConfiguration; 
let BKSBReformsAPIAppVariables: EcsContainerConfiguration; 
let BKSBReformsWebClientAppVariables: EcsContainerConfiguration; 
let retainAppSecrets: boolean; 
let importAppSecrets: boolean; 
let createALBAccessLogsBucket: boolean; 
let hostingDomain = null; 
let dataPlatformVpcPeeringId: string; 
let dataPlatformNetworkAclId: string; 
let dataPlatformSecurityGroupId: string; 
let dataPlatformVpcName: string; 
let kafkaConnectDatabaseSecretName: string; 
let kafkaConnectTaskRoleArn: string; 
switch (environmentNameLower) { 
  // ---------------------------------------------------------------------------- 
  // Production 
  // ---------------------------------------------------------------------------- 
  case "prod": 
    accountId = "203616038615"; 
    switch (regionLongName) { 
      case "eu-west-2": 
        hostingDomain = `bksblive2.co.uk`; 
        natGatewayId = "nat-0803dcc7804983227"; 
        productionInstanceFamily = ec2.InstanceClass.M5; 
        productionInstanceSize = ec2.InstanceSize.XLARGE4; 
        productionMssqlEngineType = rds.DatabaseInstanceEngine.sqlServerEe({ 
          version: rds.SqlServerEngineVersion.VER_15_00_4236_7_V1 
        }); 
        productionAllocatedStorage = 2500; 
        productionMaxAllocatedStorage = 3500; 
        productionRedisInstanceType = "cache.r6g.large"; 
        live2RDSOptionGroup = 'prod-migration-option-group-ee'; 
        live2RDSParameterGroup = 'prod-bl2-ee-parameter-group'; 
        internalInstanceFamily = ec2.InstanceClass.T3; 
        internalInstanceSize = ec2.InstanceSize.MEDIUM; 
        internalAllocatedStorage = 100; 
        internalMaxAllocatedStorage = 250; 
        internalMssqlEngineType = rds.DatabaseInstanceEngine.sqlServerWeb({ 
          version: rds.SqlServerEngineVersion.VER_15_00_4236_7_V1 
        }); 
        internalRDSOptionGroup = 'prod-internal-migration-option-group'; 
        internetGatewayId = "igw-0c3b4cb76df9c6946"; 
        cloudfrontSSLCertificateArn = "arn:aws:acm:us-east-1:203616038615:certificate/77e802f0-04f2-48ba-80fc-73977e4449b6"; 
        albLiveTGSSLCertificateArn = "arn:aws:acm:eu-west-2:203616038615:certificate/a37a1e96-9669-4cf7-a402-07a38e807891"; 
        albTestTGSSLCertificateArn = "arn:aws:acm:eu-west-2:203616038615:certificate/a37a1e96-9669-4cf7-a402-07a38e807891"; 
        cloudfrontDomains = [`${hostingDomain}`, `*.${hostingDomain}`]; 
        bksbUpdatesCloudfrontDomains = ["updates.bksb.co.uk"]; 
        deployBksbUpdatesCloudfront = true; 
        cloudMapNamespaceId = "ns-uohqrzoltpjjfexd"; 
        retainAppSecrets = true; 
        importAppSecrets = true; 
        createALBAccessLogsBucket = false; 
        dataPlatformVpcPeeringId = "pcx-08c884d9e61489923"; 
        dataPlatformNetworkAclId = "acl-0fd914a069bd493e8"; 
        dataPlatformSecurityGroupId = "sg-06a7954e907debfe2"; 
        dataPlatformVpcName = "data_platform_vpc_f670b2d0"; 
        kafkaConnectDatabaseSecretName = "prod/data-platform/bl2-credentials"; 
        kafkaConnectTaskRoleArn = "arn:aws:iam::203616038615:role/SC-203616038615-pp-k57fhw-AdpConnectResourcesKafkaC-DCGLxtvbjfRp"; 
        BKSBStandaloneAPIAppVariables = { 
          ecrImageTag: "5-windows-ltsc2019-x86_64", 
          ecsContainerEnvVars: { 
            "BKSB_APPSETTING_ServicesTransferKeyBucket": "bksbappkeysuk", 
            "BKSB_APPSETTING_ServicesTransferKeyBucketRegion": "eu-west-2", 
            "BKSB_APPSETTING_ServicesDomain": "services.bksb.co.uk" 
          } 
        }, 
          BKSBLive2AppVariables = { 
            ecrImageTag: "589-windows-ltsc2019-x86_64", 
            ecsContainerEnvVars: { 
              "BKSB_APPSETTING_ApplicationContentPath": "{{appRoot}}", 
              "BKSB_APPSETTING_StaticContentRoot": "bksbcloudfront.bksblive.co.uk/bksblive1/", 
              "BKSB_APPSETTING_ContentRoot": "bksbcloudfront.bksblive.co.uk/bksblive2/", 
              "BKSB_APPSETTING_CDNPath": "//cdn.bksb.co.uk/", 
              "BKSB_APPSETTING_AssessmentEngineRoot": "bksbcloudfront.bksblive.co.uk/bksblive1/", 
              "BKSB_APPSETTING_bksbLiveDomain": `${hostingDomain}`, 
              "BKSB_APPSETTING_ReportingDomain": `reports.${hostingDomain}`, 
              "BKSB_APPSETTING_StandaloneApiUrl": `api.${hostingDomain}/bksbapi/`, 
              "BKSB_APPSETTING_BKSBNewsUrl": `news.${hostingDomain}/news/`, 
              "BKSB_APPSETTING_S3SecureDataBucket": "bksblive-secure-data-uk", 
              "BKSB_APPSETTING_CloudFrontLogoFolder": "uk", 
              "BKSB_APPSETTING_S3ePortfolioBucket": "bksbeportfolio", 
              "BKSB_APPSETTING_S3TempFiles": "bksblive2tempfiles", 
              "BKSB_APPSETTING_AWSEndPoint": "eu-west-1", 
              "BKSB_APPSETTING_Live2ApiUrl": `live2api.${hostingDomain}/`, 
              "BKSB_APPSETTING_S3Feedback": "bksb-client-feedback", 
              "BKSB_APPSETTING_ServicesTransferKeyBucket": "bksbdevappkeysuk", 
              "BKSB_APPSETTING_ServicesTransferKeyBucketRegion": "eu-west-2", 
              "BKSB_APPSETTING_ServicesDomain": "services.bksb-demo.co.uk", 
              "BKSB_APPSETTING_S3MergeBucket": "bksb-merge-backups-uk", 
              "BKSB__APP__TransferTokenSigningKeyRootPartition": "bksb-fargate-ireland-key", 
              "BKSB_APPSETTING_ASSOAuthenticationDomain": "bksblive2.co.uk", 
              "BKSB_APPSETTING_ASSOAuthenticationUrl": "https://auth.identity.oneadvanced.com/auth/", 
              "BKSB_APPSETTING_ASSOAuthTokenUrl": "https://identity.oneadvanced.com/auth/realms/", 
              "BKSB_APPSETTING_ASSOServiceUrl": "https://api.oneadvanced.com/identity/v3", 
              "BKSB_APPSETTING_ASSOProductTenantIdSuffix": "-bksb", 
              "BKSB_APPSETTING_AISTokenURL": "https://identity.oneadvanced.com/auth/realms/advanced-information-store/protocol/openid-connect/token", 
              "BKSB_APPSETTING_AISURL": "https://information-store.prod.advancedplatform.services/v1/" 
            } 
          }, 
          BKSBLive2ReportsAppVariables = { 
            ecrImageTag: "411-windows-ltsc2019-x86_64", 
            ecsContainerEnvVars: { 
              "BKSB_APPSETTING_ApplicationContentPath": "{{appRoot}}", 
              "BKSB_APPSETTING_StaticContentRoot": "bksbcloudfront.bksblive.co.uk/bksblive1/", 
              "BKSB_APPSETTING_ContentRoot": "bksbcloudfront.bksblive.co.uk/bksblive2/", 
              "BKSB_APPSETTING_CDNPath": "//cdn.bksb.co.uk/", 
              "BKSB_APPSETTING_AssessmentEngineRoot": "bksbcloudfront.bksblive.co.uk/bksblive1/", 
              "BKSB_APPSETTING_bksbLiveDomain": `${hostingDomain}`, 
              "BKSB_APPSETTING_ReportingDomain": `reports.${hostingDomain}`, 
              "BKSB_APPSETTING_S3SecureDataBucket": "bksblive-secure-data-uk", 
              "BKSB_APPSETTING_AWSEndPoint": "eu-west-1", 
              "BKSB_APPSETTING_S3Feedback": "bksb-client-feedback", 
              "BKSB_SESSIONSTATE_OperationTimeoutMS": "60000" 
            } 
          }, 
          BKSBLive2APIAppVariables = { 
            ecrImageTag: "20-windows-ltsc2019-x86_64", 
            ecsContainerEnvVars: { 
              "BKSB_APPSETTING_bksbLiveDomain": `${hostingDomain}`, 
              "BKSB_APPSETTING_S3SecureDataBucket": "bksblive-secure-data-uk", 
              "BKSB_APPSETTING_AWSEndPoint": "eu-west-1", 
              "BKSB_APPSETTING_AISTokenURL": "https://identity.oneadvanced.com/auth/realms/advanced-information-store/protocol/openid-connect/token", 
              "BKSB_APPSETTING_AISURL": "https://information-store.prod.advancedplatform.services/v1/" 
            } 
          }, 
          BKSBNewsAppVariables = { 
            ecrImageTag: "10-windows-ltsc2019-x86_64", 
            ecsContainerEnvVars: {} 
          }, 
          BKSBReformsAPIAppVariables = { 
            ecrImageTag: "98-linux-x86_64", 
            ecsContainerEnvVars: { 
              "ASPNETCORE_ENVIRONMENT": "Production", 
              "ASPNETCORE_URLS": "https://+:443", 
              "Sentry__Debug": "false", 
              "BKSB__APP__AssessmentResultFileStoreRegion": "eu-west-1", 
              "BKSB__APP__AssessmentResultRootPartition": "bksbdevenginecontent", 
              "BKSB__APP__AssessmentResultRootPath": "assessment-engine/assessment-results-live/", 
              "BKSB__APP__CourseFileStoreRegion": "eu-west-1", 
              "BKSB__APP__ProgressFileStoreRegion": "eu-west-1" 
            } 
          } 
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
const DBStack = new ProductStack(app, `${environmentNameUpper}ProductStack${regionCityName}`, { 
  env: { account: accountId, region: regionLongName } 
});