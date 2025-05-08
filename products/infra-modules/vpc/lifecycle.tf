resource "aws_vpc" "custom_vpc" { 
  cidr_block = var.vpc_cidr 
  lifecycle { 
    create_before_destroy = true  # Ensure VPC replacement does not impact dependent resources. 
  } 
} 
resource "aws_subnet" "example_subnet" { 
  vpc_id     = aws_vpc.custom_vpc.id 
  cidr_block = var.subnet_cidr 
  lifecycle { 
    ignore_changes = [ 
      "map_public_ip_on_launch",  # Prevent state drift from changes to public IP mappings. 
    ] 
  } 
} 
resource "aws_security_group" "example_security_group" { 
  name_prefix = var.security_group_name_prefix 
  vpc_id      = aws_vpc.custom_vpc.id 
  lifecycle { 
    create_before_destroy = true  # Ensures security group replacement for smooth transitions. 
    ignore_changes        = [ 
      "tags",  # Prevent state changes from variations in tag updates. 
    ] 
  } 
  ingress { 
    description = "Allow SSH access" 
    from_port   = 22 
    to_port     = 22 
    protocol    = "tcp" 
    cidr_blocks = var.allowed_ssh_cidr_blocks 
  } 
  egress { 
    description = "Allow all outbound traffic" 
    from_port   = 0 
    to_port     = 0 
    protocol    = "-1" 
    cidr_blocks = ["0.0.0.0/0"] 
  } 
} 
output "vpc_id" { 
  value = aws_vpc.custom_vpc.id 
} 
output "subnet_id" { 
  value = aws_subnet.example_subnet.id 
} 
output "security_group_id" { 
  value = aws_security_group.example_security_group.id 
}