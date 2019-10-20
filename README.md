# Object Storage based on Postgres and S3

This Spring Boot application show how documents and images can bei managed using a combination of
a relational database (e.g. PostgreSQL) and a S3 object storage (AWS S3, Minio), where the S3 storage
is directly exposed as a tier-2 system.

All the logic (e.g. authorization) is held in a relational database (tier 3) and served by a tier 2 spring boot
REST service. The S3 storage is used directly by the clients (browser) using **pre-signed URLs**.
