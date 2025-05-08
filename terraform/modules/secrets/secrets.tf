resource "aws_secretsmanager_secret" "application_secret" { 
  name        = var.secret_name 
  description = var.secret_description 
  tags = var.tags 
} 
resource "aws_secretsmanager_secret_version" "application_secret_version" { 
  secret_id     = aws_secretsmanager_secret.application_secret.id 
  secret_string = var.secret_value 
} 
output "secret_arn" { 
  value = aws_secretsmanager_secret.application_secret.arn 
} 
output "secret_id" { 
  value = aws_secretsmanager_secret.application_secret.id 
} 