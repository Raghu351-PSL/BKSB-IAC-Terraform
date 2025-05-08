output "vpc_id" { 
  value = module.vpc.vpc_id 
} 
output "ecs_cluster_arn" { 
  value = module.ecs.cluster_arn 
} 
output "db_endpoint" { 
  value = module.rds.db_endpoint 
} 
output "alb_arn" { 
  value = module.alb.alb_arn 
} 
output "secret_arn" { 
  value = module.secrets.secret_arn 
} 