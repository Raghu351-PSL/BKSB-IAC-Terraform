package test 
import ( 
    "testing" 
    "github.com/gruntwork-io/terratest/modules/terraform" 
    "github.com/stretchr/testify/assert" 
) 
func TestTerraformInfrastructure(t *testing.T) { 
    t.Parallel() 
    // Define the Terraform options 
    terraformOptions := &terraform.Options{ 
        // The path to where the Terraform configurations are stored 
        TerraformDir: "../products/infra-modules", 
        // Define variables to pass to Terraform 
        Vars: map[string]interface{}{ 
            "environment": "staging", 
            "region": "us-west-2", 
        }, 
    } 
    // Ensure Terraform init and apply work without errors 
    defer terraform.Destroy(t, terraformOptions) // Destroy resources at the end of the test 
    terraform.InitAndApply(t, terraformOptions) 
    // Define assertions to test infrastructure correctness 
    // Test if VPC is created 
    vpcId := terraform.Output(t, terraformOptions, "vpc_id") 
    assert.NotEmpty(t, vpcId, "VPC ID should not be empty") 
    // Test if ECS cluster is created 
    ecsClusterName := terraform.Output(t, terraformOptions, "ecs_cluster_name") 
    assert.NotEmpty(t, ecsClusterName, "ECS Cluster Name should not be empty") 
    // Test if RDS is created 
    rdsInstance := terraform.Output(t, terraformOptions, "rds_instance_id") 
    assert.NotEmpty(t, rdsInstance, "RDS Instance ID should not be empty") 
    // Test if Secrets Manager secret is available 
    secretArn := terraform.Output(t, terraformOptions, "secret_arn") 
    assert.NotEmpty(t, secretArn, "Secrets Manager ARN should not be empty") 
    // Add additional tests for other resources like S3, Load Balancers, IAM Roles 
    s3BucketName := terraform.Output(t, terraformOptions, "s3_bucket_name") 
    assert.NotEmpty(t, s3BucketName, "S3 Bucket Name should not be empty") 
} 