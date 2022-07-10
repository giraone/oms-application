#!/bin/bash

# Proxy an event to a web socket

if [[ "${BASE_URL}" == "" ]]; then
  echo "BASE_URL not set! Use, e.g."
  echo "export BASE_URL=\"http://localhost:8080\""
  exit 1
fi

if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <topic> <userLogin> <jsonData>"
  echo " e.g.: $0 s3-event admin \"{\\\"command\\\": \\\"reloadThumbnail\\\", \\\"argument\\\": \\\"1\\\"}\""
  echo " e.g.: $0 tracker ALL \"{\\\"sessionId\\\": \\\"o1g4u5et\\\", \\\"userLogin\\\": \\\"user\\\", \\\"ipAddress\\\": \\\"/127:0.0.1:55787\\\", \\\"page\\\": \\\"/\\\",\\\"time\\\": \\\"2022-07-10T17:00:31.574831300Z\\\"}\""
  exit 1
fi

topic="$1"
userLogin="$2"
jsonData="$3"

curl "${BASE_URL}/event-api/proxy/${topic}/${userLogin}" \
  --silent --write-out "\r\nHTTPSTATUS:%{http_code}" \
  --request POST \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data "${jsonData}"

