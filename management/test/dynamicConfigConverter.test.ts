import { DynamicConfigConverter } from '../lib/dynamicConfigConverter'; 
describe('DynamicConfigConverter', () => { 
  it('should convert loops into `for_each` correctly', () => { 
    const inputConfig = { 
      resources: { 
        resource_1: { key: 'value1' }, 
        resource_2: { key: 'value2' }, 
      }, 
    }; 
    const expectedOutput = { 
      resources: { 
        for_each: [ 
          { key: 'resource_1', value: { key: 'value1' } }, 
          { key: 'resource_2', value: { key: 'value2' } }, 
        ], 
      }, 
    }; 
    const result = DynamicConfigConverter.convertLoops(inputConfig); 
    expect(result).toEqual(expectedOutput); 
  }); 
  it('should convert conditionals into Terraform-compatible syntax', () => { 
    const inputConfig = { 
      resource_a: { key: 'valueA' }, 
    }; 
    const condition = true; 
    const expectedOutput = { 
      resource_a: { 
        count: 1, 
        key: 'valueA', 
      }, 
    }; 
    const result = DynamicConfigConverter.convertConditionals(inputConfig, condition); 
    expect(result).toEqual(expectedOutput); 
  }); 
  it('should throw an error for invalid loops configuration', () => { 
    const invalidConfig = { 
      resources: null, 
    }; 
    expect(() => DynamicConfigConverter.convertLoops(invalidConfig)).toThrowError( 
      'Invalid imperative configuration provided' 
    ); 
  }); 
  it('should throw an error for invalid conditionals configuration', () => { 
    const invalidConfig = { 
      resources: "invalid_data_type", 
    }; 
    expect(() => DynamicConfigConverter.convertConditionals(invalidConfig, true)).toThrowError( 
      'Invalid imperative configuration provided' 
    ); 
  }); 
  it('should write converted configuration to file successfully', () => { 
    const validConfig = { 
      resources: { 
        resource_1: { key: 'value1' }, 
        resource_2: { key: 'value2' }, 
      }, 
    }; 
    const outputFilePath = 'output/terraformConfig.json'; 
    expect(() => 
      DynamicConfigConverter.writeToFile(validConfig, outputFilePath) 
    ).not.toThrow(); 
    const fs = require('fs'); 
    let writtenContent; 
    try { 
      writtenContent = fs.readFileSync(outputFilePath, 'utf8'); 
    } catch (error) { 
      // Ensure the error is fully logged for debugging purposes 
      console.error('Error reading file:', error.message, error.stack); 
      throw error; 
    } 
    const expectedWrittenContent = JSON.stringify(validConfig, null, 2); 
    expect(writtenContent).toEqual(expectedWrittenContent); 
  }); 
});