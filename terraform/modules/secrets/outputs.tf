output "secret_arn" { 
  description = "ARN of the secret" 
  value       = aws_secretsmanager_secret.application_secret.arn 
} 
output "secret_id" { 
  description = "ID of the secret" 
  value       = aws_secretsmanager_secret.application_secret.id 
} 