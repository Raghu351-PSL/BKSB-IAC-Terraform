resource "aws_secretsmanager_secret" "main" { 
  name        = var.secret_name 
  description = var.secret_description 
} 
resource "aws_secretsmanager_secret_version" "main" { 
  secret_id     = aws_secretsmanager_secret.main.id 
  secret_string = var.secret_value 
} 
output "secret_arn" { 
  value = aws_secretsmanager_secret.main.arn 
} 
output "secret_version_id" { 
  value = aws_secretsmanager_secret_version.main.version_id 
} 
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