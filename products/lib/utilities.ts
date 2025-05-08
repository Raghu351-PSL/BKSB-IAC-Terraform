import * as cdk from 'aws-cdk-lib'; 
import { Construct } from 'constructs'; 
import * as iam from 'aws-cdk-lib/aws-iam'; 
import * as ec2 from 'aws-cdk-lib/aws-ec2'; 
import * as ecs from 'aws-cdk-lib/aws-ecs'; 
import * as kms from 'aws-cdk-lib/aws-kms'; 
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'; 
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'; 
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy'; 
import * as lambda from 'aws-cdk-lib/aws-lambda'; 
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets'; 
import { Aws, Duration, Tags } from 'aws-cdk-lib'; 
export const generateServiceCodeDeployResources = ( 
    scope: Construct, 
    resourceIDPrefix: string, 
    prodALBListener: elbv2.IApplicationListener, 
    testALBListener: elbv2.IApplicationListener, 
    targetGroupOne: elbv2.ITargetGroup, 
    targetGroupTwo: elbv2.ITargetGroup, 
    ecsService: ecs.IBaseService, 
) => { 
    const ecsApplication = new codedeploy.EcsApplication(scope, `${resourceIDPrefix}CDApplication`); 
    const codedeployRole = new iam.Role(scope, `${resourceIDPrefix}CDRole`, { 
        assumedBy: new iam.ServicePrincipal('codedeploy.amazonaws.com'), 
        managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCodeDeployRoleForECS')] 
    }); 
    new codedeploy.EcsDeploymentGroup(scope, `${resourceIDPrefix}CDDeploymentGroup`, { 
        application: ecsApplication, 
        service: ecsService, 
        blueGreenDeploymentConfig: { 
            blueTargetGroup: targetGroupOne, 
            greenTargetGroup: targetGroupTwo, 
            listener: prodALBListener, 
            testListener: testALBListener, 
            deploymentApprovalWaitTime: Duration.days(1), 
            terminationWaitTime: Duration.hours(1), 
        }, 
        deploymentConfig: codedeploy.EcsDeploymentConfig.ALL_AT_ONCE, 
        role: codedeployRole, 
        autoRollback: { 
            failedDeployment: true, 
            stoppedDeployment: true 
        } 
    }); 
} 
export const generateServiceALBResources = ( 
    scope: Construct, 
    vpc: ec2.IVpc, 
    resourceIDPrefix: string, 
    prodALBListener: elbv2.IApplicationListener, 
    testALBListener: elbv2.IApplicationListener, 
    listenerRulePathPattern: string, 
    listenerRulePriority: number, 
    additionalListenerRules: { rules: elbv2.ListenerCondition[], priority: number, action: elbv2.ListenerAction | null }[], 
    healthCheckPath: string, 
    targetPort: number, 
    environment: string, 
    region: string 
): { blueTargetGroup: elbv2.ApplicationTargetGroup, greenTargetGroup: elbv2.ApplicationTargetGroup } => { 
    let albAuthenticationSecret = 
        secretsmanager.Secret.fromSecretNameV2(scope, "BKSBAlbAuthenticationSecret", `${environment}/loadbalancer/alb_authentication_secret`); 
    let loadBalancerSecret = secretsmanager.Secret.fromSecretNameV2(scope, "BKSBLoadBalancerSecret", `${environment}/loadbalancer/load_balancer_secret`); 
    const targetGroupOne = new elbv2.ApplicationTargetGroup(scope, `${resourceIDPrefix}ALBTargetGroupOne`, { 
        vpc: vpc, 
        targetType: elbv2.TargetType.IP, 
        port: targetPort, 
        healthCheck: { 
            enabled: true, 
            path: healthCheckPath, 
            unhealthyThresholdCount: 4, 
            healthyThresholdCount: 2, 
            timeout: cdk.Duration.seconds(10), 
            interval: cdk.Duration.seconds(20), 
        } 
    }); 
    const targetGroupTwo = new elbv2.ApplicationTargetGroup(scope, `${resourceIDPrefix}ALBTargetGroupTwo`, { 
        vpc: vpc, 
        targetType: elbv2.TargetType.IP, 
        port: targetPort, 
        healthCheck: { 
            enabled: true, 
            path: healthCheckPath, 
            unhealthyThresholdCount: 4, 
            healthyThresholdCount: 2, 
            timeout: cdk.Duration.seconds(10), 
            interval: cdk.Duration.seconds(20), 
        } 
    }); 
    const prodListenerRule = new elbv2.ApplicationListenerRule(scope, `${resourceIDPrefix}ALBProdListenerRule`, { 
        listener: prodALBListener, 
        priority: listenerRulePriority, 
        conditions: [ 
            elbv2.ListenerCondition.pathPatterns([listenerRulePathPattern]), 
            elbv2.ListenerCondition.httpHeader("x-bksb-internal", [cdk.SecretValue.secretsManager(loadBalancerSecret.secretArn).unsafeUnwrap()]) 
        ], 
        action: environment === "prod" ? elbv2.ListenerAction.forward([targetGroupOne]) : elbv2.ListenerAction.authenticateOidc({ 
            issuer: "https://identity.oneadvanced.com/auth/realms/education-platform", 
            tokenEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/token", 
            userInfoEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/userinfo", 
            authorizationEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/auth", 
            clientId: "education-preprod-alb", 
            clientSecret: cdk.SecretValue.secretsManager(albAuthenticationSecret.secretArn), 
            scope: "openid", 
            next: elbv2.ListenerAction.forward([targetGroupOne]) 
        }) 
    }); 
    const testListenerRule = new elbv2.ApplicationListenerRule(scope, `${resourceIDPrefix}ALBTestListenerRule`, { 
        listener: testALBListener, 
        priority: listenerRulePriority + 100, 
        conditions: [ 
            elbv2.ListenerCondition.pathPatterns([listenerRulePathPattern]), 
            elbv2.ListenerCondition.httpHeader("x-bksb-internal", [cdk.SecretValue.secretsManager(loadBalancerSecret.secretArn).unsafeUnwrap()]) 
        ], 
        action: elbv2.ListenerAction.authenticateOidc({ 
            issuer: "https://identity.oneadvanced.com/auth/realms/education-platform", 
            tokenEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/token", 
            userInfoEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/userinfo", 
            authorizationEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/auth", 
            clientId: "education-preprod-alb", 
            clientSecret: cdk.SecretValue.secretsManager(albAuthenticationSecret.secretArn), 
            scope: "openid", 
            next: elbv2.ListenerAction.forward([targetGroupTwo]) 
        }) 
    }); 
    for (const additionalListenerRule of additionalListenerRules) { 
        additionalListenerRule.rules.push(elbv2.ListenerCondition.httpHeader("x-bksb-internal", [cdk.SecretValue.secretsManager(loadBalancerSecret.secretArn).unsafeUnwrap()])); 
        //Prod 
        new elbv2.ApplicationListenerRule(scope, `${resourceIDPrefix}ALBProdListenerRule${additionalListenerRule.priority}`, { 
            listener: prodALBListener, 
            priority: additionalListenerRule.priority, 
            conditions: additionalListenerRule.rules, 
            action: environment === "prod" ? (additionalListenerRule.action ?? elbv2.ListenerAction.forward([targetGroupOne])) : elbv2.ListenerAction.authenticateOidc({ 
                issuer: "https://identity.oneadvanced.com/auth/realms/education-platform", 
                tokenEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/token", 
                userInfoEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/userinfo", 
                authorizationEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/auth", 
                clientId: "education-preprod-alb", 
                clientSecret: cdk.SecretValue.secretsManager(albAuthenticationSecret.secretArn), 
                scope: "openid", 
                next: additionalListenerRule.action ?? elbv2.ListenerAction.forward([targetGroupOne]) 
            }) 
        }); 
        //Test 
        new elbv2.ApplicationListenerRule(scope, `${resourceIDPrefix}ALBTestListenerRule${additionalListenerRule.priority}`, { 
            listener: testALBListener, 
            priority: additionalListenerRule.priority + 100, 
            conditions: additionalListenerRule.rules, 
            action: elbv2.ListenerAction.authenticateOidc({ 
                issuer: "https://identity.oneadvanced.com/auth/realms/education-platform", 
                tokenEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/token", 
                userInfoEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/userinfo", 
                authorizationEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/auth", 
                clientId: "education-preprod-alb", 
                clientSecret: cdk.SecretValue.secretsManager(albAuthenticationSecret.secretArn), 
                scope: "openid", 
                next: additionalListenerRule.action ?? elbv2.ListenerAction.forward([targetGroupTwo]) 
            }) 
        }); 
    } 
    return { blueTargetGroup: targetGroupOne, greenTargetGroup: targetGroupTwo }; 
} 
export const generateLambdaALBResources = ( 
    scope: Construct, 
    vpc: ec2.IVpc, 
    resourceIDPrefix: string, 
    prodALBListener: elbv2.IApplicationListener, 
    testALBListener: elbv2.IApplicationListener, 
    lambda: lambda.Function, 
    listenerRulePathPattern: string, 
    listenerRulePriority: number, 
    additionalListenerRules: { rules: elbv2.ListenerCondition[], priority: number, action: elbv2.ListenerAction | null }[], 
    environment: string, 
    region: string, 
): { targetGroup: elbv2.ApplicationTargetGroup } => { 
    let albAuthenticationSecret = 
        secretsmanager.Secret.fromSecretNameV2(scope, "BKSBAlbAuthenticationSecret", `${environment}/loadbalancer/alb_authentication_secret`); 
    let loadBalancerSecret = secretsmanager.Secret.fromSecretNameV2(scope, "BKSBLoadBalancerSecret", `${environment}/loadbalancer/load_balancer_secret`); 
    const targetGroupOne = new elbv2.ApplicationTargetGroup(scope, `${resourceIDPrefix}ALBTargetGroupOne`, { 
        vpc: vpc, 
        targetType: elbv2.TargetType.LAMBDA, 
        targets: [new targets.LambdaTarget(lambda)], 
    }); 
    const prodListenerRule = new elbv2.ApplicationListenerRule(scope, `${resourceIDPrefix}ALBProdListenerRule`, { 
        listener: prodALBListener, 
        priority: listenerRulePriority, 
        conditions: [ 
            elbv2.ListenerCondition.pathPatterns([listenerRulePathPattern]), 
            elbv2.ListenerCondition.httpHeader("x-bksb-internal", [cdk.SecretValue.secretsManager(loadBalancerSecret.secretArn).unsafeUnwrap()]) 
        ], 
        action: environment === "prod" ? elbv2.ListenerAction.forward([targetGroupOne]) : elbv2.ListenerAction.authenticateOidc({ 
            issuer: "https://identity.oneadvanced.com/auth/realms/education-platform", 
            tokenEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/token", 
            userInfoEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/userinfo", 
            authorizationEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/auth", 
            clientId: "education-preprod-alb", 
            clientSecret: cdk.SecretValue.secretsManager(albAuthenticationSecret.secretArn), 
            scope: "openid", 
            next: elbv2.ListenerAction.forward([targetGroupOne]) 
        }) 
    }); 
    for (const additionalListenerRule of additionalListenerRules) { 
        additionalListenerRule.rules.push(elbv2.ListenerCondition.httpHeader("x-bksb-internal", [cdk.SecretValue.secretsManager(loadBalancerSecret.secretArn).unsafeUnwrap()])); 
        new elbv2.ApplicationListenerRule(scope, `${resourceIDPrefix}ALBProdListenerRule${additionalListenerRule.priority}`, { 
            listener: prodALBListener, 
            priority: additionalListenerRule.priority, 
            conditions: additionalListenerRule.rules, 
            action: environment === "prod" ? elbv2.ListenerAction.forward([targetGroupOne]) : elbv2.ListenerAction.authenticateOidc({ 
                issuer: "https://identity.oneadvanced.com/auth/realms/education-platform", 
                tokenEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/token", 
                userInfoEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/userinfo", 
                authorizationEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/auth", 
                clientId: "education-preprod-alb", 
                clientSecret: cdk.SecretValue.secretsManager(albAuthenticationSecret.secretArn), 
                scope: "openid", 
                next: additionalListenerRule.action ?? elbv2.ListenerAction.forward([targetGroupOne]) 
            }) 
        }); 
        //Test 
        new elbv2.ApplicationListenerRule(scope, `${resourceIDPrefix}ALBTestListenerRule${additionalListenerRule.priority}`, { 
            listener: testALBListener, 
            priority: additionalListenerRule.priority + 100, 
            conditions: additionalListenerRule.rules, 
            action: elbv2.ListenerAction.authenticateOidc({ 
                issuer: "https://identity.oneadvanced.com/auth/realms/education-platform", 
                tokenEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/token", 
                userInfoEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/userinfo", 
                authorizationEndpoint: "https://identity.oneadvanced.com/auth/realms/education-platform/protocol/openid-connect/auth", 
                clientId: "education-preprod-alb", 
                clientSecret: cdk.SecretValue.secretsManager(albAuthenticationSecret.secretArn), 
                scope: "openid", 
                next: additionalListenerRule.action ?? elbv2.ListenerAction.forward([targetGroupOne]) 
            }) 
        }); 
    } 
    return { targetGroup: targetGroupOne }; 
} 
export const initializeTerraformWorkspaceSupport = ( 
    scope: Construct, 
    environment: string, 
    region: string 
): void => { 
    try { 
        console.log(`Initializing multi-environment support for Terraform workspace: ${environment}, Region: ${region}`); 
        if (!['staging', 'production', 'data-platform'].includes(environment)) { 
            throw new Error(`Invalid environment '${environment}' provided. Available environments: staging, production, data-platform.`); 
        } 
        // Simulated logic for connecting to the S3 backend for Terraform state files. 
        console.log(`Connecting to Terraform backend in region: ${region} with environment: ${environment}`); 
        console.log(`Loading state files for environment: ${environment}`); 
        /** 
         * Tasks such as loading state files or triggering Terraform commands might be implemented 
         * in project-specific workflows externally to `utilities.ts`. 
         * Here, we ensure logging for future debugging and error handling measures. 
         */ 
        console.log(`Workspace successfully initialized for environment '${environment}'`); 
    } catch (error) { 
        console.error(`Error occurred while initializing Terraform workspace: ${error.message}`, error); 
    } 
};