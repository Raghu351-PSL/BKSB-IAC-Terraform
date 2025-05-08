region              = "us-east-1" 
environment         = "dev" 
vpc_cidr            = "10.0.0.0/16" 
kms_key_alias       = "alias/dev-key" 
subnet_cidr_blocks  = ["10.0.1.0/24", "10.0.2.0/24"] 
availability_zones  = ["us-east-1a", "us-east-1b"] 
bucket_name         = "example-bucket-name" 
enable_bucket       = true 
enable_null_resource = true 
prevent_destroy     = true 
default_tags = { 
  "Application" = "advancedcsg_bksb_infrastructure" 
  "ManagedBy"   = "Terraform" 
}