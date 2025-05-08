variable "description" { 
  description = "Description of the KMS key" 
} 
variable "common_tags" { 
  description = "Common tags to apply to all resources" 
  type        = map(string) 
} 
variable "environment" { 
  description = "The environment name (e.g., dev, prod)" 
} 