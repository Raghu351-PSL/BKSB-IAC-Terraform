import * as fs from 'fs'; 
import * as path from 'path'; 
interface DocumentationSections { 
  terraformConfig: string; 
  installationSteps: string[]; 
  deploymentPipeline: object; 
} 
/** 
 * Class representing the deployment documentation generator. 
 */ 
export class DeploymentDocGenerator { 
  private outputDirectory: string; 
  constructor(outputDir: string = 'output_docs') { 
    this.outputDirectory = outputDir; 
  } 
  /** 
   * Generates Terraform equivalent configurations. 
   * @returns Terraform configuration as a string. 
   */ 
  private generateTerraformConfig(): string { 
    return ` 
resource "aws_vpc" "example_vpc" { 
  cidr_block = "10.0.0.0/16" 
} 
resource "aws_subnet" "example_subnet" { 
  vpc_id     = aws_vpc.example_vpc.id 
  cidr_block = "10.0.1.0/24" 
} 
resource "aws_ecs_cluster" "example_cluster" { 
  name = "example-cluster" 
} 
    `; 
  } 
  /** 
   * Creates installation steps for setting up the migrated Terraform application. 
   * @returns List of installation steps as an array. 
   */ 
  private generateInstallationSteps(): string[] { 
    return [ 
      '1. Install Terraform version 1.10.5.', 
      '2. Configure your AWS credentials and ensure proper IAM permissions.', 
      '3. Clone the Terraform module repository.', 
      '4. Initialize Terraform using `terraform init`.', 
      '5. Plan infrastructure changes with `terraform plan`.', 
      '6. Apply changes with `terraform apply`.' 
    ]; 
  } 
  /** 
   * Fetches a sample deploy pipeline configuration from a JSON template. 
   * @returns Sample deploy pipeline configuration as an object. 
   */ 
  private getSampleDeployPipeline(): object { 
    const templatePath = path.resolve(__dirname, '../templates/deploymentPipelineExample.json'); 
    if (!fs.existsSync(templatePath)) { 
      throw new Error(`Template file not found at: ${templatePath}`); 
    } 
    try { 
      const pipelineTemplate = fs.readFileSync(templatePath, 'utf-8'); 
      return JSON.parse(pipelineTemplate); 
    } catch (error) { 
      console.error('Error while reading or parsing the pipeline template:', error); 
      throw error; 
    } 
  } 
  /** 
   * Generates deployment documentation by consolidating all sections. 
   */ 
  public generateDocumentation(): DocumentationSections { 
    console.log('Starting documentation generation...'); 
    let terraformConfig: string; 
    let installationSteps: string[]; 
    let deploymentPipeline: object; 
    try { 
      terraformConfig = this.generateTerraformConfig(); 
      console.log('Terraform configuration generated.'); 
      installationSteps = this.generateInstallationSteps(); 
      console.log('Installation steps generated.'); 
      deploymentPipeline = this.getSampleDeployPipeline(); 
      console.log('Deployment pipeline configuration fetched.'); 
    } catch (error) { 
      console.error('Error during documentation generation:', error); 
      throw error; 
    } 
    // Save documentation to files in the output directory 
    try { 
      fs.mkdirSync(this.outputDirectory, { recursive: true }); 
      console.log(`Output directory created at: ${this.outputDirectory}`); 
      fs.writeFileSync(path.join(this.outputDirectory, 'terraformConfig.tf'), terraformConfig); 
      console.log('Terraform configuration saved.'); 
      fs.writeFileSync(path.join(this.outputDirectory, 'installationSteps.txt'), installationSteps.join('\n')); 
      console.log('Installation steps saved.'); 
      fs.writeFileSync(path.join(this.outputDirectory, 'deploymentPipeline.json'), JSON.stringify(deploymentPipeline, null, 2)); 
      console.log('Deployment pipeline configuration saved.'); 
    } catch (error) { 
      console.error('Error while saving documentation files:', error); 
      throw error; 
    } 
    return { terraformConfig, installationSteps, deploymentPipeline }; 
  } 
} 