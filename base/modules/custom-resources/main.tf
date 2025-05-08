provider "external" { 
  # Used to execute external scripts for custom resources 
} 
resource "null_resource" "custom_resource_handler" { 
  triggers = { 
    script_file = var.script_file 
  } 
  provisioner "local-exec" { 
    command = var.custom_script 
  } 
} 
output "custom_resource_status" { 
  value = null_resource.custom_resource_handler.id 
} 