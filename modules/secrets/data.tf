data "aws_secretsmanager_secret" "app_secret" { 
  name = var.secret_name 
} 
data "aws_secretsmanager_secret_version" "secret_value" { 
  secret_id = data.aws_secretsmanager_secret.app_secret.id 
} 
output "secret_value" { 
  description = "Dynamic secret fetched from AWS Secrets Manager" 
  value       = data.aws_secretsmanager_secret_version.secret_value.secret_string 
} 