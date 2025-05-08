variable "environment" { 
  description = "Environment name (production/staging/data-platform)" 
  type        = string 
} 
variable "region" { 
  description = "AWS region for resource deployment" 
  type        = string 
} 
variable "account_id" { 
  description = "AWS account ID" 
  type        = string 
} 
variable "secret_name" { 
  description = "Name of the secret stored in AWS Secrets Manager" 
  type        = string 
} 