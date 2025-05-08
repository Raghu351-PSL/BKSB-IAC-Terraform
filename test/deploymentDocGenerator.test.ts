import { DeploymentDocGenerator } from '../lib/deploymentDocGenerator'; 
import * as fs from 'fs'; 
describe('DeploymentDocGenerator', () => { 
  const outputDir = 'output_docs'; 
  afterAll(() => { 
    // Clean up generated files 
    fs.rmSync(outputDir, { recursive: true, force: true }); 
  }); 
  test('should generate functional Terraform configurations', () => { 
    const generator = new DeploymentDocGenerator(outputDir); 
    const documentation = generator.generateDocumentation(); 
    expect(documentation.terraformConfig).toContain('resource "aws_vpc" "example_vpc"'); 
    expect(documentation.terraformConfig).toContain('resource "aws_ecs_cluster" "example_cluster"'); 
  }); 
  test('should generate installation steps for Terraform setup', () => { 
    const generator = new DeploymentDocGenerator(outputDir); 
    const documentation = generator.generateDocumentation(); 
    expect(documentation.installationSteps).toEqual([ 
      '1. Install Terraform version 1.10.5.', 
      '2. Configure your AWS credentials and ensure proper IAM permissions.', 
      '3. Clone the Terraform module repository.', 
      '4. Initialize Terraform using `terraform init`.', 
      '5. Plan infrastructure changes with `terraform plan`.', 
      '6. Apply changes with `terraform apply`.' 
    ]); 
  }); 
  test('should generate sample deployment pipeline configuration', () => { 
    const generator = new DeploymentDocGenerator(outputDir); 
    const documentation = generator.generateDocumentation(); 
    expect(documentation.deploymentPipeline).toHaveProperty('pipelineName'); 
    expect(documentation.deploymentPipeline).toHaveProperty('steps'); 
  }); 
}); 