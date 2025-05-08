# Terraform Remote State Backend Setup 
## Overview 
This document outlines the steps for setting up and using Terraform's remote state management with S3 and DynamoDB for state locking. 
## Files 
1. `state-management/remote_state.tf` – Configures the remote state using S3 backend. 
2. `state-resources/s3_and_dynamodb.tf` – Creates the S3 bucket and DynamoDB table. 
## Steps to Initialize: 
1. Navigate to the `state-management` directory. 
2. Run `terraform init` to initialize the backend. 
3. Create a new workspace for your environment using `terraform workspace new <environment>`. 
4. Test configurations with `terraform plan`. 
## Notes 
- Replace all placeholders (e.g., `<ENVIRONMENT>`, bucket name, etc.) with actual values. 
- Ensure proper IAM policies are in place for accessing the S3 bucket and DynamoDB table. 