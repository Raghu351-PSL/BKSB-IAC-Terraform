terraform { 
  backend "s3" { 
    bucket         = "my-terraform-state" // INPUT_REQUIRED {S3 bucket name to store Terraform state} 
    key            = "global/terraform.tfstate" // INPUT_REQUIRED {Path within the bucket for the state file} 
    region         = "us-east-1" // INPUT_REQUIRED {AWS region where the S3 bucket is located} 
    dynamodb_table = "terraform-state-lock" // INPUT_REQUIRED {DynamoDB table name for state locking and consistency} 
  } 
} 