package tests 
import ( 
	"testing" 
	"github.com/gruntwork-io/terratest/modules/terraform" 
	"github.com/stretchr/testify/assert" 
) 
func TestTerraformLambdaModule(t *testing.T) { 
	t.Parallel() 
	// Configure Terraform options 
	terraformOptions := &terraform.Options{ 
		TerraformDir: "../base/modules/lambda", 
		Vars: map[string]interface{}{ 
			"function_name": "testLambda", 
			"runtime": "nodejs14.x", 
		}, 
	} 
	// Ensure Terraform init, plan, and apply succeed 
	defer terraform.Destroy(t, terraformOptions) 
	terraform.InitAndApply(t, terraformOptions) 
	// Retrieve Lambda ARN to validate resource creation 
	lambdaARN := terraform.Output(t, terraformOptions, "lambda_arn") 
	assert.NotEmpty(t, lambdaARN, "Lambda ARN should not be empty") 
} 