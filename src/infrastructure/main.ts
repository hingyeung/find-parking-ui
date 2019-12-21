#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { S3WebhostingStack, S3WebhostingStackProps } from './s3-webhosting-stack';
import * as dotenv from 'dotenv';
import * as S3 from 'aws-sdk/clients/s3';

const STACK_NAME_PREFIX = "find-parking-ui";
const stackEnv = process.env.CDK_STACK_ENV;
const stackNameSuffix = process.env.CDK_STACK_NAME_SUFFIX;
const dotEnvConfig = dotenv.config({path: `.env.infra-${stackEnv}`});
const envConfig = { ...dotEnvConfig.parsed} as S3WebhostingStackProps;
if (dotEnvConfig.error) {
  console.error(dotEnvConfig.error);
  process.exit(1);
}

if (!stackEnv || !stackNameSuffix) {
  console.error(`CDK_STACK_ENV and CDK_STACK_NAME_SUFFIX environment variables must be set.`)
  process.exit(1);
} else {
  const fullStackName = `${STACK_NAME_PREFIX}-${stackNameSuffix}`
  const app = new cdk.App();
  new S3WebhostingStack(app, fullStackName, {
    ...envConfig,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT, 
      region: process.env.CDK_DEFAULT_REGION
    }
  });
}
