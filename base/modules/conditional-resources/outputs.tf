output "bucket_id" { 
  description = "The ID of the S3 bucket created." 
  value       = var.enable_bucket ? aws_s3_bucket.example_conditional_bucket[0].id : null 
} 
output "null_resource_id" { 
  description = "The ID of the null resource created." 
  value       = var.enable_null_resource ? null_resource.example_null_resource[0].id : null 
}