output "lambda_function_arn" { 
  description = "ARN of the deployed Lambda function" 
  value       = aws_lambda_function.lambda_handler.arn 
} 
output "lambda_function_name" { 
  description = "Name of the deployed Lambda function" 
  value       = aws_lambda_function.lambda_handler.function_name 
} 
output "lambda_function_runtime" { 
  description = "Runtime used by the deployed Lambda function" 
  value       = aws_lambda_function.lambda_handler.runtime 
} 
output "lambda_arn" { 
  description = "ARN of the deployed Lambda function for testing" 
  value       = aws_lambda_function.lambda.arn 
}