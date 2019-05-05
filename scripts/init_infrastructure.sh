#!/usr/bin/env bash
set -e

HOSTED_ZONE=$1
FQDN=$2
ACM_CERT_ARN=$3

aws cloudformation deploy \
  --stack-name find-parking-ui-dev \
  --template-file scripts/find-parking-ui-cf.yaml \
  --parameter-overrides \
    HostedZoneName=${HOSTED_ZONE} \
    FullDomainName=${FQDN} \
    AcmCertificateArn=${ACM_CERT_ARN}
