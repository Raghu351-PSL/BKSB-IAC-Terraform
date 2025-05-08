package test 
import ( 
	"testing" 
	"log" 
	"github.com/gruntwork-io/terratest/modules/terraform" 
) 
func TestNetworkModule(t *testing.T) { 
	t.Parallel() 
	// Define Terraform options 
	terraformOptions := &terraform.Options{ 
		TerraformDir: "../modules/network", 
		Vars: map[string]interface{}{ 
			"vpc_cidr_block":     "10.0.0.0/16", 
			"public_cidr_block":  "10.0.1.0/24", 
			"private_cidr_block": "10.0.2.0/24", 
			"availability_zone":  "us-east-1a", 
			"tags": map[string]string{ 
				"Name":        "test-network", 
				"Environment": "test", 
			}, 
		}, 
	} 
	// Ensure terraform clean-up happens after testing 
	defer func() { 
		log.Println("Destroying Terraform configurations...") 
		terraform.Destroy(t, terraformOptions) 
	}() 
	// Log initialization and application step 
	log.Println("Initializing and applying Terraform configurations...") 
	err := terraform.InitAndApply(t, terraformOptions) 
	if err != nil { 
		log.Fatalf("Error during InitAndApply: %v", err) 
	} 
	// Validate VPC ID output 
	log.Println("Retrieving VPC ID from outputs...") 
	vpcID := terraform.Output(t, terraformOptions, "vpc_id") 
	if vpcID == "" { 
		log.Fatal("VPC ID is empty") 
	} else { 
		log.Printf("VPC ID retrieved successfully: %s", vpcID) 
	} 
	// Validate subnet IDs output 
	log.Println("Retrieving subnet IDs from outputs...") 
	subnetIDs := terraform.OutputList(t, terraformOptions, "subnet_ids") 
	if len(subnetIDs) == 0 { 
		log.Fatal("Subnet IDs are empty") 
	} else { 
		log.Printf("Subnet IDs retrieved successfully: %v", subnetIDs) 
	} 
}