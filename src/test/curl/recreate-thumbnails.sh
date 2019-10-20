#!/bin/bash

BASE_URL="http://localhost:8080"
#BASE_URL="http://dms1.eu-central-1.elasticbeanstalk.com"

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <sys-user> <sys-password> "
  exit 1
fi

LOGIN="${1}"
PASSWORD="${2}"

token=$(curl "${BASE_URL}/api/authenticate" --silent \
  --header 'Accept: application/json' --header 'Content-Type: application/json' \
  --data "{\"username\":\"${LOGIN}\",\"password\":\"${PASSWORD}\"}" | jq -r ".id_token")

CURL_STATUS=$?
if [[ $CURL_STATUS -eq 7 ]]; then
  echo "Error: curl status = Cannot connect to $BASE_URL"
  exit 1
elif [[ $CURL_STATUS -ne 0 ]]; then
  echo "Error: curl status = $CURL_STATUS"
  exit 1
fi

if [[ ${token} == "" ]]; then
  echo "TOKEN-BASED LOGIN FAILED!"
  exit 1
fi

echo "LOGIN with token \"${token}\" successful."

## ---

HTTP_RESPONSE=$(curl "${BASE_URL}/api/maintenance/thumbnails" --request GET \
--silent --write-out "HTTPSTATUS:%{http_code}" \
--header 'Accept: application/json' \
--header "Authorization: Bearer ${token}"
)
HTTP_BODY=$(echo "${HTTP_RESPONSE}" | sed -e 's/HTTPSTATUS\:.*//g')
HTTP_STATUS=$(echo "${HTTP_RESPONSE}" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ ! ${HTTP_STATUS:0:1} -eq 2 ]]; then
echo "Error: HTTP status = $HTTP_STATUS"
exit 1
fi

echo "${HTTP_BODY}"

