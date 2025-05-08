import * as fs from 'fs'; 
import * as path from 'path'; 
interface DocumentationSections { 
  terraformConfig: string; 
  installationSteps: string[]; 
  deploymentPipeline: object; 
} 
/** 
 * Class representing the installation generator. 
 */ 
export class InstallGenerator { 
  private outputDirectory: string; 
  constructor(outputDir: string = 'output_docs') { 
    this.outputDirectory = outputDir; 
  } 
  /** 
   * Generates Terraform equivalent configurations. 
   * @returns Terraform configuration as a string. 
   */ 
  private generateTerraformConfig(): string { 
    const terraformConfig = ` 
resource "aws_vpc" "install_vpc" { 
  cidr_block = "10.0.0.0/16" 
} 
resource "aws_subnet" "install_subnet" { 
  vpc_id     = aws_vpc.install_vpc.id 
  cidr_block = "10.0.1.0/24" 
} 
resource "aws_ecs_cluster" "install_cluster" { 
  name = "install-cluster" 
} 
    `; 
    console.log('Terraform configuration generated successfully.'); 
    return terraformConfig; 
  } 
  /** 
   * Creates installation steps for setting up the Terraform application. 
   * @returns List of installation steps as an array. 
   */ 
  private generateInstallationSteps(): string[] { 
    const steps = [ 
      '1. Install Terraform version 1.10.5.', 
      '2. Configure your AWS credentials with proper IAM permissions.', 
      '3. Clone the Terraform module repository.', 
      '4. Initialize Terraform using `terraform init`.', 
      '5. Plan infrastructure changes using `terraform plan`.', 
      '6. Apply changes using `terraform apply`.' 
    ]; 
    console.log('Installation steps generated successfully.'); 
    return steps; 
  } 
  /** 
   * Fetches a sample deployment pipeline configuration from a static JSON file. 
   * @returns Sample deploy pipeline configuration as an object. 
   */ 
  private getSampleDeployPipeline(): object { 
    try { 
      const templatePath = path.resolve(__dirname, '../templates/deploymentPipelineExample.json'); 
      const pipelineTemplate = fs.readFileSync(templatePath, 'utf-8'); 
      console.log('Deployment pipeline template read successfully.'); 
      return JSON.parse(pipelineTemplate); 
    } catch (error) { 
      console.error('Error reading deployment pipeline template:', error); 
      return {}; 
    } 
  } 
  /** 
   * Generates the full deployment documentation including Terraform configs, 
   * installation steps, and deployment pipeline. 
   */ 
  public generateDocumentation(): DocumentationSections { 
    try { 
      const terraformConfig = this.generateTerraformConfig(); 
      const installationSteps = this.generateInstallationSteps(); 
      const deploymentPipeline = this.getSampleDeployPipeline(); 
      // Ensure output directory exists 
      fs.mkdirSync(this.outputDirectory, { recursive: true }); 
      // Save generated sections to files in the output directory 
      fs.writeFileSync(path.join(this.outputDirectory, 'terraformConfig.tf'), terraformConfig); 
      fs.writeFileSync(path.join(this.outputDirectory, 'installationSteps.txt'), installationSteps.join('\n')); 
      fs.writeFileSync(path.join(this.outputDirectory, 'deploymentPipeline.json'), JSON.stringify(deploymentPipeline, null, 2)); 
      console.log('Documentation saved successfully to output directory:', this.outputDirectory); 
      return { terraformConfig, installationSteps, deploymentPipeline }; 
    } catch (error) { 
      console.error('Error generating documentation:', error); 
      return { terraformConfig: '', installationSteps: [], deploymentPipeline: {} }; 
    } 
  } 
} 