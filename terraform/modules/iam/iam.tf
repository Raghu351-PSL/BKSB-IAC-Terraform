resource "aws_iam_role" "application_role" { 
  name               = var.role_name 
  description        = var.role_description 
  assume_role_policy = file(var.assume_role_policy_path) 
  tags = var.tags 
} 
resource "aws_iam_policy" "application_policy" { 
  name        = var.policy_name 
  description = var.policy_description 
  policy      = file(var.policy_path) 
  tags = var.tags 
} 
resource "aws_iam_policy_attachment" "application_policy_attachment" { 
  name       = var.policy_attachment_name 
  roles      = [aws_iam_role.application_role.name] 
  policy_arn = aws_iam_policy.application_policy.arn 
} 
output "role_arn" { 
  value = aws_iam_role.application_role.arn 
} 
output "policy_arn" { 
  value = aws_iam_policy.application_policy.arn 
} 