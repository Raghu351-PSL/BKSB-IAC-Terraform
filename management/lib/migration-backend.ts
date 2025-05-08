import * as cdk from 'aws-cdk-lib'; 
import { aws_s3 as s3, aws_dynamodb as dynamodb, aws_kms as kms } from 'aws-cdk-lib'; 
import { Construct } from 'constructs'; 
export interface MigrationBackendProps { 
  readonly bucketName: string; 
  readonly dynamoTableName: string; 
  readonly kmsAliasName: string; 
  readonly region?: string; 
} 
export class MigrationBackend extends Construct { 
  public readonly s3Bucket: s3.Bucket; 
  public readonly dynamoDBTable: dynamodb.Table; 
  public readonly kmsKey: kms.Key; 
  constructor(scope: Construct, id: string, props: MigrationBackendProps) { 
    super(scope, id); 
    try { 
      console.log("Initializing KMS key for encryption..."); 
      // Create KMS Key for Encryption 
      this.kmsKey = new kms.Key(this, 'KmsKey', { 
        alias: props.kmsAliasName, 
        enableKeyRotation: true, 
      }); 
      console.log(`KMS Key created successfully with alias: ${props.kmsAliasName}`); 
      console.log("Setting up S3 bucket for Terraform state storage..."); 
      // S3 Bucket for Terraform State Storage 
      this.s3Bucket = new s3.Bucket(this, 'TerraformStateBucket', { 
        bucketName: props.bucketName, 
        encryption: s3.BucketEncryption.KMS, 
        encryptionKey: this.kmsKey, 
        versioned: true, 
        publicReadAccess: false, 
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, 
      }); 
      console.log(`S3 bucket ${props.bucketName} configured successfully with KMS encryption.`); 
      console.log("Setting up DynamoDB table for state locking..."); 
      // DynamoDB Table for State Locking 
      this.dynamoDBTable = new dynamodb.Table(this, 'TerraformStateLockTable', { 
        tableName: props.dynamoTableName, 
        partitionKey: { name: 'LockID', type: dynamodb.AttributeType.STRING }, 
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
        removalPolicy: cdk.RemovalPolicy.RETAIN, 
      }); 
      console.log(`DynamoDB table ${props.dynamoTableName} configured successfully.`); 
      console.log("Outputting Terraform backend configuration..."); 
      // Output Terraform backend configuration 
      new cdk.CfnOutput(this, 'BackendConfig', { 
        value: JSON.stringify({ 
          s3_bucket: this.s3Bucket.bucketName, 
          dynamodb_table: this.dynamoDBTable.tableName, 
          kms_key_arn: this.kmsKey.keyArn, 
          region: props.region ?? cdk.Stack.of(this).region, 
        }), 
        description: 'Terraform Backend Configuration', 
      }); 
      console.log("Terraform backend configuration successfully output."); 
    } catch (error) { 
      console.error("An error occurred while setting up the migration backend:", error.message, error.stack); 
      throw error; 
    } 
  } 
} 