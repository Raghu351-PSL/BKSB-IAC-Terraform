import * as cdk from 'aws-cdk-lib'; 
export class TestStack extends cdk.Stack { 
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) { 
    super(scope, id, props); 
    // Mock resource 
    new cdk.CfnResource(this, 'TestResource', { 
      type: 'AWS::Mock::Resource', 
    }); 
    // Adding logs to indicate resource creation for debugging 
    console.log('TestResource in TestStack created with type AWS::Mock::Resource.'); 
  } 
}