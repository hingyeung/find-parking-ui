import * as cdk from '@aws-cdk/core';
import SinglePageAppHosting from './single-page-app-hosting';
import {HostedZone} from '@aws-cdk/aws-route53';

export interface S3WebhostingStackProps extends cdk.StackProps {
  CDK_DOMAIN_NAME: string;
  CDK_AWS_ROUTE53_HOSTED_ZONE_NAME: string;
  CDK_AWS_BUCKET_NAME: string;
}

export class S3WebhostingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: S3WebhostingStackProps) {
    super(scope, id, props);

    // https://docs.aws.amazon.com/cdk/latest/guide/get_context_var.html
    // https://stackoverflow.com/questions/58138536/how-to-specify-parameter-definition-in-cdk-stack
    // Context can be set using "-c"
    // e.g. cdk synth -c bucket_name=mygroovybucket
    // const sourceBucketName = this.node.tryGetContext("bucket_name") || "";
    // const domainName = this.node.tryGetContext("domain_name") || "";
    // const hostedZone = this.node.tryGetContext("hosted_zone") || "";
    const sourceBucketName = props.CDK_AWS_BUCKET_NAME;
    const domainName = props.CDK_DOMAIN_NAME;
    const hostedZone = props.CDK_AWS_ROUTE53_HOSTED_ZONE_NAME;

    new SinglePageAppHosting(this, 'SinglePageAppHosting', {
      domainName: domainName,
      bucketName: sourceBucketName,
      hostedZone: HostedZone.fromLookup(this, 'HostedZone', {
        domainName: hostedZone
      })
    });
  }
}