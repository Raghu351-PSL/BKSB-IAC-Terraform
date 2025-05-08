output "rds_endpoint" { 
  description = "Endpoint of the RDS instance" 
  value       = aws_db_instance.db_instance.endpoint 
} 
output "rds_instance_class" { 
  description = "Instance class of the RDS instance" 
  value       = aws_db_instance.db_instance.instance_class 
} 
output "rds_allocated_storage" { 
  description = "Allocated storage for the RDS instance (in GB)" 
  value       = aws_db_instance.db_instance.allocated_storage 
} 
output "rds_engine" { 
  description = "Database engine used for the RDS instance (e.g., MySQL, PostgreSQL)" 
  value       = aws_db_instance.db_instance.engine 
} 
output "rds_engine_version" { 
  description = "Version of the database engine" 
  value       = aws_db_instance.db_instance.engine_version 
} 
output "rds_db_name" { 
  description = "Name of the database" 
  value       = aws_db_instance.db_instance.name 
} 
output "rds_backup_retention_period" { 
  description = "Backup retention period for the RDS instance (in days)" 
  value       = aws_db_instance.db_instance.backup_retention_period 
} 
output "rds_multi_az" { 
  description = "Whether the RDS instance is deployed in multiple availability zones" 
  value       = aws_db_instance.db_instance.multi_az 
} 
output "rds_storage_encrypted" { 
  description = "Whether the RDS instance storage is encrypted" 
  value       = aws_db_instance.db_instance.storage_encrypted 
} 
output "rds_parameter_group_name" { 
  description = "Parameter group associated with the RDS instance" 
  value       = aws_db_instance.db_instance.parameter_group_name 
} 
output "rds_kms_key_id" { 
  description = "KMS key ID used for encrypting the RDS instance storage" 
  value       = aws_db_instance.db_instance.kms_key_id 
} 