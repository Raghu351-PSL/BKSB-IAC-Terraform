terraform { 
  backend "s3" { 
    bucket         = "your-s3-backend-bucket-name" // INPUT_REQUIRED {Provide the name of your S3 bucket} 
    key            = "terraform/state-file.tfstate" 
    region         = "your-aws-region" // INPUT_REQUIRED {Specify your AWS region, e.g., us-east-1} 
    dynamodb_table = "your-dynamodb-lock-table-name" // INPUT_REQUIRED {Provide the name of your DynamoDB lock table} 
    encrypt        = true 
  } 
} 
provider "aws" { 
  region = "your-aws-region" // INPUT_REQUIRED {Specify your AWS region, e.g., us-east-1} 
} 
resource "aws_s3_bucket" "state_backend" { 
  bucket = "your-s3-backend-bucket-name" // INPUT_REQUIRED {Provide the name of your S3 bucket} 
  acl = "private" 
  versioning { 
    enabled = true 
  } 
  server_side_encryption_configuration { 
    rule { 
      apply_server_side_encryption_by_default { 
        sse_algorithm = "AES256" 
      } 
    } 
  } 
} 
resource "aws_dynamodb_table" "lock_table" { 
  name         = "your-dynamodb-lock-table-name" // INPUT_REQUIRED {Provide the name of your DynamoDB lock table} 
  billing_mode = "PAY_PER_REQUEST" 
  hash_key = "LockID" 
  attribute { 
    name = "LockID" 
    type = "S" 
  } 
} 