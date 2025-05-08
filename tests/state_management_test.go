package tests 
import ( 
	"testing" 
	"github.com/gruntwork-io/terratest/modules/terraform" 
	"github.com/stretchr/testify/assert" 
) 
func TestTerraformStateBackendSetup(t *testing.T) { 
	t.Parallel() 
	// Configure Terraform options 
	terraformOptions := &terraform.Options{ 
		TerraformDir: "../base/bin", 
	} 
	// Ensure Terraform init succeeds 
	terraform.Init(t, terraformOptions) 
	// Check S3 state backend configuration exists 
	stateBucketName := terraform.Output(t, terraformOptions, "state_bucket_name") 
	assert.NotEmpty(t, stateBucketName, "State backend bucket name should not be empty") 
} 