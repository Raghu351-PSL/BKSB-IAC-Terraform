resource "aws_ecs_cluster" "main" { 
  name = var.cluster_name 
} 
output "cluster_arn" { 
  value = aws_ecs_cluster.main.arn 
} 