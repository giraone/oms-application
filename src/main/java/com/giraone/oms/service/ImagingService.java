package com.giraone.oms.service;

import com.giraone.imaging.ConversionCommand;
import com.giraone.imaging.FileInfo;
import com.giraone.imaging.ImagingProvider;
import com.giraone.imaging.java2.ProviderJava2D;
import com.giraone.imaging.pdf.PdfProviderPdfBox;
import com.giraone.oms.config.ApplicationProperties;
import com.giraone.oms.service.s3.S3StorageService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

@Service
public class ImagingService {

    private static final String MIME_TYPE_THUMBNAIL = "image/jpeg";
    private static final String MIME_TYPE_PDF = "application/pdf";

    private final ApplicationProperties applicationProperties;
    private final S3StorageService s3StorageService;

    private final ImagingProvider imagingProvider = new ProviderJava2D();
    private final PdfProviderPdfBox pdfProvider = new PdfProviderPdfBox();

    public ImagingService(ApplicationProperties applicationProperties, S3StorageService s3StorageService) {
        this.applicationProperties = applicationProperties;
        this.s3StorageService = s3StorageService;
    }

    public ObjectMetaDataInfo createThumbnail(String urlOriginal, String urlThumbnail) throws Exception {

        File tmpFileOriginal = File.createTempFile("object-", ".jpg");
        File tmpFileThumbnail = File.createTempFile("thumb-", ".jpg");
        ObjectMetaDataInfo ret = new ObjectMetaDataInfo();

        try {
            try (FileOutputStream outputStreamOriginal = new FileOutputStream(tmpFileOriginal)) {
                s3StorageService.transferToStream(urlOriginal, outputStreamOriginal);
            }
            ret.setByteSizeOriginal(tmpFileOriginal.length());
            FileInfo fileInfo = imagingProvider.fetchFileInfo(tmpFileOriginal);
            ret.setMimeType(fileInfo.getMimeType());

            if (MIME_TYPE_PDF.equals(fileInfo.getMimeType())) {
                ret.setNumberOfPages(pdfProvider.countPages(tmpFileOriginal));
                try (FileOutputStream outputStreamThumbnail = new FileOutputStream(tmpFileThumbnail)) {
                    pdfProvider.createThumbNail(tmpFileOriginal, outputStreamThumbnail, MIME_TYPE_THUMBNAIL,
                        applicationProperties.getThumbWidthAndHeight(), applicationProperties.getThumbWidthAndHeight(),
                        ConversionCommand.CompressionQuality.LOSSY_BEST, ConversionCommand.SpeedHint.ULTRA_QUALITY);
                }
            } else {
                try (FileOutputStream outputStreamThumbnail = new FileOutputStream(tmpFileThumbnail)) {
                    imagingProvider.createThumbNail(tmpFileOriginal, outputStreamThumbnail, MIME_TYPE_THUMBNAIL,
                        applicationProperties.getThumbWidthAndHeight(), applicationProperties.getThumbWidthAndHeight(),
                        ConversionCommand.CompressionQuality.LOSSY_BEST, ConversionCommand.SpeedHint.ULTRA_QUALITY);
                }
            }
            ret.setByteSizeThumbnail(tmpFileThumbnail.length());
            try (FileInputStream inputStreamThumbnail = new FileInputStream(tmpFileThumbnail)) {
                s3StorageService.storeFromStream(inputStreamThumbnail, MIME_TYPE_THUMBNAIL, tmpFileThumbnail.length(), urlThumbnail);
            }
        }
        finally {
            // We do not have to wait for the deletion - this can be done later
            deleteFileAsync(new File[] { tmpFileOriginal, tmpFileThumbnail });
        }

        return ret;
    }

    @Async // must be public
    public void deleteFileAsync(File[] filesToBeDeleted) {

        for (File file : filesToBeDeleted) {
            if (file.exists()) {
                file.delete();
            }
        }
    }

    public static class ObjectMetaDataInfo {
        private long byteSizeOriginal;
        private long byteSizeThumbnail;
        private int numberOfPages = 1;
        private String mimeType;

        public long getByteSizeOriginal() {
            return byteSizeOriginal;
        }

        void setByteSizeOriginal(long byteSizeOriginal) {
            this.byteSizeOriginal = byteSizeOriginal;
        }

        public long getByteSizeThumbnail() {
            return byteSizeThumbnail;
        }

        void setByteSizeThumbnail(long byteSizeThumbnail) {
            this.byteSizeThumbnail = byteSizeThumbnail;
        }

        public int getNumberOfPages() {
            return numberOfPages;
        }

        void setNumberOfPages(int numberOfPages) {
            this.numberOfPages = numberOfPages;
        }

        public String getMimeType() {
            return mimeType;
        }

        void setMimeType(String mimeType) {
            this.mimeType = mimeType;
        }
    }
}
