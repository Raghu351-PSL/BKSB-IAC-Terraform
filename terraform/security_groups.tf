resource "aws_security_group" "default" { 
  name_prefix = "${var.env_name}-sg" 
  vpc_id      = aws_vpc.main_vpc.id 
  tags = { 
    Environment = var.env_name 
    Name        = "${var.env_name}-security-group" 
  } 
  ingress { 
    description = "Allow HTTP" 
    from_port   = 80 
    to_port     = 80 
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"] 
  } 
  egress { 
    description = "Allow all" 
    from_port   = 0 
    to_port     = 0 
    protocol    = "-1" 
    cidr_blocks = ["0.0.0.0/0"] 
  } 
} 