# Terraform Unit Testing Guide 
## Prerequisites 
- Install Go (Golang) version 1.16+. 
- Ensure Terraform CLI is installed. 
## Testing Instructions 
1. Navigate to the `test` directory. 
2. Run the following command to execute tests: 
   ```bash 
   go test -v infra_test.go 
   ``` 
3. Each test will: 
   - Initialize Terraform. 
   - Apply configurations. 
   - Validate outputs for correctness. 
   - Destroy resources after testing. 
## Expected Outputs 
- VPC ID should be valid and not empty. 
- ECS cluster name should exist and match expected configuration. 
- RDS instance ID should be valid. 
- Secrets Manager ARN should be valid. 
- S3 bucket name should be defined. 
## Notes 
- Ensure Terraform outputs are properly defined in corresponding modules (`outputs.tf`). 
- Use Terratest documentation for additional testing capabilities: https://terratest.gruntwork.io/ 