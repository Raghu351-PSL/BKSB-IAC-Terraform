variable "cidr_block" { 
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
} 