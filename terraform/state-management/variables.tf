# Input variables for Terraform state management 
variable "aws_region" { 
  type        = string 
  description = "AWS region where the resources are deployed" 
} 
variable "aws_profile" { 
  type        = string 
  description = "AWS CLI profile name for authentication" 
} 