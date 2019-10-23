# Object Storage based on Postgres and S3

This Spring Boot application show how documents and images can be managed using a combination of
a relational database (e.g. PostgreSQL) and a S3 object storage (AWS S3, Minio), where the S3 storage
is directly exposed as a tier-2 system.

All the logic (e.g. authorization) is held in a relational database (tier 3) and served by a tier 2 Spring Boot
REST service. The S3 storage is used directly by the clients (browser) using **pre-signed URLs**.

## The application

Screenshot of the application's user interface

![User-Interface](docs/images/screenshot-of-user-interface.png) 

## Architecture

Flow for upoad of documents:

![Upload Flow](docs/images/Using-S3-Right-Upload.svg) 

1. Client sends meta-data of document to application service (POST)
   and saves it to the application's database
2. Client receives pre-signed URL to write document content (PUT)
3. Client uses PUT to upload document content to S3 object storage
4. Client receives HTTP 200 on success
5. Object Storage publishes PUT event (`s3:ObjectCreated:Put`) via
   - AQMP, Kafka, WebHooks, ... in case of using private minio or Ceph
   - SQS, Lambda (in case of using public AWS S3)
6. Application service
   - receives PUT event
   - finalizes meta data (content length, mime type, ...) to database
   - creates a thumbnail (not shown in diagram)
   - and sends "ready" event back to client using WebSocket/STOMP
   
## Local Setup with Minio

The default setting

- assumes minio runs on port `9999`
- is using a bucket names `bucket-001`
- uses `minio-local` as an alias
- uses *WebHook* for bucket event notification

```
# Config the server's alias
> ./mc config host add minio-local http://192.168.178.48:9999 minio miniosecret S3V4
# Check minio content
> ./mc ls minio-local
# Remove the bucket, if it exists
> ./mc rb minio-local/bucket-01 --force
# Create bucket
> ./mc mb minio-local/bucket-01 --region default

# Export config
> ./mc admin config get minio-local/ > myconfig.json

# Add/Replace webhook
> vi myconfig.json
"webhook":{"1":{"enable":true,"endpoint":"http://localhost:8080/event-api/s3/","queueDir":"","queueLimit":0}}}

# Import config
./mc admin config set minio-local/ < myconfig.json

# Restart server
./mc admin service restart minio-local/
# Will show
AccessKey: minio 
SecretKey: miniosecret 
Region:    default
SQS ARNs:  arn:minio:sqs:default:1:webhook

# Add event filter/config
./mc event add minio-local/bucket-01 arn:minio:sqs:default:1:webhook --event put
Successfully added arn:minio:sqs:default:1:webhook

# Check events
./mc event list minio-local/bucket-01
arn:minio:sqs:default:1:webhook   s3:ObjectCreated:*   Filter:

# Remove event
./mc event remove minio-local/bucket-01 arn:minio:sqs:default:1:webhook

```




