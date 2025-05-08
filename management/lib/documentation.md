## Error Resolution Module 
This module validates Terraform configurations and resolves lifecycle conflicts interactively or automatically based on user preferences. 
### Usage 
1. Import the module: 
   ```typescript 
   import { ErrorResolutionModule } from './lib/errorResolutionModule'; 
   ``` 
2. Initialize the module: 
   ```typescript 
   const errorResolution = new ErrorResolutionModule({ 
       inputFilePath: './terraform-config.tf', 
       outputFilePath: './terraform-fixed-config.tf', 
       autoResolve: true 
   }); 
   ``` 
3. Run validation: 
   ```typescript 
   errorResolution.validateConfiguration(); 
   ``` 
--- 
## Edge Case Handler Module 
Handles specific edge cases like circular dependencies or validation warnings. 
### Usage 
1. Import the module: 
   ```typescript 
   import { EdgeCaseHandler } from './lib/edgeCaseHandler'; 
   ``` 
2. Resolve circular dependencies: 
   ```typescript 
   const edgeCaseHandler = new EdgeCaseHandler({ enableWarnings: true }); 
   edgeCaseHandler.resolveCircularDependencies(); 
   edgeCaseHandler.handleValidationWarnings(); 
   ``` 