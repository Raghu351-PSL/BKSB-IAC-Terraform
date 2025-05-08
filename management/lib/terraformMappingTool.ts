/** 
 * TerraformMappingTool.ts 
 * Translates AWS CDK constructs into Terraform resource equivalents. 
 */ 
import { validateTerraformMapping } from "./terraformMappingValidator"; 
export interface CDKResource { 
  type: string; 
  properties: Record<string, any>; 
} 
export interface TerraformResource { 
  module: string; 
  resourceType: string; 
  configuration: Record<string, any>; 
} 
/** 
 * Main Mapper Function: Converts AWS CDK resources into Terraform resources. 
 */ 
export function mapCDKToTerraform(cdkResources: CDKResource[]): TerraformResource[] { 
  const terraformResources: TerraformResource[] = []; 
  cdkResources.forEach((cdkResource) => { 
    try { 
      console.log(`Mapping CDK resource of type: ${cdkResource.type}`); 
      const mappingResult = convertToTerraform(cdkResource); 
      terraformResources.push(mappingResult); 
      console.log(`Successfully mapped resource: ${cdkResource.type} to Terraform resource type: ${mappingResult.resourceType}`); 
    } catch (error) { 
      console.error(`Error mapping resource of type: ${cdkResource.type}. Details: ${error.message}`); 
      throw error; 
    } 
  }); 
  return terraformResources; 
} 
/** 
 * Converts a single CDK resource to Terraform resource. 
 */ 
function convertToTerraform(cdkResource: CDKResource): TerraformResource { 
  let terraformResource: TerraformResource; 
  switch (cdkResource.type) { 
    case "AWS::EC2::VPC": 
      terraformResource = { 
        module: "", 
        resourceType: "aws_vpc", 
        configuration: { 
          cidr_block: cdkResource.properties.CidrBlock, 
          tags: cdkResource.properties.Tags || {}, 
        }, 
      }; 
      break; 
    case "AWS::ECS::Cluster": 
      terraformResource = { 
        module: "", 
        resourceType: "aws_ecs_cluster", 
        configuration: { 
          name: cdkResource.properties.ClusterName, 
          tags: cdkResource.properties.Tags || {}, 
        }, 
      }; 
      break; 
    // Additional mappings can be added here for other AWS CDK constructs 
    default: 
      const errorMessage = `Unsupported resource type: ${cdkResource.type}`; 
      console.error(errorMessage); 
      throw new Error(errorMessage); 
  } 
  try { 
    validateTerraformMapping(terraformResource); 
    console.log(`Validation passed for resource type: ${terraformResource.resourceType}`); 
  } catch (validationError) { 
    console.error(`Validation failed for resource type: ${terraformResource.resourceType}. Details: ${validationError.message}`); 
    throw validationError; 
  } 
  return terraformResource; 
}