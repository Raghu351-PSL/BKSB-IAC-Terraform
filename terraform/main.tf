provider "aws" { 
  region = var.region 
} 
module "vpc" { 
  source           = "./vpc" 
  cidr_block       = var.vpc_cidr 
  private_subnets  = var.private_subnets 
  public_subnets   = var.public_subnets 
  common_tags      = var.common_tags 
  environment      = var.environment 
} 
module "kms" { 
  source      = "./kms" 
  description = "Encryption key for ${var.environment}" 
  common_tags = var.common_tags 
  environment = var.environment 
} 
output "vpc_id" { 
  value = module.vpc.vpc_id 
} 
output "kms_key_id" { 
  value = module.kms.kms_key_id 
} terraform { 
  required_version = ">= 1.10.5" 
  backend "s3" { 
    bucket         = "my-terraform-state-bucket"   # INPUT_REQUIRED {Replace with actual bucket name} 
    key            = "global/terraform.tfstate"   # Key prefix for state files 
    region         = "us-west-2"                  # INPUT_REQUIRED {Replace with the necessary region} 
    dynamodb_table = "terraform-lock-table"       # INPUT_REQUIRED {Replace with DynamoDB state-locking table name} 
    encrypt        = true 
  } 
} 
provider "aws" { 
  region = var.aws_region 
} 
module "networking" { 
  source        = "./modules/networking" 
  vpc_cidr      = var.vpc_cidr 
  environment   = terraform.workspace 
} 
module "ecs_cluster" { 
  source        = "./modules/ecs-cluster" 
  environment   = terraform.workspace 
} 
output "vpc_id" { 
  value = module.networking.vpc_id 
} 
output "ecs_cluster_name" { 
  value = module.ecs_cluster.cluster_name 
} module "iam" { 
  source                  = "./modules/iam" 
  role_name               = "example-app-role" 
  role_description        = "Role for Example Application" 
  assume_role_policy_path = "./policies/assume-role-policy.json" 
  policy_name             = "example-app-policy" 
  policy_description      = "Policy for Example Application" 
  policy_path             = "./policies/example-app-policy.json" 
  policy_attachment_name  = "example-app-policy-attachment" 
  tags                    = { 
    Environment = var.environment 
    Application = "ExampleApp" 
  } 
} 
module "secrets" { 
  source           = "./modules/secrets" 
  secret_name      = "example-app-secret" 
  secret_description = "Example application secret" 
  secret_value     = var.secret_value 
  tags             = { 
    Environment = var.environment 
    Application = "ExampleApp" 
  } 
} 
// Outputs for verification 
output "role_arn" { 
  value = module.iam.role_arn 
} 
output "secret_arn" { 
  value = module.secrets.secret_arn 
} terraform { 
  required_version = ">= 1.10.5" 
  required_providers { 
    aws = { 
      source  = "hashicorp/aws" 
      version = "~> 5.0" 
    } 
  } 
} 
# Configure remote state backend for managing Terraform state files dynamically across environments. 
data "terraform_remote_state" "environment_state" { 
  backend = "s3" 
  config = { 
    bucket         = "my-terraform-state-bucket"            # Replace with your bucket name 
    key            = "state/${terraform.workspace}/terraform.tfstate" # Ensure proper workspace is selected. 
    region         = "us-east-1"                            # Replace with your region 
    dynamodb_table = "terraform-state-lock"                 # DynamoDB table for locking 
    encrypt        = true 
  } 
} 
# Modules and resources can be added below to interact with the remote state or define infrastructure. 