#!/bin/bash

SRC=../oms-application
TARGET=.

cp "$TARGET/README.md" "$TARGET/README-JHipster.md"

for file in \
    README.md \
    jhipster-jdl.jh \
    src/main/java/com/giraone/oms/config/S3Configuration.java \
    src/main/java/com/giraone/oms/config/SecurityConfiguration.java \
    src/main/java/com/giraone/oms/repository/UserRepository.java \
    src/main/java/com/giraone/oms/service/UserService.java
do
    cp "$SRC/$file" "$TARGET/$file"
done

for dir in \
    docs \
    src/main/java/com/giraone/oms/service/s3 \
    src/main/java/com/giraone/oms/service/util \
    src/main/java/com/giraone/oms/web/websocket \
    src/main/webapp/app/documents
do
    cp -r "$SRC/$dir" "$TARGET/$dir"
done
