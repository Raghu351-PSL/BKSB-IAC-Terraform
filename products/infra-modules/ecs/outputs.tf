output "ecs_cluster_name" { 
  value       = aws_ecs_cluster.main.name 
  description = "The name of the ECS cluster" 
} 
output "rds_instance_id" { 
  value       = aws_db_instance.main.id 
  description = "The ID of the RDS instance" 
} 
output "secret_arn" { 
  value       = aws_secretsmanager_secret.main.arn 
  description = "The ARN of the Secrets Manager secret" 
} 
output "s3_bucket_name" { 
  value       = aws_s3_bucket.main.bucket 
  description = "The name of the S3 bucket" 
} 
output "ecs_task_definition_arn" { 
  value       = aws_ecs_task_definition.main.arn 
  description = "The ARN of the ECS task definition" 
} 
output "ecs_service_name" { 
  value       = aws_ecs_service.main.name 
  description = "The name of the ECS service" 
}