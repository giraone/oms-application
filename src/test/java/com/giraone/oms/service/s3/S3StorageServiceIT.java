package com.giraone.oms.service.s3;

import com.amazonaws.HttpMethod;
import com.giraone.oms.OmsApp;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for {@link S3StorageService}.
 */
@SpringBootTest(classes = OmsApp.class)
class S3StorageServiceIT {

    @Autowired
    private S3StorageService s3StorageService;

    @Test
    void isValidPathName_worksBasically() {

        // arrange/act/assert
        assertThat(s3StorageService.isValidPathName("")).isFalse();
        assertThat(s3StorageService.isValidPathName("x#y")).isFalse();
        assertThat(s3StorageService.isValidPathName("xy")).isTrue();
        assertThat(s3StorageService.isValidPathName("x/y")).isTrue();
    }

    @Test
    void createPreSignedUrl_worksBasically() {

        // arrange
        String objectKey = UUID.randomUUID().toString() + "/" + UUID.randomUUID().toString();
        int expireHour = 1;
        int cacheControlSeconds = 0;

        // act
        URL url = s3StorageService.createPreSignedUrl(objectKey, HttpMethod.PUT, expireHour, cacheControlSeconds);

        // assert
        assertThat(url).isNotNull();
        assertThat(url.toExternalForm()).startsWith("http");
    }

    @Test
    void exists_worksBasically() {

        // arrange
        String objectKey = this.createS3TestObject();

        // act
        boolean exists = s3StorageService.exists(objectKey);

        // assert
        assertThat(exists).isTrue();
    }

    @Test
    void delete_worksBasically() {

        // arrange
        String objectKey = this.createS3TestObject();

        // act
        boolean deleted = s3StorageService.delete(objectKey);

        // assert
        assertThat(deleted).isTrue();
        boolean exists = s3StorageService.exists(objectKey);
        assertThat(exists).isFalse();
    }

    @Test
    void storeFromStream_worksBasically() {

        // arrange/act
        String objectKey = this.createS3TestObject();

        // assert
        assertThat(objectKey).contains("/");
    }

    @Test
    void ransferToStream_worksBasically() {

        // arrange
        byte[] bytesToStore = "abcdefghijklmnopqrstuvwxyzäöü".getBytes(StandardCharsets.UTF_8);
        String objectKey = this.createS3TestObject(bytesToStore);

        // act
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        s3StorageService.transferToStream(objectKey, outputStream);

        // assert
        assertThat(outputStream.toByteArray()).isEqualTo(bytesToStore);
    }

    @Test
    void transferToStreamUsingPreSignedUrl_worksBasically() {

        // arrange
        byte[] bytesToStore = "abcdefghijklmnopqrstuvwxyzäöü".getBytes(StandardCharsets.UTF_8);
        String objectKey = this.createS3TestObject(bytesToStore);

        // act
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        s3StorageService.transferToStreamUsingPreSignedUrl(objectKey, outputStream);

        // assert
        assertThat(outputStream.toByteArray()).isEqualTo(bytesToStore);
    }

    //------------------------------------------------------------------------------------------------------------------

    private String createS3TestObject(byte[] bytesToStore) {

        // arrange
        InputStream inputStream = new ByteArrayInputStream(bytesToStore);
        long contentLength = bytesToStore.length;
        String objectKey = UUID.randomUUID().toString() + "/" + UUID.randomUUID().toString();

        // act
        long storedContentLength = s3StorageService.storeFromStream(
            inputStream, "application/octet-stream", contentLength, objectKey);

        // assert
        assertThat(storedContentLength).isEqualTo(contentLength);

        return objectKey;
    }

    private String createS3TestObject() {

        // arrange
        byte[] bytesToStore = "abcdefghijklmnopqrstuvwxyzäöü".getBytes(StandardCharsets.UTF_8);
        return createS3TestObject(bytesToStore);
    }
}
