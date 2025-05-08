variable "bucket_name" { 
  description = "The name of the S3 bucket to create." 
  type        = string 
} 
variable "enable_bucket" { 
  description = "Flag to conditionally create the S3 bucket." 
  type        = bool 
  default     = false 
} 
variable "enable_null_resource" { 
  description = "Flag to conditionally execute the null resource." 
  type        = bool 
  default     = false 
} 
variable "prevent_destroy" { 
  description = "Flag to prevent the resource from being destroyed." 
  type        = bool 
  default     = true 
} 
variable "environment" { 
  description = "The environment in which the resource is deployed (e.g., dev, staging, prod)." 
  type        = string 
} 
variable "default_tags" { 
  description = "Default tags to apply to all resources." 
  type        = map(string) 
  default     = {} 
}