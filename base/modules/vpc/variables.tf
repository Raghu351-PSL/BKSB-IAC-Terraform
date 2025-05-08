variable "vpc_cidr" { 
  description = "VPC CIDR block" 
  type        = string 
} 
variable "subnet_cidrs" { 
  description = "List of subnet CIDRs" 
  type        = list(string) 
} 
variable "availability_zones" { 
  description = "List of availability zones" 
  type        = list(string) 
} 
variable "environment" { 
  description = "Environment name" 
  type        = string 
} 
variable "region" { 
  description = "AWS region for deployment" 
  type        = string 
} 
variable "kms_key_alias" { 
  description = "Alias for KMS key to use for encryption" 
  type        = string 
}