variable "role_name" { 
  description = "Name of the IAM role" 
  type        = string 
} 
variable "role_description" { 
  description = "Description of the IAM role" 
  type        = string 
} 
variable "assume_role_policy_path" { 
  description = "Path to assume role policy document" 
  type        = string 
} 
variable "policy_name" { 
  description = "Name of the IAM policy" 
  type        = string 
} 
variable "policy_description" { 
  description = "Description of the IAM policy" 
  type        = string 
} 
variable "policy_path" { 
  description = "Path to the policy document" 
  type        = string 
} 
variable "policy_attachment_name" { 
  description = "Name of the policy attachment" 
  type        = string 
} 
variable "tags" { 
  description = "Tags to apply to resources" 
  type        = map(string) 
  default     = {} 
} 