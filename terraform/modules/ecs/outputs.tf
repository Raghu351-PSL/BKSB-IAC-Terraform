output "ecs_cluster_arn" { 
  description = "Amazon Resource Name (ARN) of the ECS cluster" 
  value       = aws_ecs_cluster.this.arn 
} 