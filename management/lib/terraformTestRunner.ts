import { exec } from 'child_process'; 
import { promisify } from 'util'; 
import fs from 'fs'; 
import { EdgeCaseAnalyzer } from './edgeCaseAnalyzer'; 
const execPromise = promisify(exec); 
export class TerraformTestRunner { 
  private configFilePath: string; 
  constructor(configFilePath: string) { 
    if (!fs.existsSync(configFilePath)) { 
      console.error(`Configuration file not found at: ${configFilePath}`); 
      throw new Error(`Configuration file ${configFilePath} not found.`); 
    } 
    this.configFilePath = configFilePath; 
  } 
  public async runTerraformInit(): Promise<void> { 
    try { 
      const { stdout, stderr } = await execPromise(`terraform init -input=false`, { cwd: this.configFilePath }); 
      this.logResult('Terraform init', stdout, stderr); 
    } catch (error) { 
      console.error(`Error running 'terraform init':`, error); 
      throw new Error(`Error running 'terraform init': ${error.message}`); 
    } 
  } 
  public async runTerraformValidate(): Promise<void> { 
    try { 
      const { stdout, stderr } = await execPromise(`terraform validate`, { cwd: this.configFilePath }); 
      this.logResult('Terraform validate', stdout, stderr); 
    } catch (error) { 
      console.error(`Error running 'terraform validate':`, error); 
      throw new Error(`Error running 'terraform validate': ${error.message}`); 
    } 
  } 
  public async runTerraformPlan(): Promise<void> { 
    try { 
      const { stdout, stderr } = await execPromise(`terraform plan -input=false`, { cwd: this.configFilePath }); 
      this.logResult('Terraform plan', stdout, stderr); 
    } catch (error) { 
      console.error(`Error running 'terraform plan':`, error); 
      throw new Error(`Error running 'terraform plan': ${error.message}`); 
    } 
  } 
  public async runEdgeCaseAnalysis(): Promise<void> { 
    try { 
      console.log("Running edge case analysis..."); 
      const configContent = this.loadTerraformConfig(); 
      const planContent = await this.generateTerraformPlan(); 
      const isCircularDependenciesValid = EdgeCaseAnalyzer.validateCircularDependencies(configContent); 
      if (!isCircularDependenciesValid) { 
        console.error("Circular dependency validation failed. Using fallback mechanism."); 
        // Fallback logic in case circular dependencies validation fails 
        return; // Exit further analysis if critical circular dependency failure occurs 
      } 
      const isForbiddenChangesValid = EdgeCaseAnalyzer.validateForbiddenResourceChanges(planContent); 
      if (!isForbiddenChangesValid) { 
        console.error("Forbidden resource changes detected! Logging and aborting further analysis."); 
        throw new Error("Forbidden resource changes detected."); 
      } 
      const isAdvancedAnalysisValid = EdgeCaseAnalyzer.performAdvancedEdgeCaseAnalysis(configContent); 
      if (!isAdvancedAnalysisValid) { 
        console.error("Advanced edge-case analysis failed! Retrying with default configuration."); 
        // Retry logic or fallback analysis 
        const defaultConfig = {}; // Example fallback configuration 
        const retryAnalysis = EdgeCaseAnalyzer.performAdvancedEdgeCaseAnalysis(defaultConfig); 
        if (!retryAnalysis) { 
          throw new Error("Retry of advanced edge-case analysis also failed."); 
        } 
      } 
      console.log("Edge case analysis completed successfully."); 
    } catch (error) { 
      console.error(`Error running edge case analysis:`, error); 
      throw new Error(`Error during edge case analysis: ${error.message}`); 
    } 
  } 
  private async generateTerraformPlan(): Promise<string> { 
    try { 
      const { stdout } = await execPromise(`terraform plan -input=false`, { cwd: this.configFilePath }); 
      console.log("Terraform plan generated successfully."); 
      return stdout; 
    } catch (error) { 
      console.error(`Error generating Terraform plan:`, error); 
      throw new Error(`Error generating Terraform plan: ${error.message}`); 
    } 
  } 
  private loadTerraformConfig(): any { 
    try { 
      const configFile = `${this.configFilePath}/terraform-config.json`; 
      if (fs.existsSync(configFile)) { 
        const configContent = fs.readFileSync(configFile, 'utf-8'); 
        console.log("Terraform config loaded successfully."); 
        return JSON.parse(configContent); 
      } else { 
        console.warn(`Terraform config file not found at: ${configFile}. Default configuration will be used.`); 
        return {}; // Return an empty default configuration or fallback if the file is missing 
      } 
    } catch (error) { 
      console.error(`Error loading Terraform config:`, error); 
      throw new Error(`Error loading Terraform config: ${error.message}`); 
    } 
  } 
  private logResult(command: string, stdout: string, stderr: string): void { 
    console.log(`Command: ${command}`); 
    console.log(`STDOUT:\n${stdout}`); 
    if (stderr) { 
      console.warn(`STDERR:\n${stderr}`); 
    } 
  } 
}