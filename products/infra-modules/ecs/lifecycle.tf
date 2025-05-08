module "ecs_cluster" { 
  source = "../ecs" 
  cluster_name = var.cluster_name 
  lifecycle { 
    create_before_destroy = true 
  } 
} 
resource "aws_ecs_service" "example_service" { 
  name             = var.service_name 
  cluster          = module.ecs_cluster.cluster_id 
  task_definition  = var.task_definition 
  desired_count    = var.desired_count 
  lifecycle { 
    ignore_changes = [ 
      "desired_count",  # Ignore changes in desired count for scaling operations. 
    ] 
  } 
} 
resource "aws_ecs_task_definition" "example_task" { 
  family                   = var.task_definition_family 
  container_definitions    = var.container_definitions 
  requires_compatibilities = var.requires_compatibilities 
  lifecycle { 
    create_before_destroy = true 
    ignore_changes        = [ 
      "container_definitions",  # Prevent drift caused by minor updates to container definitions. 
    ] 
  } 
}