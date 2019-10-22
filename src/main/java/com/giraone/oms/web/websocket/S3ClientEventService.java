package com.giraone.oms.web.websocket;

import com.giraone.oms.web.websocket.dto.S3ClientEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class S3ClientEventService {

    private static final Logger log = LoggerFactory.getLogger(S3ClientEventService.class);

    @MessageMapping("/topic/s3-queue")
    @SendTo("/topic/s3-event")
    public S3ClientEventDTO receive(@Payload S3ClientEventDTO clientEventDTO, StompHeaderAccessor stompHeaderAccessor, Principal principal) {
        clientEventDTO.setPayload("connect " + principal.getName() + " " + stompHeaderAccessor.getSessionId());
        log.info("S3ClientEventService {}", clientEventDTO);
        return clientEventDTO;
    }
}
