terraform { 
  required_version = ">= 1.10.5" 
  backend "s3" { 
    bucket         = "my-terraform-state-bucket" 
    key            = "state/terraform.tfstate" 
    region         = var.region 
    dynamodb_table = "terraform-lock-table" 
  } 
} 
provider "aws" { 
  region = var.region 
} 
module "network" { 
  source            = "../modules/network" 
  vpc_cidr_block    = "10.0.0.0/16" 
  public_cidr_block = "10.0.1.0/24" 
  private_cidr_block = "10.0.2.0/24" 
  availability_zone = "us-east-1a" 
  tags              = { 
    Name        = "optimized-network" 
    Environment = var.environment 
  } 
} 
module "kms" { 
  source          = "../modules/kms" 
  environment     = var.environment 
  kms_key_alias   = var.kms_key_alias 
  kms_key_deletion_window = 30 
  tags            = { 
    Name = "${var.environment}-kms-key" 
    Env  = var.environment 
  } 
} 
module "conditional_resources" { 
  source                = "../modules/conditional-resources"
  Instance_profile_name = var.Instance_Profile_Name
  bucket_name           = var.bucket_name 
  enable_bucket         = var.enable_bucket 
  enable_null_resource  = var.enable_null_resource 
  prevent_destroy       = var.prevent_destroy 
  environment           = var.environment 
  default_tags          = var.default_tags 
} 
# Utilize module outputs 
output "vpc_info" { 
  value = module.network.vpc_id 
} 
output "subnet_info" { 
  value = module.network.subnet_ids 
} 
output "kms_key_info" { 
  value = module.kms.key_id 
}