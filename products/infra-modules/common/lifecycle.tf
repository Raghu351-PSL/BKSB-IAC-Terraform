# Lifecycle conditions for Terraform resources 
resource "aws_instance" "example" { 
  ami           = var.ami_id 
  instance_type = var.instance_type 
  lifecycle { 
    create_before_destroy = true 
    ignore_changes        = [ 
      "tags",  # Prevent state changes based on tag updates. 
    ] 
  } 
} 
resource "aws_s3_bucket" "example" { 
  bucket = var.bucket_name 
  lifecycle { 
    prevent_destroy = true  # Ensure critical buckets are not destroyed accidentally. 
  } 
} 
output "instance_id" { 
  value = aws_instance.example.id 
} 
output "bucket_arn" { 
  value = aws_s3_bucket.example.arn 
} 