package com.giraone.oms.web.websocket.dto;

/**
 * DTO for storing a user's need for S3 events
 */
public class S3ClientEventDTO {

    private String payload;

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    @Override
    public String toString() {
        return "S3ClientEventDTO{" +
            "payload='" + payload + '\'' +
            '}';
    }
}
