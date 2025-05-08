terraform { 
  required_providers { 
    aws = { 
      source  = "hashicorp/aws" 
      version = "~> 5.0" 
    } 
  } 
} 
resource "aws_vpc" "main" { 
  cidr_block           = var.cidr_block 
  enable_dns_support   = true 
  enable_dns_hostnames = true 
  tags = merge(var.common_tags, { 
    Name = "${var.environment}-vpc" 
  }) 
} 
resource "aws_subnet" "private" { 
  count                   = length(var.private_subnets) 
  vpc_id                  = aws_vpc.main.id 
  cidr_block              = element(var.private_subnets, count.index) 
  map_public_ip_on_launch = false 
  tags = merge(var.common_tags, { 
    Name = "${var.environment}-private-subnet-${count.index}" 
  }) 
} 
resource "aws_subnet" "public" { 
  count                   = length(var.public_subnets) 
  vpc_id                  = aws_vpc.main.id 
  cidr_block              = element(var.public_subnets, count.index) 
  map_public_ip_on_launch = true 
  tags = merge(var.common_tags, { 
    Name = "${var.environment}-public-subnet-${count.index}" 
  }) 
} 
output "vpc_id" { 
  value = aws_vpc.main.id 
} 