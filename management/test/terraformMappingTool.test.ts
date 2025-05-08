/** 
 * TerraformMappingTool.test.ts 
 * Unit tests for Terraform mapping tool functionality. 
 */ 
import { mapCDKToTerraform } from "../lib/terraformMappingTool"; 
describe("TerraformMappingTool", () => { 
  it("should map AWS::EC2::VPC to aws_vpc", () => { 
    const inputResources = [ 
      { 
        type: "AWS::EC2::VPC", 
        properties: { CidrBlock: "10.0.0.0/16", Tags: { Name: "TestVPC" } }, 
      }, 
    ]; 
    const outputResources = mapCDKToTerraform(inputResources); 
    expect(outputResources).toEqual([ 
      { 
        module: "", 
        resourceType: "aws_vpc", 
        configuration: { cidr_block: "10.0.0.0/16", tags: { Name: "TestVPC" } }, 
      }, 
    ]); 
  }); 
  it("should map AWS::ECS::Cluster to aws_ecs_cluster", () => { 
    const inputResources = [ 
      { 
        type: "AWS::ECS::Cluster", 
        properties: { ClusterName: "TestCluster", Tags: {} }, 
      }, 
    ]; 
    const outputResources = mapCDKToTerraform(inputResources); 
    expect(outputResources).toEqual([ 
      { 
        module: "", 
        resourceType: "aws_ecs_cluster", 
        configuration: { name: "TestCluster", tags: {} }, 
      }, 
    ]); 
  }); 
  it("should throw error for unsupported resource types", () => { 
    const inputResources = [{ type: "AWS::Unknown::Resource", properties: {} }]; 
    expect(() => mapCDKToTerraform(inputResources)).toThrow( 
      "Unsupported resource type: AWS::Unknown::Resource" 
    ); 
  }); 
  it("should throw an error if a required property is missing", () => { 
    const inputResources = [ 
      { 
        type: "AWS::EC2::VPC", 
        properties: { Tags: { Name: "TestVPC" } }, // Missing CidrBlock 
      }, 
    ]; 
    expect(() => mapCDKToTerraform(inputResources)).toThrow( 
      "The resource configuration cannot be empty." 
    ); 
  }); 
  it("should log successful validation of supported resource", () => { 
    console.log = jest.fn(); // Mock console.log 
    const inputResources = [ 
      { 
        type: "AWS::EC2::VPC", 
        properties: { CidrBlock: "10.0.0.0/16", Tags: { Name: "TestVPC" } }, 
      }, 
    ]; 
    mapCDKToTerraform(inputResources); 
    expect(console.log).toHaveBeenCalledWith( 
      "Validation successful for resource: aws_vpc" 
    ); 
  }); 
}); 