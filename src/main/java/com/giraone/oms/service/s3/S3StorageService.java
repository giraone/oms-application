package com.giraone.oms.service.s3;


import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Date;

@Service
public class S3StorageService {

    private static final int EOF = -1;
    private static final int DEFAULT_BUFFER_SIZE = 1024 * 4;
    private static final String PATH_REGEX = "^[a-zA-Z0-9_.-][a-zA-Z0-9_. -/]*[a-zA-Z0-9]+$";

    private static final Logger log= LoggerFactory.getLogger(S3StorageService.class);

    @Autowired
    private AmazonClient amazonClient;

    @PostConstruct
    private void initialize() {

        AmazonS3 s3Client = this.amazonClient.getS3Client();
        String bucketName = this.amazonClient.getBucketName();
        if (!s3Client.doesBucketExistV2(bucketName)) {

            s3Client.createBucket(new CreateBucketRequest(bucketName));

            // Verify that the bucket was created by retrieving it and checking its location.
            String bucketLocation = s3Client.getBucketLocation(new GetBucketLocationRequest(bucketName));
            System.out.println("New bucket in location: " + bucketLocation);
        }
    }

    public void transferToStreamUsingPreSignedUrl(String path, OutputStream outputStream) {
        Date expiration = new Date(System.currentTimeMillis() + 1000 * 60);
        URL url = this.amazonClient.getS3Client().generatePresignedUrl(this.amazonClient.getBucketName(), path, expiration);
        log.debug("S3StorageService.transferToStreamUsingPreSignedUrl {} {}", path, url);
        try {
            URLConnection uc = url.openConnection();
            try (InputStream in = uc.getInputStream()) {
                long count = copyLarge(in, outputStream);
                log.debug("S3StorageService.transferToStreamUsingPreSignedUrl {}: {} bytes copied", path, count);
            }
        } catch (IOException e) {
            throw new StorageException("Cannot stream from S3 path " + path, e);
        }
    }

    public void transferToStream(String path, OutputStream outputStream) {
        S3Object s3Object = this.amazonClient.getS3Client().getObject(this.amazonClient.getBucketName(), path);
        try (S3ObjectInputStream in = s3Object.getObjectContent()) {
            long count = copyLarge(in, outputStream);
            log.debug("S3StorageService.transferToStream {}: {} bytes copied", path, count);
        } catch (IOException e) {
            throw new StorageException("Cannot stream from S3 path " + path, e);
        }
    }

    /**
     * Store the BLOB defined by reading an input stream in S3 using "path" as the object key.
     * @param inputStream   The input stream to read the content from
     * @param contentType   The content type of the BLOB
     * @param contentLength The content length or null, if the content length is unknown by the caller.
     *                      In this case the content length will be calculated by a reading!
     * @param path          The object key to be used as the path to the object.
     * @return the byte length of the content that was stored
     */
    public long storeFromStream(InputStream inputStream, String contentType, Long contentLength, String path) {

        ContentLengthCalculator cc = null;
        if (contentLength == null || contentLength < 0) {
            log.warn("Content-length not given! Must calculate content-length of " + path);
            cc = new ContentLengthCalculator(inputStream);
            inputStream = cc.getInputStream();
            contentLength = cc.getContentLength();
        }

        try {
            final ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentLength(contentLength);
            objectMetadata.setContentType(contentType);
            PutObjectRequest request = new PutObjectRequest(this.amazonClient.getBucketName(), path, inputStream, objectMetadata);
            // request.withCannedAcl(CannedAccessControlList.PublicRead);
            this.amazonClient.getS3Client().putObject(request);
            return objectMetadata.getContentLength();
        } finally {
            if (cc != null) {
                cc.clean();
            }
        }
    }

    public String storeMultipartFile(MultipartFile file) {

        // Normalize filesystem name
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        if (!this.isValidPathName(fileName)) {
            throw new StorageException("Sorry! Path contains invalid path sequence " + fileName);
        }
        try (InputStream inputStream = file.getInputStream()) {
            this.storeFromStream(inputStream, file.getContentType(), (long) file.getBytes().length, fileName);
            return fileName;
        } catch (IOException e) {
            throw new StorageException("Error reading multipart filesystem \"" + file.getName() + "\".", e);
        }
    }

    public boolean exists(String path) {

        return this.amazonClient.getS3Client().doesObjectExist(this.amazonClient.getBucketName(), path);
    }

    public boolean delete(String path) {

        if (this.amazonClient.getS3Client().doesObjectExist(this.amazonClient.getBucketName(), path)) {
            DeleteObjectRequest request = new DeleteObjectRequest(this.amazonClient.getBucketName(), path);
            this.amazonClient.getS3Client().deleteObject(request);
            return true;
        } else {
            return false;
        }
    }

    public URL createPreSignedUrl(String objectKey, HttpMethod httpMethod, int expireHour, int cacheControlSeconds) {

        final String bucketName = amazonClient.getBucketName();
        // Set the pre-signed URL to expire after n hours.
        final Date expiration = new Date();
        final long expTimeMillis = expiration.getTime() + 1000 * 60 * 60 * expireHour;
        expiration.setTime(expTimeMillis);

        final ResponseHeaderOverrides responseHeaders = new ResponseHeaderOverrides();
        if (cacheControlSeconds > 0) {
            responseHeaders.setCacheControl("max-age=" + cacheControlSeconds);
        }

        // Generate the pre-signed URL.
        GeneratePresignedUrlRequest generatePresignedUrlRequest =
            new GeneratePresignedUrlRequest(bucketName, objectKey)
                .withMethod(httpMethod)
                .withResponseHeaders(responseHeaders)
                .withExpiration(expiration);
        URL url = this.amazonClient.getS3Client().generatePresignedUrl(generatePresignedUrlRequest);
        log.debug("S3StorageService.createPreSignedUrl: {} {} {} -> {}", bucketName, objectKey, httpMethod.name(), url.toString());
        return url;
    }

    //------------------------------------------------------------------------------------------------------------------

    boolean isValidPathName(String path) {
        return path.matches(PATH_REGEX);
    }

    File copyToTempFile(InputStream inputStream) throws IOException {

        Path tempFile = Files.createTempFile("sto-svc", "");
        Files.copy(inputStream, tempFile);
        return tempFile.toFile();
    }

    /**
     * Copies bytes from an <code>InputStream</code> to an <code>OutputStream</code>.
     * <p>
     * This method buffers the input internally, so there is no need to use a
     * <code>BufferedInputStream</code>.
     * <p>
     * The buffer size is given by {@link #DEFAULT_BUFFER_SIZE}.
     *
     * @param input the <code>InputStream</code> to read from
     * @param output the <code>OutputStream</code> to write to
     * @return the number of bytes copied
     * @throws NullPointerException if the input or output is null
     * @throws IOException          if an I/O error occurs
     */
    public static long copyLarge(final InputStream input, final OutputStream output)
        throws IOException {

        byte[] buffer = new byte[DEFAULT_BUFFER_SIZE];
        long count = 0;
        int n = 0;
        while (EOF != (n = input.read(buffer))) {
            output.write(buffer, 0, n);
            count += n;
        }
        return count;
    }
}
