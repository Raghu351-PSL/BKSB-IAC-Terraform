# Define the Terraform backend for state management 
terraform { 
  required_version = ">= 1.10.5" 
  backend "s3" { 
    bucket         = "your-terraform-state-bucket" // INPUT_REQUIRED {Specify your S3 bucket for storing Terraform state} 
    key            = "global/terraform.tfstate" 
    region         = "us-west-2" // INPUT_REQUIRED {Update the region where your S3 bucket resides} 
    dynamodb_table = "terraform-lock-table" // INPUT_REQUIRED {Specify the DynamoDB table for locking Terraform state} 
  } 
} 
provider "aws" { 
  region = var.aws_region 
} 
# Call modules for infrastructure setup 
module "vpc" { 
  source = "./modules/vpc" 
  vpc_name = var.vpc_name 
} 
module "ecs" { 
  source = "./modules/ecs" 
  cluster_name = var.cluster_name 
} 
module "rds" { 
  source = "./modules/rds" 
  db_name = var.db_name 
} 
module "alb" { 
  source = "./modules/alb" 
} 
module "secrets" { 
  source = "./modules/secrets" 
} 