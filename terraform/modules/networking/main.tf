resource "aws_vpc" "main" { 
  cidr_block = var.vpc_cidr 
  tags = { 
    Name        = "vpc-${terraform.workspace}" 
    Environment = terraform.workspace 
  } 
} 
resource "aws_subnet" "public" { 
  count = 2 
  vpc_id = aws_vpc.main.id 
  cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index) 
  availability_zone = data.aws_availability_zones.available.names[count.index] 
  tags = { 
    Name = "subnet-public-${terraform.workspace}-${count.index}" 
  } 
} 
output "vpc_id" { 
  value = aws_vpc.main.id 
} 