variable "aws_region" { 
  description = "AWS region" 
  type        = string 
} 
variable "cluster_name" { 
  description = "Name of the ECS cluster" 
  type        = string 
} 
variable "execution_role_name" { 
  description = "Name of the ECS task execution role" 
  type        = string 
} 
variable "capacity_providers" { 
  description = "ECS capacity providers (e.g., FARGATE, FARGATE_SPOT)" 
  type        = list(string) 
} 