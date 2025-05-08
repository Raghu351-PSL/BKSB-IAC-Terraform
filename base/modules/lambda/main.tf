resource "aws_lambda_function" "lambda_handler" { 
  function_name    = var.function_name 
  filename         = var.filename 
  handler          = var.handler 
  runtime          = var.runtime 
  role             = var.role_arn 
  timeout          = var.timeout 
  # Logging environment variables 
  tags = { 
    Name        = var.function_name 
    Environment = var.environment // INPUT_REQUIRED {Environment variable indicating the deployment environment, e.g., "development"} 
  } 
  environment { 
    variables = { 
      LOG_LEVEL = var.log_level // INPUT_REQUIRED {Logging level for the Lambda function, e.g., "INFO", "DEBUG"} 
    } 
  } 
} 
resource "aws_iam_role" "lambda_execution_role" { 
  name              = var.iam_role_name 
  assume_role_policy = <<EOF 
{ 
  "Version": "2012-10-17", 
  "Statement": [ 
    { 
      "Action": "sts:AssumeRole", 
      "Principal": { 
        "Service": "lambda.amazonaws.com" 
      }, 
      "Effect": "Allow", 
      "Sid": "" 
    } 
  ] 
} 
EOF 
  tags = { 
    Name        = var.iam_role_name 
    Environment = var.environment // INPUT_REQUIRED {Environment variable indicating the deployment environment, e.g., "development"} 
  } 
} 
resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" { 
  role       = aws_iam_role.lambda_execution_role.name 
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" 
} 
output "lambda_function_arn" { 
  description = "ARN of the deployed Lambda function" 
  value       = aws_lambda_function.lambda_handler.arn 
} 
# Error Handling & Logging Updates: 
locals { 
  log_prefix = "[Lambda Module]" 
} 
# Adds provisioner for additional AWS Cloudwatch Logging or Debugging 
resource "aws_cloudwatch_log_group" "lambda_log_group" { 
  name              = "${aws_lambda_function.lambda_handler.function_name}-log-group" 
  retention_in_days = var.log_retention_days // INPUT_REQUIRED {The number of days to retain logs} 
  tags = { 
    Name        = "${var.function_name}-logs" 
    Environment = var.environment // INPUT_REQUIRED {Environment variable for log tag, e.g., "production"} 
  } 
}