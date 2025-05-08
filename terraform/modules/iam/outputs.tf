output "role_arn" { 
  description = "ARN of the IAM role" 
  value       = aws_iam_role.application_role.arn 
} 
output "policy_arn" { 
  description = "ARN of the IAM policy" 
  value       = aws_iam_policy.application_policy.arn 
} 