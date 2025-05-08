const { terraformConfig } = require("terratest"); 
describe("Terraform Lifecycle Test", () => { 
  it("Validates create_before_destroy for critical resources", async () => { 
    const configPath = "../products/main.tf"; 
    try { 
      const plan = await terraformConfig.plan(configPath); 
      expect(plan).toContain("create_before_destroy"); 
      console.log("Test Passed: 'create_before_destroy' configuration validated."); 
    } catch (error) { 
      console.error("Error during 'create_before_destroy' validation:", error.message, error.stack); 
      throw error; 
    } 
  }); 
  it("Validates ignore_changes directives", async () => { 
    const configPath = "../products/main.tf"; 
    try { 
      const plan = await terraformConfig.plan(configPath); 
      expect(plan).toContain("ignore_changes"); 
      console.log("Test Passed: 'ignore_changes' configuration validated."); 
    } catch (error) { 
      console.error("Error during 'ignore_changes' validation:", error.message, error.stack); 
      throw error; 
    } 
  }); 
});