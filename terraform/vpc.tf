terraform { 
  required_providers { 
    aws = { 
      source  = "hashicorp/aws" 
      version = "~> 5.0" 
    } 
  } 
} 
resource "aws_vpc" "main_vpc" { 
  cidr_block           = var.vpc_cidr 
  enable_dns_hostnames = true 
  enable_dns_support   = true 
  tags = { 
    Environment = var.env_name 
    Name        = "${var.env_name}-vpc" 
  } 
} 