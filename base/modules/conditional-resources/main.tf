resource "aws_s3_bucket" "example_conditional_bucket" { 
  count = var.enable_bucket ? 1 : 0 
  bucket        = var.bucket_name 
  acl           = "private" 
  force_destroy = true 
  lifecycle { 
    prevent_destroy = var.prevent_destroy 
  } 
  tags = merge( 
    var.default_tags, 
    { 
      "Name"        = var.bucket_name, 
      "Environment" = var.environment 
    } 
  ) 
} 
resource "null_resource" "example_null_resource" { 
  count = var.enable_null_resource ? 1 : 0 
  provisioner "local-exec" { 
    command = "echo 'Null resource executed for ${var.bucket_name}'" 
  } 
  triggers = { 
    always_run = timestamp() 
  } 
} 