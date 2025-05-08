import { TerraformTestRunner } from '../lib/terraformTestRunner'; 
describe('TerraformTestRunner', () => { 
  const validConfigPath = './terraform-config'; // Example relative path to Terraform configuration folder 
  let testRunner: TerraformTestRunner; 
  beforeAll(() => { 
    testRunner = new TerraformTestRunner(validConfigPath); 
  }); 
  test('should successfully initialize Terraform', async () => { 
    await expect(testRunner.runTerraformInit()).resolves.not.toThrow(); 
  }); 
  test('should validate the Terraform configuration successfully', async () => { 
    await expect(testRunner.runTerraformValidate()).resolves.not.toThrow(); 
  }); 
  test('should run Terraform plan without errors', async () => { 
    await expect(testRunner.runTerraformPlan()).resolves.not.toThrow(); 
  }); 
  test('should handle edge case analysis without errors', async () => { 
    await expect(testRunner.runEdgeCaseAnalysis()).resolves.not.toThrow(); 
  }); 
  test('should throw error on invalid config path initialization', () => { 
    expect(() => new TerraformTestRunner('./invalid-path')).toThrowError(/Configuration file .* not found./); 
  }); 
}); 