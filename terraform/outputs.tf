output "vpc_id" { 
  value = aws_vpc.main_vpc.id 
} 
output "public_subnet_id" { 
  value = aws_subnet.public.id 
} 
output "private_subnet_id" { 
  value = aws_subnet.private.id 
} # Outputs for the Terraform root module 
output "vpc_id" { 
  description = "The ID of the VPC from the root module" 
  value       = module.vpc.vpc_id 
} 
output "public_subnets_ids" { 
  description = "A list of public subnet IDs from the VPC module" 
  value       = module.vpc.public_subnet_ids 
} 
output "private_subnets_ids" { 
  description = "A list of private subnet IDs from the VPC module" 
  value       = module.vpc.private_subnet_ids 
} 
output "kms_key_id" { 
  description = "The ID of the KMS key from the KMS module" 
  value       = module.kms.kms_key_id 
} 