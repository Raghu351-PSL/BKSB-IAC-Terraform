provider "aws" { 
  region = var.aws_region 
} 
# ECS Cluster Resource 
resource "aws_ecs_cluster" "this" { 
  name              = var.cluster_name 
  capacity_providers = var.capacity_providers 
} 
# ECS IAM Role for Task Execution 
resource "aws_iam_role" "task_execution_role" { 
  name               = var.execution_role_name 
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role_policy.json 
} 
# IAM Policy Document for Task Execution Role 
data "aws_iam_policy_document" "ecs_assume_role_policy" { 
  statement { 
    actions = ["sts:AssumeRole"] 
    principals { 
      type        = "Service" 
      identifiers = ["ecs-tasks.amazonaws.com"] 
    } 
  } 
} 
# Output ECS Cluster ARN 
output "ecs_cluster_arn" { 
  description = "Amazon Resource Name (ARN) of the ECS cluster" 
  value       = aws_ecs_cluster.this.arn 
} 