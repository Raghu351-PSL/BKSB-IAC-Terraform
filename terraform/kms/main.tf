# KMS module: main.tf 
resource "aws_kms_key" "main" { 
  description        = var.description 
  enable_key_rotation = true 
  tags = merge(var.common_tags, { 
    Name = "${var.environment}-kms-key" 
  }) 
} 
output "key_id" { 
  value = aws_kms_key.main.id 
} 