import * as cxapi from '@aws-cdk/cx-api'; 
import { App } from 'aws-cdk-lib'; 
import * as chalk from 'chalk'; 
import * as readlineSync from 'readline-sync'; 
import { mapCDKToTerraform } from './terraformMappingTool'; 
/** 
 * Migration Interface Class 
 * Provides tools to analyze the current AWS CDK application structure and display details. 
 * Also provides functionality to translate AWS CDK constructs into Terraform resources. 
 */ 
class MigrationInterface { 
  private app: App; 
  constructor(app: App) { 
    this.app = app; 
  } 
  /** 
   * Analyze the current AWS CDK App and return a summary of all stacks, resources, dependencies, and configurations. 
   */ 
  public analyzeAppStructure(): void { 
    try { 
      console.log(chalk.bold.blue('Analyzing AWS CDK Application Structure...')); 
      // Obtain synthesized cloud assembly 
      const cloudAssembly = this.app.synth(); 
      console.log(chalk.green('Stacks found:')); 
      cloudAssembly.stacks.forEach((stack) => { 
        try { 
          console.log(chalk.bold.yellow(`\nStack Name: ${stack.stackName}`)); 
          // List resources in the stack 
          console.log(chalk.green('  Resources:')); 
          if (stack.template?.Resources) { 
            Object.entries(stack.template.Resources).forEach(([key, resource]) => { 
              console.log(`    - ${key} (${resource['Type']})`); 
            }); 
          } else { 
            console.log(chalk.red('    No resources found.')); 
          } 
          // List outputs in the stack, if available 
          if (stack.outputs && Object.keys(stack.outputs).length > 0) { 
            console.log(chalk.green('  Outputs:')); 
            Object.entries(stack.outputs).forEach(([key, value]) => { 
              console.log(`    - ${key}: ${JSON.stringify(value)}`); 
            }); 
          } else { 
            console.log(chalk.red('    No outputs found.')); 
          } 
          // Check for dependencies 
          const dependencies = stack.dependencies.map((s) => s.id) || []; 
          if (dependencies.length > 0) { 
            console.log(chalk.green('  Dependencies:')); 
            dependencies.forEach((dependency) => { 
              console.log(`    - ${dependency}`); 
            }); 
          } else { 
            console.log(chalk.red('    No dependencies found.')); 
          } 
        } catch (stackError) { 
          console.error(chalk.red(`Error processing stack ${stack.stackName}:`), stackError); 
        } 
      }); 
      console.log(chalk.bold.blue('\nAnalysis Complete!')); 
    } catch (error) { 
      console.error(chalk.red('Error during application structure analysis:'), error); 
    } 
  } 
  /** 
   * Translate AWS CDK resources into Terraform resources. 
   */ 
  public translateCDKToTerraform(): void { 
    try { 
      console.log(chalk.bold.blue('Translating AWS CDK Resources to Terraform Resources...')); 
      // Obtain synthesized cloud assembly 
      const cloudAssembly = this.app.synth(); 
      let allResources = []; 
      cloudAssembly.stacks.forEach((stack) => { 
        if (stack.template?.Resources) { 
          Object.entries(stack.template.Resources).forEach(([key, resource]) => { 
            allResources.push({ type: resource['Type'], properties: resource['Properties'] || {} }); 
          }); 
        } 
      }); 
      if (allResources.length === 0) { 
        console.log(chalk.red('No resources found to translate.')); 
        return; 
      } 
      try { 
        const terraformResources = mapCDKToTerraform(allResources); 
        console.log(chalk.green('Mapped Terraform Resources:')); 
        console.log(terraformResources); 
      } catch (mappingError) { 
        console.error(chalk.red('Error during resource translation:'), mappingError.message, mappingError.stack); 
      } 
      console.log(chalk.bold.blue('\nTranslation Complete!')); 
    } catch (error) { 
      console.error(chalk.red('Error during CDK to Terraform translation:'), error.message, error.stack); 
    } 
  } 
} 
// Program Entry Point 
if (require.main === module) { 
  console.log(chalk.bold.magenta('Welcome to the AWS CDK Application Migration Interface!')); 
  try { 
    // Ask the user what action they want to perform 
    const userResponse = readlineSync.question( 
      chalk.magenta('Do you want to (1) analyze the application structure or (2) translate CDK to Terraform? (enter 1/2): ') 
    ); 
    const app = new App(); 
    const migrationInterface = new MigrationInterface(app); 
    if (userResponse.trim() === '1') { 
      migrationInterface.analyzeAppStructure(); 
    } else if (userResponse.trim() === '2') { 
      migrationInterface.translateCDKToTerraform(); 
    } else { 
      console.log(chalk.red('Invalid input. Exiting Migration Interface.')); 
    } 
  } catch (entryError) { 
    console.error(chalk.red('Error initializing Migration Interface:'), entryError.message, entryError.stack); 
  } 
} 
export { MigrationInterface };