resource "aws_vpc" "vpc" { 
  cidr_block = var.vpc_cidr 
  tags = { 
    Name = "${var.environment}-vpc" 
    Env  = var.environment 
  } 
} 
resource "aws_subnet" "subnet" { 
  count = length(var.subnet_cidrs) 
  cidr_block        = var.subnet_cidrs[count.index] 
  availability_zone = var.availability_zones[count.index] 
  vpc_id            = aws_vpc.vpc.id 
  tags = { 
    Name = "${var.environment}-subnet-${count.index}" 
    Env  = var.environment 
  } 
}