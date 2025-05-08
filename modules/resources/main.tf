data "aws_vpc" "selected_vpc" { 
  filter { 
    name   = "tag:Environment" 
    values = [var.environment] 
  } 
} 
output "vpc_id" { 
  description = "ID of the selected VPC" 
  value       = data.aws_vpc.selected_vpc.id 
} 