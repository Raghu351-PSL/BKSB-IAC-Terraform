terraform { 
  backend "s3" { 
    bucket         = "your-terraform-state-bucket" 
    key            = "terraform/state/${var.environment}.tfstate" 
    region         = var.region 
    dynamodb_table = "terraform-state-locks" 
  } 
} 