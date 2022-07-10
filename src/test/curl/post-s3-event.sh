#!/bin/bash

# Simulate a S3 minio web hook

if [[ "${BASE_URL}" == "" ]]; then
  echo "BASE_URL not set! Use, e.g."
  echo "export BASE_URL=\"http://localhost:8080\""
  exit 1
fi

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <json-file>"
  echo " e.g.: $0 sample-s3-event.json"
  exit 1
fi

file="$1"

curl "${BASE_URL}/event-api/s3" \
  --verbose \
  --request POST \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data "@${file}"

