import { MigrationInterface } from '../lib/migration-interface'; 
import * as cdk from 'aws-cdk-lib'; 
import { TestStack } from './util/test-stack'; 
describe('MigrationInterface', () => { 
  let app: cdk.App; 
  let migrationInterface: MigrationInterface; 
  beforeEach(() => { 
    app = new cdk.App(); 
    migrationInterface = new MigrationInterface(app); 
  }); 
  it('should correctly analyze stacks and resources', () => { 
    // Set up mock stacks 
    new TestStack(app, 'TestStack1'); 
    new TestStack(app, 'TestStack2'); 
    // Spy on console.log to capture output 
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(); 
    // Perform analysis 
    migrationInterface.analyzeAppStructure(); 
    // Assert that stacks and resources are printed 
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('TestStack1')); 
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('TestStack2')); 
    consoleSpy.mockRestore(); 
  }); 
  it('should log errors gracefully if analysis fails', () => { 
    // Mock a failure during analysis 
    jest.spyOn(app, 'synth').mockImplementation(() => { 
      throw new Error('Synthetic failure for testing purposes'); 
    }); 
    // Spy on console.log and console.error 
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(); 
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(); 
    // Perform analysis 
    expect(() => migrationInterface.analyzeAppStructure()).not.toThrow(); 
    // Assert that error was logged 
    expect(consoleErrorSpy).toHaveBeenCalledWith( 
      expect.stringContaining('Error during app analysis:') 
    ); 
    expect(consoleErrorSpy).toHaveBeenCalledWith( 
      expect.stringContaining('Synthetic failure for testing purposes') 
    ); 
    // Cleanup spies 
    consoleLogSpy.mockRestore(); 
    consoleErrorSpy.mockRestore(); 
  }); 
  it('should handle stacks with no resources gracefully', () => { 
    // Create a stack with no resources 
    new cdk.Stack(app, 'EmptyStack'); 
    // Spy on console.log to capture output 
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(); 
    // Perform analysis 
    migrationInterface.analyzeAppStructure(); 
    // Assert that the stack name is printed 
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('EmptyStack')); 
    // Assert that the resources section notes an absence of resources 
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Resources:')); 
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('None found')); 
    // Cleanup spy 
    consoleSpy.mockRestore(); 
  }); 
});