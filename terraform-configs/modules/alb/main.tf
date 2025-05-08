resource "aws_alb" "main" { 
  name            = "my-app-alb" 
  internal        = false 
  security_groups = [aws_security_group.main.id] 
  subnets         = tolist(aws_subnet.subnet.*.id) 
  tags = { 
    Environment = var.environment 
  } 
} 
resource "aws_security_group" "main" { 
  name_prefix          = "alb-sg-" 
  description          = "Security group for Application Load Balancer" 
  vpc_id               = aws_vpc.main.id 
  ingress { 
    from_port   = 80 
    to_port     = 80 
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"] 
  } 
  egress { 
    from_port   = 0 
    to_port     = 0 
    protocol    = "-1" 
    cidr_blocks = ["0.0.0.0/0"] 
  } 
  tags = { 
    Environment = var.environment 
  } 
} 
output "alb_arn" { 
  description = "The ARN of the Application Load Balancer" 
  value       = aws_alb.main.arn 
} 
output "alb_dns_name" { 
  description = "The DNS name of the Application Load Balancer" 
  value       = aws_alb.main.dns_name 
} 
output "alb_security_group_id" { 
  description = "The ID of the ALB security group" 
  value       = aws_security_group.main.id 
} 
variable "environment" { 
  description = "The environment name (e.g., production, staging)" 
  type        = string 
} 
variable "subnet_ids" { 
  description = "The IDs of the subnets where the ALB must be created" 
  type        = list(string) 
  default     = [] 
} 