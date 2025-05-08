import * as cdk from 'aws-cdk-lib'; 
import { Template } from 'aws-cdk-lib/assertions'; 
import { Stack } from 'aws-cdk-lib'; 
import { MigrationBackend } from '../lib/migration-backend'; 
test('MigrationBackend module creates resources correctly', () => { 
  const stack = new Stack(); 
  new MigrationBackend(stack, 'TestMigrationBackend', { 
    bucketName: 'test-terraform-state-bucket', 
    dynamoTableName: 'test-terraform-state-lock-table', 
    kmsAliasName: 'test-terraform-key-alias', 
  }); 
  const template = Template.fromStack(stack); 
  // Assert S3 Bucket 
  template.hasResourceProperties('AWS::S3::Bucket', { 
    BucketName: 'test-terraform-state-bucket', 
    VersioningConfiguration: { 
      Status: 'Enabled', 
    }, 
    BucketEncryption: { 
      ServerSideEncryptionConfiguration: [ 
        { 
          ServerSideEncryptionByDefault: { 
            SSEAlgorithm: 'aws:kms', 
          }, 
        }, 
      ], 
    }, 
  }); 
  // Assert DynamoDB Table 
  template.hasResourceProperties('AWS::DynamoDB::Table', { 
    TableName: 'test-terraform-state-lock-table', 
    KeySchema: [ 
      { 
        AttributeName: 'LockID', 
        KeyType: 'HASH', 
      }, 
    ], 
    BillingMode: 'PAY_PER_REQUEST', 
  }); 
  // Assert KMS Key 
  template.hasResourceProperties('AWS::KMS::Key', { 
    EnableKeyRotation: true, 
  }); 
  // Additional validation for backend configuration output 
  template.hasOutput('BackendConfig', { 
    Description: 'Terraform Backend Configuration', 
    Value: JSON.stringify({ 
      s3_bucket: 'test-terraform-state-bucket', 
      dynamodb_table: 'test-terraform-state-lock-table', 
      kms_key_arn: { 
        'Fn::GetAtt': ['TestMigrationBackendKmsKeyA4922B3F', 'Arn'], 
      }, 
      region: stack.region, 
    }), 
  }); 
});