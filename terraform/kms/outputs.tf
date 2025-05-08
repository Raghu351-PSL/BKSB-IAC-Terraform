output "kms_key_id" { 
  description = "The ID of the KMS key" 
  value       = aws_kms_key.main.id 
} 