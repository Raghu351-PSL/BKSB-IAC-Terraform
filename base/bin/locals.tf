locals { 
  # Map environment names to the corresponding configuration settings 
  environment_config = { 
    "dev"        = { region = "us-east-1", kms_key_alias = "alias/dev-key", vpc_cidr = "10.0.0.0/16" } 
    "staging"    = { region = "us-west-2", kms_key_alias = "alias/staging-key", vpc_cidr = "172.16.0.0/16" } 
    "production" = { region = "eu-west-1", kms_key_alias = "alias/prod-key", vpc_cidr = "192.168.0.0/16" } 
  } 
  environment_settings = local.environment_config[var.environment] 
  # Use locals to dynamically derive values 
  region       = local.environment_settings.region 
  kms_key_alias = local.environment_settings.kms_key_alias 
  vpc_cidr     = local.environment_settings.vpc_cidr 
}