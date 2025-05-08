output "secret_arn" { 
  value       = aws_secretsmanager_secret.example.arn 
  description = "The ARN of the Secrets Manager secret for testing Terraform infrastructure." 
} 
output "secret_name" { 
  value       = aws_secretsmanager_secret.example.name 
  description = "The name of the Secrets Manager secret." 
} 
output "secret_last_updated_date" { 
  value       = aws_secretsmanager_secret.example.last_changed_date 
  description = "The date when the Secrets Manager secret was last updated." 
} 
output "secret_rotation_enabled" { 
  value       = aws_secretsmanager_secret.example.rotation_enabled 
  description = "Indicates whether automatic rotation is enabled for the Secrets Manager secret." 
}