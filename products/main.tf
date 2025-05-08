module "application_resources" { 
  source          = "./infra-modules/common" 
  ami_id          = var.app_ami_id 
  instance_type   = var.app_instance_type 
  bucket_name     = var.app_bucket_name 
  lifecycle { 
    create_before_destroy = true 
    ignore_changes        = [ 
      "tags" 
    ] 
  } 
} 
module "ecs_resources" { 
  source          = "./infra-modules/ecs" 
  cluster_name    = var.app_cluster_name 
  service_name    = var.app_service_name 
  task_definition = var.task_definition 
  desired_count   = var.desired_count 
  lifecycle { 
    create_before_destroy = true 
    ignore_changes        = [ 
      "desired_count" 
    ] 
  } 
} 
module "rds_resources" { 
  source             = "./infra-modules/rds" 
  db_identifier      = var.db_identifier 
  db_storage         = var.db_storage 
  db_engine          = var.db_engine 
  db_engine_version  = var.db_engine_version 
  db_instance_class  = var.db_instance_class 
  db_username        = var.db_username 
  db_password        = var.db_password 
  lifecycle { 
    create_before_destroy = true 
    ignore_changes        = [ 
      "allocated_storage" 
    ] 
  } 
} 
module "networking" { 
  source       = "./infra-modules/vpc" 
  vpc_cidr     = var.vpc_cidr 
  subnet_cidr  = var.subnet_cidr 
  lifecycle { 
    create_before_destroy = true 
  } 
}