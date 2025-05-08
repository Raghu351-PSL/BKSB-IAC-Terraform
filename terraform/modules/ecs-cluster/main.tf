resource "aws_ecs_cluster" "cluster" { 
  name = "ecs-${var.environment}" 
  tags = { 
    Environment = var.environment 
  } 
} 
output "cluster_name" { 
  value = aws_ecs_cluster.cluster.name 
} 