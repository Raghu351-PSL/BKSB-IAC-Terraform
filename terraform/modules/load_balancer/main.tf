resource "aws_lb" "app_lb" { 
  name                            = var.lb_name 
  internal                        = var.internal 
  load_balancer_type              = "application" 
  security_groups                 = var.security_groups 
  subnets                         = var.subnets 
  enable_deletion_protection      = var.enable_deletion_protection 
} 
resource "aws_lb_listener" "http" { 
  load_balancer_arn = aws_lb.app_lb.arn 
  port              = var.listener_port 
  protocol          = var.listener_protocol 
  default_action { 
    type = "forward" 
    target_group_arn = var.target_group_arn 
  } 
} 
output "alb_arn" { 
  value = aws_lb.app_lb.arn 
} 