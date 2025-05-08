resource "aws_vpc" "main" { 
  cidr_block = "10.0.0.0/16" 
  tags = { 
    Name = var.vpc_name 
  } 
} 
resource "aws_subnet" "public_subnet" { 
  count           = 2 
  map_public_ip_on_launch = true 
  cidr_block      = "10.0.${count.index}.0/24" 
  availability_zone = data.aws_availability_zones.available.names[count.index] 
  vpc_id          = aws_vpc.main.id 
  tags = { 
    Name = "${var.vpc_name}-public-subnet-${count.index}" 
  } 
} 
resource "aws_subnet" "private_subnet" { 
  count           = 2 
  map_public_ip_on_launch = false 
  cidr_block      = "10.0.${count.index + 100}.0/24" 
  availability_zone = data.aws_availability_zones.available.names[count.index] 
  vpc_id          = aws_vpc.main.id 
  tags = { 
    Name = "${var.vpc_name}-private-subnet-${count.index}" 
  } 
} 
resource "aws_internet_gateway" "main" { 
  vpc_id = aws_vpc.main.id 
  tags = { 
    Name = "${var.vpc_name}-internet-gateway" 
  } 
} 
resource "aws_route_table" "public_route_table" { 
  vpc_id = aws_vpc.main.id 
  tags = { 
    Name = "${var.vpc_name}-public-route-table" 
  } 
} 
resource "aws_route" "public_route" { 
  route_table_id         = aws_route_table.public_route_table.id 
  destination_cidr_block = "0.0.0.0/0" 
  gateway_id             = aws_internet_gateway.main.id 
} 
resource "aws_route_table_association" "public_subnet_association" { 
  count          = 2 
  subnet_id      = aws_subnet.public_subnet[count.index].id 
  route_table_id = aws_route_table.public_route_table.id 
} 
resource "aws_nat_gateway" "main" { 
  count           = 2 
  subnet_id       = aws_subnet.public_subnet[count.index].id 
  allocation_id   = aws_eip.nat[count.index].id 
  tags = { 
    Name = "${var.vpc_name}-nat-gateway-${count.index}" 
  } 
} 
resource "aws_eip" "nat" { 
  count = 2 
  vpc   = true 
  tags = { 
    Name = "${var.vpc_name}-eip-${count.index}" 
  } 
} 
resource "aws_route_table" "private_route_table" { 
  count  = 2 
  vpc_id = aws_vpc.main.id 
  tags = { 
    Name = "${var.vpc_name}-private-route-table-${count.index}" 
  } 
} 
resource "aws_route" "private_route" { 
  count           = 2 
  route_table_id  = aws_route_table.private_route_table[count.index].id 
  destination_cidr_block = "0.0.0.0/0" 
  nat_gateway_id  = aws_nat_gateway.main[count.index].id 
} 
resource "aws_route_table_association" "private_subnet_association" { 
  count          = 2 
  subnet_id      = aws_subnet.private_subnet[count.index].id 
  route_table_id = aws_route_table.private_route_table[count.index].id 
} 
data "aws_availability_zones" "available" {} 
output "vpc_id" { 
  value = aws_vpc.main.id 
} 
output "public_subnet_ids" { 
  value = aws_subnet.public_subnet[*].id 
} 
output "private_subnet_ids" { 
  value = aws_subnet.private_subnet[*].id 
} 