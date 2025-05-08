variable "region" { 
  description = "AWS region for deployment" 
  type        = string 
  default     = "us-east-1" 
} 
variable "environment" { 
  description = "Environment name (e.g., dev, staging, production)" 
  type        = string 
  default     = "dev" 
} 
variable "vpc_cidr" { 
  description = "CIDR block for the VPC" 
  type        = string 
} 
variable "kms_key_alias" { 
  description = "Alias for KMS key to use for encryption" 
  type        = string 
} 
variable "subnet_cidr_blocks" { 
  description = "List of CIDR blocks for subnets" 
  type        = list(string) 
} 
variable "availability_zones" { 
  description = "List of availability zones for the region" 
  type        = list(string) 
} 
variable "bucket_name" { 
  description = "The name of the S3 bucket." 
  type        = string 
} 
variable "enable_bucket" { 
  description = "Flag to enable or disable the S3 bucket creation." 
  type        = bool 
  default     = true 
} 
variable "enable_null_resource" { 
  description = "Flag to enable or disable execution of the null resource." 
  type        = bool 
  default     = false 
} 
variable "prevent_destroy" { 
  description = "Flag to prevent resource destruction." 
  type        = bool 
  default     = true 
} 
variable "default_tags" { 
  description = "Common tags for all resources." 
  type        = map(string) 
  default     = { 
    "Project" = "advancedcsg_bksb" 
    "Owner"   = "team" 
  }
Variable "Instance_Profile_Name"{
  description = "Instance Name" 
  type        = string
  default     = "IAC-Terraform"
}
}