import { spawnSync } from 'child_process'; 
function executeCommand(command: string, args: string[], workingDir?: string): void { 
    console.log(`Executing command: ${command} ${args.join(' ')}`); 
    const result = spawnSync(command, args, { cwd: workingDir, stdio: 'inherit' }); 
    if (result.error) { 
        console.error(`Error occurred while executing the command: ${result.error.message}`); 
        console.error(result.error.stack); 
        throw result.error; 
    } 
    if (result.status !== 0) { 
        throw new Error(`Command "${command} ${args.join(' ')}" failed with exit code ${result.status}`); 
    } 
} 
function initializeTerraform(): void { 
    console.log('Initializing Terraform...'); 
    executeCommand('terraform', ['init'], './terraform'); 
    console.log('Terraform initialized successfully.'); 
} 
function validateTerraform(): void { 
    console.log('Validating Terraform configuration...'); 
    executeCommand('terraform', ['validate'], './terraform'); 
    console.log('Terraform configuration validated successfully.'); 
} 
function planTerraform(envFile: string): void { 
    console.log(`Planning Terraform infrastructure using ${envFile}...`); 
    executeCommand('terraform', ['plan', `-var-file=environments/${envFile}`], './terraform'); 
    console.log('Terraform plan completed successfully.'); 
} 
function applyTerraform(envFile: string): void { 
    console.log(`Applying Terraform infrastructure using ${envFile}...`); 
    executeCommand('terraform', ['apply', `-var-file=environments/${envFile}`], './terraform'); 
    console.log('Terraform infrastructure applied successfully.'); 
} 
function runTerraformWorkflow(environment: string): void { 
    console.log(`Running Terraform workflow for the environment: ${environment}`); 
    try { 
        initializeTerraform(); 
        validateTerraform(); 
        planTerraform(`${environment}.tfvars`); 
        applyTerraform(`${environment}.tfvars`); 
        console.log(`Terraform workflow completed successfully for the environment: ${environment}`); 
    } catch (error) { 
        console.error(`Terraform workflow failed: ${error.message}`); 
        console.error(error.stack); 
    } 
} 
// Replace 'dev' with the desired environment name (e.g., 'prod') to control the environment. 
runTerraformWorkflow('dev'); 