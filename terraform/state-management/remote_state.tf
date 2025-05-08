terraform { 
  backend "s3" { 
    bucket         = "my-terraform-state-bucket"         // INPUT_REQUIRED {Specify your S3 bucket name for Terraform state storage} 
    key            = "state/<ENVIRONMENT>/terraform.tfstate" // INPUT_REQUIRED {Specify <ENVIRONMENT> to represent the target environment, e.g., staging, production} 
    region         = "us-east-1"                         // INPUT_REQUIRED {Specify your AWS region for the S3 bucket} 
    encrypt        = true                                // Ensures state file encryption for security 
    dynamodb_table = "terraform-state-lock"              // INPUT_REQUIRED {Provide the DynamoDB table name for state locking} 
  } 
} 
provider "aws" { 
  region  = var.aws_region    // AWS region passed from variables 
  profile = var.aws_profile   // AWS CLI profile passed from variables 
} 