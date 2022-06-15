package com.giraone.oms.config;

import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Oms.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link tech.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private final Logger log = LoggerFactory.getLogger(ApplicationProperties.class);

    private boolean showConfigOnStartup = true;
    private int thumbWidthAndHeight = 180;
    private int cacheControlThumbnail = 600;
    private int cacheControlContentRead = 600;
    private int cacheControlContentWrite = 600;

    @PostConstruct
    private void startup() {
        if (this.showConfigOnStartup) {
            log.info(this.toString());
        }
    }

    public boolean isShowConfigOnStartup() {
        return showConfigOnStartup;
    }

    public void setShowConfigOnStartup(boolean showConfigOnStartup) {
        this.showConfigOnStartup = showConfigOnStartup;
    }

    public int getThumbWidthAndHeight() {
        return thumbWidthAndHeight;
    }

    public void setThumbWidthAndHeight(int thumbWidthAndHeight) {
        this.thumbWidthAndHeight = thumbWidthAndHeight;
    }

    public int getCacheControlThumbnail() {
        return cacheControlThumbnail;
    }

    public void setCacheControlThumbnail(int cacheControlThumbnail) {
        this.cacheControlThumbnail = cacheControlThumbnail;
    }

    public int getCacheControlContentRead() {
        return cacheControlContentRead;
    }

    public void setCacheControlContentRead(int cacheControlContentRead) {
        this.cacheControlContentRead = cacheControlContentRead;
    }

    public int getCacheControlContentWrite() {
        return cacheControlContentWrite;
    }

    public void setCacheControlContentWrite(int cacheControlContentWrite) {
        this.cacheControlContentWrite = cacheControlContentWrite;
    }

    @Override
    public String toString() {
        return (
            "ApplicationProperties{" +
            "showConfigOnStartup=" +
            showConfigOnStartup +
            ", thumbWidthAndHeight=" +
            thumbWidthAndHeight +
            ", cacheControlThumbnail=" +
            cacheControlThumbnail +
            ", cacheControlContentRead=" +
            cacheControlContentRead +
            ", cacheControlContentWrite=" +
            cacheControlContentWrite +
            '}'
        );
    }
}
