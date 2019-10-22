package com.giraone.oms.web.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class StompDisconnectedEvent implements ApplicationListener<SessionDisconnectEvent> {

    private static final Logger log = LoggerFactory.getLogger(StompDisconnectedEvent.class);

    @Override
    public void onApplicationEvent(SessionDisconnectEvent event) {
        log.info("> > > > > > > > > STOMP Client disconnected user={}", event.getUser().getName());
    }
}
