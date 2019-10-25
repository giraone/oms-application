package com.giraone.oms.service;

import com.amazonaws.HttpMethod;
import com.giraone.oms.OmsApp;
import com.giraone.oms.service.s3.S3StorageService;
import com.giraone.oms.service.util.IoUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link ImagingService}.
 * Here we use a manually configured embedded Undertow - no S3 mock.
 */
@SpringBootTest(classes = OmsApp.class)
class ImagingServiceIT {

    private static final String TEST_FILE_JPEG_01 = "/testfiles/image-01.jpg";
    private static final String TEST_FILE_PNG_01 = "/testfiles/image-01.png";
    private static final String TEST_FILE_PDF_01 = "/testfiles/document-01.pdf";

    @Autowired
    ImagingService imagingService;

    @Autowired
    S3StorageService s3StorageService;

    @Test
    void createThumbnail_forJpeg_worksBasically() throws Exception {
        createThumbnailFor(TEST_FILE_JPEG_01, "/thumb-01.jpg");
    }

    @Test
    void createThumbnail_forPng_worksBasically() throws Exception {
        createThumbnailFor(TEST_FILE_PNG_01, "/thumb-02.jpg");
    }

    @Test
    void createThumbnail_forPdf_worksBasically() throws Exception {
        createThumbnailFor(TEST_FILE_PDF_01, "/thumb-03.jpg");
    }

    private void createThumbnailFor(String resourcePath, String targetPath) throws Exception {

        // arrange
        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        InputStream inputStream = getClass().getResourceAsStream(resourcePath);
        assertThat(inputStream).isNotNull();
        try {
            IoUtil.copyLarge(inputStream, outputStream);
        } finally {
            inputStream.close();
        }
        final byte[] bytesOriginal = outputStream.toByteArray();
        String urlOriginal = this.createS3TestObject(bytesOriginal);
        String urlThumbnail = s3StorageService.createPreSignedUrl(
            targetPath, HttpMethod.PUT, 1, 0).toExternalForm();

        // act
        ImagingService.ObjectMetaDataInfo metaData = imagingService.createThumbnail(urlOriginal, urlThumbnail);

        // assert
        assertThat(metaData).isNotNull();
        assertThat(metaData.getByteSizeOriginal()).isEqualTo(bytesOriginal.length);
        assertThat(metaData.getByteSizeThumbnail()).isGreaterThan(100);
    }

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
}
