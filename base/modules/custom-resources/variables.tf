variable "script_file" { 
  description = "Path to the external script for the custom resource" 
  type        = string 
} 
variable "custom_script" { 
  description = "Command to handle the custom resource setup" 
  type        = string 
} 
variable "execution_environment" { 
  description = "Execution environment for custom resource handling (e.g., production or development)" 
  type        = string 
} 
variable "resource_timeout" { 
  description = "Timeout value in seconds for custom resource execution" 
  type        = number 
} 
variable "retry_count" { 
  description = "Number of times to retry the custom resource actions on failure" 
  type        = number 
} 
variable "event_logs_dir" { 
  description = "Path to the directory for storing event logs of custom resource execution" 
  type        = string 
}