variable "lb_name" { 
  description = "Name of the load balancer" 
  type        = string 
} 
variable "internal" { 
  description = "Whether the load balancer is internal" 
  type        = bool 
} 
variable "security_groups" { 
  description = "Security groups to attach to the load balancer" 
  type        = list(string) 
} 
variable "subnets" { 
  description = "Subnets to attach the load balancer" 
  type        = list(string) 
} 
variable "enable_deletion_protection" { 
  description = "Enable deletion protection for the load balancer" 
  type        = bool 
} 
variable "listener_port" { 
  description = "Port for the ALB listener" 
  type        = string 
} 
variable "listener_protocol" { 
  description = "Listener protocol for ALB (e.g., HTTP/HTTPS)" 
  type        = string 
} 
variable "target_group_arn" { 
  description = "ARN of the default target group" 
  type        = string 
} 