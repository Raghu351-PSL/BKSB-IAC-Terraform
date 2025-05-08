resource "aws_ecs_cluster" "ecs_cluster" { 
  name = "${var.environment}-ecs-cluster" 
  capacity_providers = ["FARGATE"] 
} 
output "ecs_cluster_name" { 
  description = "The name of the ECS Cluster" 
  value       = aws_ecs_cluster.ecs_cluster.name 
} 