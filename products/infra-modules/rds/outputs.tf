output "rds_instance_id" { 
  value       = aws_db_instance.rds_instance.id 
  description = "The ID of the RDS instance" 
} 
output "rds_endpoint" { 
  value       = aws_db_instance.rds_instance.endpoint 
  description = "The endpoint of the RDS instance" 
} 
output "rds_port" { 
  value       = aws_db_instance.rds_instance.port 
  description = "The port of the RDS instance" 
} 
output "rds_snapshot_identifier" { 
  value       = aws_db_instance.rds_instance.snapshot_identifier 
  description = "The snapshot identifier for the RDS instance" 
} 
output "rds_security_group_ids" { 
  value       = aws_db_instance.rds_instance.vpc_security_group_ids 
  description = "The IDs of the VPC security groups associated with the RDS instance" 
} 
output "rds_publicly_accessible" { 
  value       = aws_db_instance.rds_instance.publicly_accessible 
  description = "Whether the RDS instance is publicly accessible" 
}