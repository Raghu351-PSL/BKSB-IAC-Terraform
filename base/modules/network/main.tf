# VPC Resource 
resource "aws_vpc" "network_vpc" { 
  cidr_block           = var.vpc_cidr_block 
  enable_dns_support   = true 
  enable_dns_hostnames = true 
  tags                 = var.tags 
} 
# Public Subnet Resource 
resource "aws_subnet" "public_subnet" { 
  vpc_id              = aws_vpc.network_vpc.id 
  cidr_block          = var.public_cidr_block 
  availability_zone   = var.availability_zone 
  map_public_ip_on_launch = true 
  tags                = var.tags 
} 
# Private Subnet Resource 
resource "aws_subnet" "private_subnet" { 
  vpc_id            = aws_vpc.network_vpc.id 
  cidr_block        = var.private_cidr_block 
  availability_zone = var.availability_zone 
  tags              = var.tags 
} 
# Internet Gateway 
resource "aws_internet_gateway" "igw" { 
  vpc_id = aws_vpc.network_vpc.id 
  tags   = var.tags 
} 
# NAT Gateway 
resource "aws_nat_gateway" "nat" { 
  allocation_id = aws_eip.nat_eip.id 
  subnet_id     = aws_subnet.public_subnet.id 
  tags          = var.tags 
} 
# Elastic IP for NAT Gateway 
resource "aws_eip" "nat_eip" { 
  vpc = true 
  tags = var.tags 
} 
# Route Table for Public Subnet 
resource "aws_route_table" "public_route_table" { 
  vpc_id = aws_vpc.network_vpc.id 
  tags   = var.tags 
} 
# Route Table Association for Public Subnet 
resource "aws_route_table_association" "public_rta" { 
  subnet_id      = aws_subnet.public_subnet.id 
  route_table_id = aws_route_table.public_route_table.id 
} 
# Route Table for Private Subnet 
resource "aws_route_table" "private_route_table" { 
  vpc_id = aws_vpc.network_vpc.id 
  tags   = var.tags 
} 
# Route Table Association for Private Subnet 
resource "aws_route_table_association" "private_rta" { 
  subnet_id      = aws_subnet.private_subnet.id 
  route_table_id = aws_route_table.private_route_table.id 
} 
# Routes for Public Route Table 
resource "aws_route" "public_routes" { 
  route_table_id         = aws_route_table.public_route_table.id 
  destination_cidr_block = "0.0.0.0/0" 
  gateway_id             = aws_internet_gateway.igw.id 
} 
# Routes for Private Route Table 
resource "aws_route" "private_routes" { 
  route_table_id         = aws_route_table.private_route_table.id 
  destination_cidr_block = "0.0.0.0/0" 
  nat_gateway_id         = aws_nat_gateway.nat.id 
} 
# Outputs 
output "vpc_id" { 
  value = aws_vpc.network_vpc.id 
} 
output "public_subnet_id" { 
  value = aws_subnet.public_subnet.id 
} 
output "private_subnet_id" { 
  value = aws_subnet.private_subnet.id 
} 
output "internet_gateway_id" { 
  value = aws_internet_gateway.igw.id 
} 
output "nat_gateway_id" { 
  value = aws_nat_gateway.nat.id 
} 