/** 
 * TerraformMappingValidator.ts 
 * Validates Terraform resource mappings for compliance. 
 */ 
import { TerraformResource } from "./terraformMappingTool"; 
/** 
 * Validates a Terraform resource to ensure it meets required compliance standards. 
 * Throws detailed errors for invalid configurations. 
 * 
 * @param terraformResource - The Terraform resource to validate. 
 */ 
export function validateTerraformMapping(terraformResource: TerraformResource): void { 
  // Validate resourceType 
  if (!terraformResource.resourceType || typeof terraformResource.resourceType !== "string") { 
    throw new Error("Validation Error: Resource type is required and must be a string."); 
  } 
  // Validate configuration existence 
  if (!terraformResource.configuration || typeof terraformResource.configuration !== "object") { 
    throw new Error( 
      "Validation Error: The resource configuration cannot be empty and must be an object." 
    ); 
  } 
  // Example additional validation: Ensure required fields exist 
  if (terraformResource.resourceType === "aws_vpc") { 
    if (!terraformResource.configuration.cidr_block) { 
      throw new Error( 
        "Validation Error: CIDR block is required in the configuration for aws_vpc." 
      ); 
    } 
  } 
  if (terraformResource.resourceType === "aws_ecs_cluster") { 
    if (!terraformResource.configuration.name) { 
      throw new Error( 
        "Validation Error: Cluster name is required in the configuration for aws_ecs_cluster." 
      ); 
    } 
  } 
  if (!terraformResource.configuration.tags || typeof terraformResource.configuration.tags !== "object") { 
    throw new Error( 
      "Validation Error: Tags must be an object in the configuration." 
    ); 
  } 
  // Log successful validation for better CLI visibility 
  console.log(`Validation successful for resource: ${JSON.stringify(terraformResource, null, 2)}`); 
}