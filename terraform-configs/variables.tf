variable "aws_region" { 
  description = "AWS region for deployment" 
  default     = "us-west-2" 
} 
variable "environment" { 
  description = "Environment name (e.g., production, staging)" 
  default     = "production" 
} 
variable "vpc_name" { 
  description = "Name of the VPC" 
  default     = "" 
} 
variable "cluster_name" { 
  description = "Name of the ECS cluster" 
  default     = "" 
} 
variable "db_name" { 
  description = "Name of the RDS database" 
  default     = "" 
} 