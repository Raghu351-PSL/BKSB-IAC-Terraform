module "lambda_function" { 
  source      = "../modules/lambda" 
  function_name = "my-serverless-function" 
  filename    = "./dist/my-lambda.zip" 
  handler     = "app.handler" 
  runtime     = "nodejs14.x" 
  role_arn    = aws_iam_role.lambda_execution_role.arn 
  timeout     = 10 
}