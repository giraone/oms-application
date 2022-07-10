package com.giraone.oms.web.websocket;

import com.giraone.oms.web.websocket.dto.DocumentStompMessageDTO;
import java.security.Principal;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
/**
 * Controller for web socket send/receive related to document events (S3 events passed backed to front-end).
 */
public class DocumentEventsWsController {

    private static final Logger log = LoggerFactory.getLogger(DocumentEventsWsController.class);

    // Standard approach
    @MessageMapping({ "/topic/s3-queue" }) // This is an input topic!
    @SendTo("/topic/s3-event") // broadcast to all users via an output topic
    public DocumentStompMessageDTO receive(
        @Payload DocumentStompMessageDTO messageDTO,
        StompHeaderAccessor stompHeaderAccessor,
        Principal principal
    ) {
        log.info("DocumentEventsWsController {} {}", messageDTO, principal);

        DocumentStompMessageDTO answer = mapAnswer(messageDTO, stompHeaderAccessor, principal);

        return answer;
    }

    // Other approach: See also https://www.baeldung.com/spring-websockets-send-message-to-user
    /*
    @MessageMapping("/websocket/document-events") // This is an endpoint!
    public void receive(@Payload DocumentStompMessageDTO messageDTO, StompHeaderAccessor stompHeaderAccessor, Principal principal) {

        log.info("DocumentEventsWsController {} {}", messageDTO, principal);

        DocumentStompMessageDTO answer = mapAnswer(messageDTO, stompHeaderAccessor);

        if (applicationProperties.isUserBasedWebSocket() && principal != null) {
            simpMessagingTemplate.convertAndSendToUser(principal.getName(), "/topic", answer);
        } else {
            simpMessagingTemplate.convertAndSend("/topic",answer);
        }
    }
    */

    private DocumentStompMessageDTO mapAnswer(
        DocumentStompMessageDTO messageDTO,
        StompHeaderAccessor stompHeaderAccessor,
        Principal principal
    ) {
        // This is the only simple "logic" currently used. Everything else is "proxy-ed" without changing the content.
        if ("clientReady".equals(messageDTO.getEvent())) {
            messageDTO.setEvent("readyConfirmed");
            messageDTO.setPayload(
                Map.of("userName", principal != null ? principal.getName() : null, "sessionId", stompHeaderAccessor.getSessionId())
            );
        }
        return messageDTO;
    }
}
