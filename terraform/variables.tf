variable "vpc_cidr" { 
  description = "CIDR range for the VPC" 
  type        = string 
  default     = "10.0.0.0/16" 
} 
variable "public_subnet_cidr" { 
  description = "CIDR range for the public subnet" 
  type        = string 
  default     = "10.0.1.0/24" 
} 
variable "private_subnet_cidr" { 
  description = "CIDR range for the private subnet" 
  type        = string 
  default     = "10.0.2.0/24" 
} 
variable "availability_zone" { 
  description = "AWS availability zone" 
  type        = string 
  default     = "us-east-1a" 
} 
variable "env_name" { 
  description = "Environment name for resource tagging" 
  type        = string 
  default     = "dev" 
} variable "region" { 
  description = "The AWS region where resources will be created" 
} 
variable "vpc_cidr" { 
  description = "The CIDR block for the VPC" 
} 
variable "private_subnets" { 
  description = "A list of CIDR blocks for private subnets" 
  type        = list(string) 
} 
variable "public_subnets" { 
  description = "A list of CIDR blocks for public subnets" 
  type        = list(string) 
} 
variable "common_tags" { 
  description = "Common tags to apply to all resources" 
  type        = map(string) 
} 
variable "environment" { 
  description = "The environment name (e.g., dev, prod)" 
} variable "aws_region" { 
  description = "AWS region for the deployment" 
  type        = string 
} 
variable "vpc_cidr" { 
  description = "CIDR block for VPC" 
  type        = string 
  default     = "10.0.0.0/16" 
} variable "environment" { 
  description = "Environment (e.g. staging, production)" 
  type        = string 
} 
variable "secret_value" { 
  description = "Value for the application secret" 
  type        = string 
} 