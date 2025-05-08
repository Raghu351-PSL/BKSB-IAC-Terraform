module "environment" { 
  source      = "./modules/environment" 
  environment = var.environment 
  region      = var.region 
  account_id  = var.account_id 
} 
module "secrets" { 
  source      = "./modules/secrets" 
  secret_name = var.secret_name 
} 
module "resources" { 
  source      = "./modules/resources" 
  environment = var.environment 
} 
module "ecs-cluster" { 
  source      = "./modules/ecs-cluster" 
  environment = var.environment 
} 