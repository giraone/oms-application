#!/bin/bash

#BASE_URL="http://localhost:8080"
BASE_URL="http://tonotracker1.eu-central-1.elasticbeanstalk.com"

HTTP_RESPONSE=$(curl "${BASE_URL}/management/reset-liquibase-lock" --request GET \
  --silent --write-out "HTTPSTATUS:%{http_code}" \
  --header 'Accept: application/json'
)

CURL_STATUS=$?
if [[ $CURL_STATUS -eq 7 ]]; then
  echo "Error: curl status = Cannot connect to $BASE_URL"
  exit 1
elif [[ $CURL_STATUS -ne 0 ]]; then
  echo "Error: curl status = $CURL_STATUS"
  exit 1
fi

HTTP_BODY=$(echo "${HTTP_RESPONSE}" | sed -e 's/HTTPSTATUS\:.*//g')
HTTP_STATUS=$(echo "${HTTP_RESPONSE}" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ ! ${HTTP_STATUS:0:1} -eq 2 ]]; then
  echo "Error: HTTP status = $HTTP_STATUS"
  exit 1
fi

echo "${HTTP_BODY}"

