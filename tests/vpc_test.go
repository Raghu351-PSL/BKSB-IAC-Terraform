package tests 
import ( 
	"testing" 
	"github.com/gruntwork-io/terratest/modules/aws" 
	"github.com/gruntwork-io/terratest/modules/terraform" 
	"github.com/stretchr/testify/assert" 
) 
func TestTerraformVpcModule(t *testing.T) { 
	t.Parallel() 
	// Configure Terraform options 
	terraformOptions := &terraform.Options{ 
		TerraformDir: "../base/modules/vpc", 
		Vars: map[string]interface{}{ 
			"cidr_block":          "10.0.0.0/16", 
			"public_subnet_cidr":  "10.0.1.0/24", 
			"private_subnet_cidr": "10.0.2.0/24", 
		}, 
	} 
	// Ensure Terraform init, plan, and apply succeed 
	defer terraform.Destroy(t, terraformOptions) 
	terraform.InitAndApply(t, terraformOptions) 
	// Retrieve VPC ID to confirm resource creation 
	vpcID := terraform.Output(t, terraformOptions, "vpc_id") 
	assert.NotEmpty(t, vpcID, "VPC ID should not be empty") 
	// Verify VPC exists in AWS 
	awsRegion := terraform.Output(t, terraformOptions, "aws_region") 
	assert.True(t, aws.IsVpcAvailable(t, vpcID, awsRegion), "VPC is not available in AWS") 
} 