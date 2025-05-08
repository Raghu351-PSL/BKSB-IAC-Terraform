variable "vpc_cidr_block" { 
  description = "CIDR block of the VPC" 
  type        = string 
} 
variable "public_cidr_block" { 
  description = "CIDR block for the public subnet" 
  type        = string 
} 
variable "private_cidr_block" { 
  description = "CIDR block for the private subnet" 
  type        = string 
} 
variable "availability_zone" { 
  description = "AWS Availability Zone for resources" 
  type        = string 
} 
variable "tags" { 
  description = "Common tags for tagging resources" 
  type        = map(string) 
  default     = {} 
}