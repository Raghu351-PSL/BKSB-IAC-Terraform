output "custom_resource_handler_id" { 
  description = "ID of the custom resource handler" 
  value       = null_resource.custom_resource_handler.id 
} 
output "custom_resource_status" { 
  description = "Status of the custom resource handler execution" 
  value       = null_resource.custom_resource_handler.triggers.script_file 
} 
output "custom_script_command" { 
  description = "Command executed for handling the custom resource" 
  value       = var.custom_script 
}