#!/usr/bin/env bash
set -e

BUCKET=$1

realpath() {
    [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}

WHEREAMI=$(dirname $(realpath "$0"))
PROJECT_ROOT=${WHEREAMI}/..

aws s3 sync ${PROJECT_ROOT}/build/ s3://${BUCKET}/
aws s3 cp s3://${BUCKET}/index.html s3://${BUCKET}/index.html --metadata-directive REPLACE --cache-control max-age=0