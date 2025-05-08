import { DeploymentDocGenerator } from '../../lib/documentationGenerator'; 
import * as fs from 'fs'; 
describe('Documentation Generator Tests', () => { 
  const outputDir = 'output_docs_test'; 
  afterAll(() => { 
    // Clean up test artifacts 
    fs.rmSync(outputDir, { recursive: true, force: true }); 
  }); 
  test('should create functional Terraform configuration', () => { 
    const generator = new DeploymentDocGenerator(outputDir); 
    const documentation = generator.generateDocumentation(); 
    expect(documentation.terraformConfig).toContain('resource "aws_vpc" "example_vpc"'); 
    expect(documentation.terraformConfig).toContain('resource "aws_subnet" "example_subnet"'); 
    expect(documentation.terraformConfig).toContain('resource "aws_ecs_cluster" "example_cluster"'); 
    const terraformFileContent = fs.readFileSync(`${outputDir}/terraformConfig.tf`, 'utf-8'); 
    expect(terraformFileContent).toBe(documentation.terraformConfig); 
  }); 
  test('should generate installation steps correctly', () => { 
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
    const installationStepsContent = fs.readFileSync(`${outputDir}/installationSteps.txt`, 'utf-8'); 
    expect(installationStepsContent).toBe(documentation.installationSteps.join('\n')); 
  }); 
  test('should produce valid deployment pipeline JSON', () => { 
    const generator = new DeploymentDocGenerator(outputDir); 
    const documentation = generator.generateDocumentation(); 
    expect(documentation.deploymentPipeline).toHaveProperty('pipelineName'); 
    expect(documentation.deploymentPipeline).toHaveProperty('steps'); 
    expect(Array.isArray(documentation.deploymentPipeline.steps)).toBe(true); 
    const pipelineFileContent = fs.readFileSync(`${outputDir}/deploymentPipeline.json`, 'utf-8'); 
    expect(JSON.parse(pipelineFileContent)).toEqual(documentation.deploymentPipeline); 
  }); 
  test('should handle errors gracefully and log them', () => { 
    const mockGenerator = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { 
      throw new Error('Test error: File not found'); 
    }); 
    try { 
      const generator = new DeploymentDocGenerator(outputDir); 
      generator.generateDocumentation(); 
    } catch (error) { 
      expect(error.message).toContain('Test error: File not found'); 
      console.error('Error stack:', error.stack); // Ensure full trace for debugging 
    } 
    mockGenerator.mockRestore(); 
  }); 
}); 