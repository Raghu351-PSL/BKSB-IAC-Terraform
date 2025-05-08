resource "aws_db_instance" "main" { 
  identifier         = var.db_name 
  allocated_storage  = 20 
  engine             = "postgres" 
  instance_class     = "db.t3.micro" 
  multi_az           = true 
  storage_encrypted  = true 
  publicly_accessible = false 
  tags = { 
    Name = var.db_name 
  } 
} 
output "db_endpoint" { 
  value = aws_db_instance.main.endpoint 
} 