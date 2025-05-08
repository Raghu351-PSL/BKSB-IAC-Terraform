output "s3_bucket_name" { 
  value       = aws_s3_bucket.main.bucket 
  description = "The name of the S3 bucket" 
} 
output "s3_bucket_arn" { 
  value       = aws_s3_bucket.main.arn 
  description = "The ARN of the S3 bucket" 
} 
output "s3_bucket_region" { 
  value       = aws_s3_bucket.main.region 
  description = "The AWS region of the S3 bucket" 
}