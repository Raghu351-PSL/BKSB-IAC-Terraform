resource "aws_rds_instance" "example" { 
  identifier              = var.db_identifier 
  allocated_storage       = var.db_storage 
  engine                  = var.db_engine 
  engine_version          = var.db_engine_version 
  instance_class          = var.db_instance_class 
  username                = var.db_username 
  password                = var.db_password 
  skip_final_snapshot     = true 
  lifecycle { 
    create_before_destroy = true 
    ignore_changes        = [ 
      "allocated_storage",  # Ignore changes in storage to prevent unintentional downtime. 
    ] 
  } 
} 
output "database_endpoint" { 
  value = aws_rds_instance.example.endpoint 
}