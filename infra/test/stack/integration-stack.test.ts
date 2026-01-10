import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { IntegrationStack } from '../../lib/stack/integration/integration-stack';
import { testConfig } from '../test-config';

describe('IntegrationStack', () => {
  let app: cdk.App;
  let stack: IntegrationStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();
    stack = new IntegrationStack(
      app,
      'TestIntegrationStack',
      testConfig,
      {
        env: {
          account: '123456789012',
          region: 'ap-northeast-1',
        },
      }
    );
    template = Template.fromStack(stack);
  });

  describe('SNS Topic', () => {
    it('should create an SNS topic', () => {
      template.resourceCountIs('AWS::SNS::Topic', 1);
    });

    it('should have correct display name', () => {
      template.hasResourceProperties('AWS::SNS::Topic', {
        DisplayName: `${testConfig.envName}-${testConfig.tags.Project}-topic`,
      });
    });
  });

  describe('SQS Queue', () => {
    it('should create main SQS queue and DLQ', () => {
      template.resourceCountIs('AWS::SQS::Queue', 2); // Main queue + DLQ
    });

    it('should have visibility timeout configured', () => {
      // Default visibility timeout is 30 seconds
      template.hasResourceProperties('AWS::SQS::Queue', {
        VisibilityTimeout: 30,
      });
    });

    it('should have retention period configured', () => {
      template.hasResourceProperties('AWS::SQS::Queue', {
        MessageRetentionPeriod: 1209600, // 14 days
      });
    });
  });

  describe('Dead Letter Queue', () => {
    it('should configure main queue to use DLQ', () => {
      template.hasResourceProperties('AWS::SQS::Queue', {
        RedrivePolicy: {
          deadLetterTargetArn: {
            'Fn::GetAtt': Match.anyValue(),
          },
          maxReceiveCount: 3,
        },
      });
    });
  });

  describe('SNS to SQS Subscription', () => {
    it('should subscribe SQS to SNS', () => {
      template.resourceCountIs('AWS::SNS::Subscription', 1);
    });

    it('should use SQS protocol', () => {
      template.hasResourceProperties('AWS::SNS::Subscription', {
        Protocol: 'sqs',
      });
    });
  });

  describe('Queue Policy', () => {
    it('should create a queue policy', () => {
      template.resourceCountIs('AWS::SQS::QueuePolicy', 1);
    });

    it('should allow SNS to send messages', () => {
      template.hasResourceProperties('AWS::SQS::QueuePolicy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'sqs:SendMessage',
              Effect: 'Allow',
              Principal: {
                Service: 'sns.amazonaws.com',
              },
            },
          ],
        },
      });
    });
  });

  describe('Outputs', () => {
    it('should export Topic ARN', () => {
      const outputs = template.findOutputs('*');
      expect(Object.keys(outputs)).toContain('TopicArn');
    });

    it('should export Queue URL', () => {
      const outputs = template.findOutputs('*');
      expect(Object.keys(outputs)).toContain('QueueUrl');
    });

    it('should export DLQ URL', () => {
      const outputs = template.findOutputs('*');
      expect(Object.keys(outputs)).toContain('DlqUrl');
    });
  });

  describe('Stack Properties', () => {
    it('should synthesize successfully', () => {
      expect(() => app.synth()).not.toThrow();
    });
  });
});
