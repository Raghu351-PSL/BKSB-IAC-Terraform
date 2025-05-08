import { execSync } from 'child_process'; 
export class TerraformDefinitions { 
  /** 
   * Initializes Terraform project directory. 
   */ 
  public static initTerraform(): void { 
    try { 
      console.log('Initializing Terraform project...'); 
      execSync('terraform init', { cwd: 'terraform', stdio: 'inherit' }); 
      console.log('Terraform project initialized successfully.'); 
    } catch (error) { 
      console.error('Error initializing Terraform project:', error); 
      throw new Error(`Terraform initialization failed: ${error.message}`); 
    } 
  } 
  /** 
   * Validates Terraform project configuration. 
   */ 
  public static validateTerraform(): void { 
    try { 
      console.log('Validating Terraform configuration...'); 
      execSync('terraform validate', { cwd: 'terraform', stdio: 'inherit' }); 
      console.log('Terraform configuration validated successfully.'); 
    } catch (error) { 
      console.error('Error validating Terraform configuration:', error); 
      throw new Error(`Terraform validation failed: ${error.message}`); 
    } 
  } 
  /** 
   * Plans Terraform infrastructure changes using specified .tfvars file. 
   * @param {string} tfVarsFile - Path to .tfvars file containing variables. 
   */ 
  public static planTerraform(tfVarsFile: string): void { 
    try { 
      console.log(`Planning Terraform infrastructure changes with variables file: ${tfVarsFile}...`); 
      execSync(`terraform plan -var-file=${tfVarsFile}`, { cwd: 'terraform', stdio: 'inherit' }); 
      console.log('Terraform plan generated successfully.'); 
    } catch (error) { 
      console.error('Error generating Terraform plan:', error); 
      throw new Error(`Terraform planning failed: ${error.message}`); 
    } 
  } 
  /** 
   * Applies Terraform infrastructure changes using specified .tfvars file. 
   * @param {string} tfVarsFile - Path to .tfvars file containing variables. 
   */ 
  public static applyTerraform(tfVarsFile: string): void { 
    try { 
      console.log(`Applying Terraform infrastructure changes with variables file: ${tfVarsFile}...`); 
      execSync(`terraform apply -var-file=${tfVarsFile} -auto-approve`, { cwd: 'terraform', stdio: 'inherit' }); 
      console.log('Terraform infrastructure applied successfully.'); 
    } catch (error) { 
      console.error('Error applying Terraform infrastructure:', error); 
      throw new Error(`Terraform application failed: ${error.message}`); 
    } 
  } 
  /** 
   * Destroys Terraform-managed infrastructure using specified .tfvars file. 
   * @param {string} tfVarsFile - Path to .tfvars file containing variables. 
   */ 
  public static destroyTerraform(tfVarsFile: string): void { 
    try { 
      console.log(`Destroying Terraform-managed infrastructure with variables file: ${tfVarsFile}...`); 
      execSync(`terraform destroy -var-file=${tfVarsFile} -auto-approve`, { cwd: 'terraform', stdio: 'inherit' }); 
      console.log('Terraform infrastructure destroyed successfully.'); 
    } catch (error) { 
      console.error('Error destroying Terraform infrastructure:', error); 
      throw new Error(`Terraform destruction failed: ${error.message}`); 
    } 
  } 
} 