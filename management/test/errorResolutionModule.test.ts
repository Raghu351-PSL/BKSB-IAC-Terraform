import { ErrorResolutionModule } from '../lib/errorResolutionModule'; 
describe('ErrorResolutionModule Tests', () => { 
  it('should validate configuration and resolve errors', () => { 
    const errorResolution = new ErrorResolutionModule({ 
      inputFilePath: './test/terraform-config.test', 
      outputFilePath: './test/terraform-fixed-config.test', 
      autoResolve: true, 
    }); 
    expect(() => errorResolution.validateConfiguration()).not.toThrow(); 
  }); 
  it('should throw an error for empty configuration files', () => { 
    const errorResolution = new ErrorResolutionModule({ 
      inputFilePath: './test/empty-config.test', 
      outputFilePath: './test/terraform-fixed-config.test', 
      autoResolve: false, 
    }); 
    try { 
      errorResolution.validateConfiguration(); 
    } catch (error) { 
      expect(error.message).toBe('Terraform configuration file is empty.'); 
    } 
  }); 
  it('should log validation errors correctly', () => { 
    const errorResolution = new ErrorResolutionModule({ 
      inputFilePath: './test/invalid-terraform-config.test', 
      outputFilePath: './test/terraform-fixed-config.test', 
      autoResolve: false, 
    }); 
    const consoleSpy = jest.spyOn(console, 'log'); 
    errorResolution.validateConfiguration(); 
    expect(consoleSpy).toHaveBeenCalledWith( 
      expect.stringContaining('Invalid resource path') 
    ); 
    consoleSpy.mockRestore(); 
  }); 
  it('should auto-resolve errors when enabled', () => { 
    const errorResolution = new ErrorResolutionModule({ 
      inputFilePath: './test/terraform-config.test', 
      outputFilePath: './test/terraform-fixed-config.test', 
      autoResolve: true, 
    }); 
    const consoleSpy = jest.spyOn(console, 'log'); 
    errorResolution.validateConfiguration(); 
    expect(consoleSpy).toHaveBeenCalledWith( 
      expect.stringContaining('Resolved error:') 
    ); 
    consoleSpy.mockRestore(); 
  }); 
  it('should handle unexpected errors gracefully', () => { 
    const errorResolution = new ErrorResolutionModule({ 
      inputFilePath: './test/nonexistent-file.test', 
      outputFilePath: './test/terraform-fixed-config.test', 
      autoResolve: false, 
    }); 
    const consoleSpy = jest.spyOn(console, 'error'); 
    try { 
      errorResolution.validateConfiguration(); 
    } catch (error) { 
      expect(consoleSpy).toHaveBeenCalledWith( 
        expect.stringContaining('Error during validation:') 
      ); 
    } 
    consoleSpy.mockRestore(); 
  }); 
  it('should log the validation process comprehensively', () => { 
    const errorResolution = new ErrorResolutionModule({ 
      inputFilePath: './test/terraform-config.test', 
      outputFilePath: './test/terraform-fixed-config.test', 
      autoResolve: false, 
    }); 
    const consoleSpy = jest.spyOn(console, 'log'); 
    errorResolution.validateConfiguration(); 
    expect(consoleSpy).toHaveBeenCalledWith( 
      expect.stringContaining('Validating Terraform configuration...') 
    ); 
    expect(consoleSpy).toHaveBeenCalledWith( 
      expect.stringContaining('Terraform configuration is valid.') 
    ); 
    consoleSpy.mockRestore(); 
  }); 
});