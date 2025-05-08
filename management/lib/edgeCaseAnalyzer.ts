export class EdgeCaseAnalyzer { 
  public static validateCircularDependencies(config: any): boolean { 
    console.log('Validating circular dependencies...'); 
    try { 
      const hasCircularDependencies = config.resources.some((resource: any) => 
        resource.dependencies.includes(resource.id) 
      ); 
      if (hasCircularDependencies) { 
        console.log('Circular dependencies detected!'); 
      } else { 
        console.log('No circular dependencies found.'); 
      } 
      return !hasCircularDependencies; 
    } catch (error) { 
      console.error('Error during circular dependencies validation:', error); 
      throw new Error('Failed to validate circular dependencies.'); 
    } 
  } 
  public static validateForbiddenResourceChanges(plan: string): boolean { 
    console.log('Checking Terraform plan for forbidden resource changes...'); 
    try { 
      const forbiddenChangesDetected = plan.includes('FORBIDDEN'); 
      if (forbiddenChangesDetected) { 
        console.log('Forbidden resource changes detected in plan!'); 
      } else { 
        console.log('No forbidden resource changes detected.'); 
      } 
      return !forbiddenChangesDetected; 
    } catch (error) { 
      console.error('Error during resource changes validation:', error); 
      throw new Error('Failed to validate forbidden resource changes.'); 
    } 
  } 
  public static performAdvancedEdgeCaseAnalysis(config: any): boolean { 
    console.log('Performing advanced edge-case analysis...'); 
    try { 
      const edgeCaseHandlers = [ 
        () => EdgeCaseAnalyzer.validateCircularDependencies(config), 
        () => EdgeCaseAnalyzer.validateForbiddenResourceChanges(config.plan), 
      ]; 
      const results = edgeCaseHandlers.map((handler) => handler()); 
      const allChecksPassed = results.every((result) => result); 
      console.log(`Edge case analysis result: ${allChecksPassed ? 'All checks passed' : 'Issues found'}`); 
      return allChecksPassed; 
    } catch (error) { 
      console.error('Error during advanced edge-case analysis:', error); 
      throw new Error('Failed to perform advanced edge-case analysis.'); 
    } 
  } 
}