import { ServiceRefactoringAssistant } from '../lib/serviceRefactoringAssistant'; 
describe('ServiceRefactoringAssistant', () => { 
  const mockResources = { 
    resource1: { aws_type: 'ec2', iam_role: 'role1', inline_policies: ['policyA'] }, 
    resource2: { aws_type: 's3', iam_role: null }, 
  }; 
  const mockTags = { 
    team: 'DevOps', 
    project: 'Migration', 
  }; 
  const mockIAMPolicies = { 
    role1: ['policy1', 'policy2'], 
  }; 
  it('should refactor AWS constructs to Terraform equivalents', () => { 
    const assistant = new ServiceRefactoringAssistant(mockResources, mockTags, mockIAMPolicies); 
    const refactoredResources = assistant.refactorResources(); 
    // Validate refactored resources 
    expect(refactoredResources.resource1).toEqual({ 
      aws_type: 'ec2', 
      terraform_type: 'aws_instance', 
      iam_role: 'role1', 
      inline_policies: ['policyA'], 
      tags: mockTags, 
      iam_configuration: { 
        attached_policies: ['policy1', 'policy2'], 
        inline_policies: ['policyA'], 
      }, 
    }); 
    expect(refactoredResources.resource2).toEqual({ 
      aws_type: 's3', 
      terraform_type: 'aws_s3_bucket', 
      iam_role: null, 
      tags: mockTags, 
      iam_configuration: {}, 
    }); 
  }); 
  it('should save refactored resources to file', () => { 
    const assistant = new ServiceRefactoringAssistant(mockResources, mockTags, mockIAMPolicies); 
    const mockOutputPath = './testRefactoredResources.json'; 
    // Save the resources to a file 
    assistant.saveRefactoredResources(mockOutputPath); 
    // Mock read file 
    const fs = require('fs'); 
    const savedFileContent = JSON.parse(fs.readFileSync(mockOutputPath, 'utf8')); 
    expect(savedFileContent).toHaveProperty('resource1'); 
    expect(savedFileContent['resource1']).toMatchObject({ 
      terraform_type: 'aws_instance', 
      tags: mockTags, 
    }); 
    // Clean up the test file 
    fs.unlinkSync(mockOutputPath); 
  }); 
}); 