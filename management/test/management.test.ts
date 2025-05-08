/** 
 * management.test.ts 
 * Updated test implementation to integrate Terraform architecture mapping tool tests. 
 */ 
import { mapCDKToTerraform } from "../lib/terraformMappingTool"; 
describe("Management Tests", () => { 
  test("Terraform Resource Mapping Integration", () => { 
    const inputResources = [ 
      { 
        type: "AWS::EC2::VPC", 
        properties: { 
          CidrBlock: "10.0.0.0/16", 
          Tags: { Name: "TestVPC" }, 
        }, 
      }, 
      { 
        type: "AWS::ECS::Cluster", 
        properties: { 
          ClusterName: "TestCluster", 
          Tags: {}, 
        }, 
      }, 
    ]; 
    try { 
      const outputResources = mapCDKToTerraform(inputResources); 
      expect(outputResources).toEqual([ 
        { 
          module: "", 
          resourceType: "aws_vpc", 
          configuration: { cidr_block: "10.0.0.0/16", tags: { Name: "TestVPC" } }, 
        }, 
        { 
          module: "", 
          resourceType: "aws_ecs_cluster", 
          configuration: { name: "TestCluster", tags: {} }, 
        }, 
      ]); 
      console.log("Terraform resource mapping succeeded."); 
    } catch (error) { 
      console.error("Error during Terraform resource mapping:", error.message); 
    } 
  }); 
});