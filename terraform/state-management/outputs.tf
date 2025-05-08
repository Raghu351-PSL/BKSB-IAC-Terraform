# Outputs for remote state backend 
output "state_bucket" { 
  value       = "my-terraform-state-bucket" 
  description = "The name of the S3 bucket used for Terraform remote state" 
} 
output "state_region" { 
  value       = "us-east-1" 
  description = "The region of the S3 bucket" 
} 
output "state_key_format" { 
  value       = "state/<ENVIRONMENT>/terraform.tfstate" 
  description = "The key format for storing Terraform state files by environment" 
} 