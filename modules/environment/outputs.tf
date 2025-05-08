output "environment_details" { 
  description = "Details about the environment configuration" 
  value = { 
    environment = var.environment 
    region      = var.region 
    account_id  = var.account_id 
  } 
} 