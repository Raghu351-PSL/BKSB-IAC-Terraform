variable "function_name" { 
  description = "Name of the Lambda function" 
  type        = string 
} 
variable "filename" { 
  description = "Path to the deployment package (zip file)" 
  type        = string 
} 
variable "handler" { 
  description = "Function entry point within the deployment package" 
  type        = string 
} 
variable "runtime" { 
  description = "Runtime for the Lambda function (e.g., nodejs14.x)" 
  type        = string 
} 
variable "role_arn" { 
  description = "IAM Role ARN for the Lambda function" 
  type        = string 
} 
variable "timeout" { 
  description = "Timeout for the Lambda function in seconds" 
  type        = number 
} 
variable "environment_variables" { 
  description = "Key-value pairs of environment variables for the Lambda function" 
  type        = map(string) 
} 
variable "memory_size" { 
  description = "Memory size for the Lambda function in MB" 
  type        = number 
  default     = 128 
} 
variable "layers" { 
  description = "List of ARNs for Lambda layers to attach" 
  type        = list(string) 
}