resource "aws_db_instance" "db_instance" { 
  allocated_storage    = var.allocated_storage 
  engine               = var.engine 
  engine_version       = var.engine_version 
  instance_class       = var.instance_class 
  name                 = var.db_name 
  username             = var.username 
  password             = var.password 
  parameter_group_name = var.parameter_group_name 
  backup_retention_period = var.backup_retention_period 
  storage_encrypted    = var.storage_encrypted 
  kms_key_id           = var.kms_key_id 
  multi_az             = var.multi_az 
} 
output "rds_endpoint" { 
  value = aws_db_instance.db_instance.endpoint 
} 