output "network_vpc_id" { 
  value = aws_vpc.network_vpc.id 
} 
output "network_subnets" { 
  value = [ 
    aws_subnet.public_subnet.id, 
    aws_subnet.private_subnet.id, 
  ] 
} 