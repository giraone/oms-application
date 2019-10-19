package com.giraone.oms.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;

import javax.annotation.PostConstruct;

/**
 * Properties specific to Oms.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private final Logger log = LoggerFactory.getLogger(ApplicationProperties.class);

    private boolean showConfigOnStartup = true;
    private int thumbWidthAndHeight = 180;

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

    @Override
    public String toString() {
        return "ApplicationProperties{" +
            "showConfigOnStartup=" + showConfigOnStartup +
            ", thumbWidthAndHeight=" + thumbWidthAndHeight +
            '}';
    }
}
