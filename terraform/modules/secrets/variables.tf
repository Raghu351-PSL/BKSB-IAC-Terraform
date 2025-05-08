variable "secret_name" { 
  description = "Name of the secret" 
  type        = string 
} 
variable "secret_description" { 
  description = "Description of the secret" 
  type        = string 
} 
variable "secret_value" { 
  description = "Value of the secret" 
  type        = string 
} 
variable "tags" { 
  description = "Tags to apply to resources" 
  type        = map(string) 
  default     = {} 
} 