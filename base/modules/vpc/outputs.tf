output "vpc_id" { 
  description = "ID of the VPC" 
  value       = aws_vpc.main.id 
} 
output "aws_region" { 
  description = "AWS region in use" 
  value       = var.aws_region 
}