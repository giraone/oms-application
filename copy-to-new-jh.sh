#!/bin/bash

# Strategy:
# - Create new JHipster project using jhipster-jdl.jh named oms-application-jh
# - Copy oms-application-jh to oms-application-new
# - Copy oms-application/copy-to-new.sh to oms-application-new/copy-to-new.sh
# - Run oms-application-new/copy-to-new.sh
# - Keep oms-application-new/.git and check changes
# - Copy oms-application/.git to oms-application-new/.git and check changes

SRC=../oms-application
TARGET=.

cp "$TARGET/README.md" "$TARGET/README-JHipster.md"

for file in \
    README.md \
    jhipster-jdl.jh \
    pom.xml \
	src/main/java/com/giraone/oms/config/Constants.java \
	src/main/java/com/giraone/oms/config/ApplicationProperties.java \
	src/main/java/com/giraone/oms/config/CacheConfiguration.java \
    src/main/java/com/giraone/oms/config/S3Configuration.java \
    src/main/java/com/giraone/oms/config/SecurityConfiguration.java \
	src/main/java/com/giraone/oms/config/WebSocketConfiguration.java \
    src/main/java/com/giraone/oms/repository/UserRepository.java \
    src/main/java/com/giraone/oms/service/UserService.java \
	src/main/java/com/giraone/oms/repository/DocumentObjectRepository.java \
    src/main/java/com/giraone/oms/service/DocumentObjectService.java \
    src/main/java/com/giraone/oms/service/impl/DocumentObjectServiceImpl.java \
    src/main/java/com/giraone/oms/service/dto/DocumentObjectDTO.java \
    src/main/java/com/giraone/oms/service/dto/DocumentObjectWriteDTO.java \
    src/main/java/com/giraone/oms/service/mapper/DocumentObjectMapper.java \
    src/main/java/com/giraone/oms/web/rest/WebHooksResource.java \
	src/main/java/com/giraone/oms/web/rest/DocumentObjectResource.java \
	src/main/java/com/giraone/oms/web/rest/DocumentsResource.java \
	src/test/java/com/giraone/oms/web/rest/DocumentsResourceIT.java \
	src/main/java/com/giraone/oms/service/ImagingService.java \
	src/test/java/com/giraone/oms/service/ImagingServiceIT.java \
	src/test/java/com/giraone/oms/TechnicalStructureTest.java \
	src/main/resources/config/application.yml \
	src/main/resources/config/application-dev.yml \
	src/main/webapp/i18n/de/global.json \
    src/main/webapp/i18n/de/documents.json \
    src/main/webapp/i18n/de/home.json \
    src/main/webapp/i18n/en/global.json \
    src/main/webapp/i18n/en/documents.json \
    src/main/webapp/i18n/en/home.json \
	src/main/webapp/app/home/home.component.scss \
	src/main/webapp/app/home/home.component.html \
	src/main/webapp/app/layouts/navbar/navbar.component.html \
	src/main/webapp/app/shared/date/format-short-date.pipe.ts \
	src/main/webapp/app/shared/date/format-short-datetime.pipe.ts \
	src/main/webapp/app/shared/date/format-short-time.pipe.ts \
	src/main/webapp/app/shared/shared.module.ts \
	src/main/webapp/app/app-routing-module.ts \
	src/main/webapp/content/images/s3.svg
do
    cp "$SRC/$file" "$TARGET/$file"
done

for dir in \
    docs \
	src/test/curl \
    src/main/java/com/giraone/oms/service/s3 \
    src/main/java/com/giraone/oms/service/util \
    src/main/java/com/giraone/oms/web/websocket \
	src/test/java/com/giraone/oms/service/s3 \
	src/test/java/com/giraone/oms/testutil \
	src/test/resources/testfiles \
    src/main/webapp/app/documents
do
    cp -r "$SRC/$dir" "$(dirname $TARGET/$dir)"
done
