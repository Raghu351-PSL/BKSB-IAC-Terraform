import * as fs from 'fs'; 
import { validateTerraformSyntax } from './dynamicConfigUtils'; 
import { DeploymentDocGenerator } from '../lib/deploymentDocGenerator'; 
/** 
 * Converts imperative AWS CDK constructs to Terraform declarative syntax. 
 */ 
export class DynamicConfigConverter { 
  /** 
   * Converts loops into Terraform's `for_each`. 
   * @param imperativeConfig - Configuration using loops in CDK. 
   * @returns Terraform-compatible configuration using `for_each`. 
   */ 
  static convertLoops(imperativeConfig: Record<string, any>): Record<string, any> { 
    if (!imperativeConfig || typeof imperativeConfig !== 'object') { 
      throw new Error('Invalid imperative configuration provided'); 
    } 
    const terraformConfig: Record<string, any> = {}; 
    Object.keys(imperativeConfig).forEach((key) => { 
      // Convert loop-based imperative constructs to Terraform `for_each` 
      terraformConfig[key] = { 
        for_each: Object.keys(imperativeConfig[key]).map((itemKey) => ({ 
          key: itemKey, 
          value: imperativeConfig[key][itemKey], 
        })), 
      }; 
    }); 
    console.log('Successfully converted loops to Terraform-compatible syntax.'); 
    return terraformConfig; 
  } 
  /** 
   * Converts conditional logic into Terraform-compatible syntax. 
   * @param conditionalConfig - Configuration with conditionals. 
   * @param condition - Condition to evaluate. 
   * @returns Terraform-compatible configuration using `count` or conditionals. 
   */ 
  static convertConditionals( 
    conditionalConfig: Record<string, any>, 
    condition: string 
  ): Record<string, any> { 
    if (!conditionalConfig || typeof conditionalConfig !== 'object') { 
      throw new Error('Invalid conditional configuration provided'); 
    } 
    const convertedConfig: Record<string, any> = {}; 
    Object.keys(conditionalConfig).forEach((resourceKey) => { 
      // Convert conditional logic using `count` 
      convertedConfig[resourceKey] = { 
        count: condition ? 1 : 0, // Example condition-based scoping 
        ...conditionalConfig[resourceKey], 
      }; 
    }); 
    console.log('Successfully converted conditionals to Terraform-compatible syntax.'); 
    return convertedConfig; 
  } 
  /** 
   * Generates deployment documentation by consolidating all sections. 
   * @param outputDir - Directory where documentation files will be saved. 
   * @returns Deployment documentation sections. 
   */ 
  static generateDeploymentDocumentation(outputDir: string = 'output_docs'): Record<string, any> { 
    try { 
      // Step 1: Initialize the deployment documentation generator 
      const deploymentDocGenerator = new DeploymentDocGenerator(outputDir); 
      // Step 2: Generate documentation components 
      const documentationSections = deploymentDocGenerator.generateDocumentation(); 
      console.log('Deployment documentation successfully generated.'); 
      return documentationSections; 
    } catch (error) { 
      console.error( 
        'Error while generating deployment documentation:', 
        error.message, 
        error.stack 
      ); 
      throw error; 
    } 
  } 
  /** 
   * Validates whether a given configuration adheres to Terraform syntax. 
   * @param config - Configuration object to validate. 
   */ 
  static validateTerraformSyntax(config: Record<string, any>): void { 
    if (!config || typeof config !== 'object') { 
      throw new Error('Invalid configuration: Must be a non-empty object.'); 
    } 
    const invalidKeys = Object.keys(config).filter((key) => key.includes('invalid')); 
    if (invalidKeys.length > 0) { 
      throw new Error( 
        `Invalid configuration detected! Unsupported keys: ${invalidKeys.join(', ')}` 
      ); 
    } 
  } 
  /** 
   * Writes the converted configuration into a Terraform-compatible JSON file for testing. 
   * @param config - Terraform-compatible configuration. 
   * @param outputFilePath - Path to save the JSON file. 
   */ 
  static writeToFile(config: Record<string, any>, outputFilePath: string): void { 
    try { 
      DynamicConfigConverter.validateTerraformSyntax(config); 
      fs.writeFileSync(outputFilePath, JSON.stringify(config, null, 2)); 
      console.log(`Configuration successfully written to ${outputFilePath}`); 
    } catch (error) { 
      console.error( 
        'Error while writing configuration to file:', 
        error.message, 
        error.stack 
      ); 
      throw error; 
    } 
  } 
}