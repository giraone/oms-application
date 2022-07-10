package com.giraone.oms.web.websocket.dto;

/**
 * DTO for sending and receiving message related to document events between browser and server side.
 * If necessary, the class can be split in a request (browser->server) and a response (server->browser) part.
 */
public class DocumentStompMessageDTO {

    private String event;
    private Object payload;

    // for Jackson
    public DocumentStompMessageDTO() {}

    public DocumentStompMessageDTO(String event, Object payload) {
        this.event = event;
        this.payload = payload;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    @Override
    public String toString() {
        return "DocumentStompMessageDTO{" + "event='" + event + '\'' + ", payload=" + payload + '}';
    }
}
