package com.giraone.oms.web.rest;

import com.amazonaws.services.s3.event.S3EventNotification;
import com.giraone.oms.config.ApplicationProperties;
import com.giraone.oms.domain.User;
import com.giraone.oms.service.DocumentObjectService;
import com.giraone.oms.service.ImagingService;
import com.giraone.oms.service.UserService;
import com.giraone.oms.service.dto.DocumentObjectDTO;
import com.giraone.oms.web.websocket.dto.DocumentStompMessageDTO;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for the S3 event API of minio (sending updates on an upload).
 */
@RestController
@RequestMapping("/event-api")
public class WebHooksResource {

    private final Logger log = LoggerFactory.getLogger(WebHooksResource.class);

    private final ImagingService imagingService;
    private final DocumentObjectService documentObjectService;
    private final UserService userService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ApplicationProperties applicationProperties;

    public WebHooksResource(
        ImagingService imagingService,
        DocumentObjectService documentObjectService,
        UserService userService,
        SimpMessageSendingOperations messagingTemplate,
        ApplicationProperties applicationProperties
    ) {
        this.imagingService = imagingService;
        this.documentObjectService = documentObjectService;
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
        this.applicationProperties = applicationProperties;
    }

    @PostMapping("/s3")
    public ResponseEntity<Void> handleS3Event(@RequestBody(required = false) S3EventNotification eventNotification) {
        long start = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug(
                "# # # # # # # # # # # # # # # # # # # CONVERTED S3 EVENT: {}",
                eventNotification == null ? "null" : eventNotification.toJson()
            );
        }
        if (eventNotification == null) {
            return ResponseEntity.accepted().build();
        }

        eventNotification.getRecords().forEach(this::processOneEvent);
        long end = System.currentTimeMillis();
        log.info("# # # # # # # # # # # # # # # # # # # PROCESSING S3 EVENT took {} msecs", (end - start));
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/proxy/{topic}/{userLogin}")
    public ResponseEntity<Void> proxy(
        @PathVariable String topic,
        @PathVariable String userLogin,
        @RequestBody Map<String, Object> message
    ) {
        log.info("# # # # # # # # # # # # # # # # # # # receiveProxyPost {} {} {}", topic, userLogin, message);

        if ("ALL".equals(userLogin)) {
            // Goes to /topic/<topic>
            messagingTemplate.convertAndSend("/topic/" + topic, message);
        } else {
            // Goes to /user/<user-name>/topic/<topic>
            messagingTemplate.convertAndSendToUser(userLogin, "/topic/" + topic, message);
        }
        log.info("> > > > > > > > > STOMP Client send user={}, message={}", userLogin, message);
        return ResponseEntity.accepted().build();
    }

    private void processOneEvent(S3EventNotification.S3EventNotificationRecord eventRecord) {
        String objectKey = eventRecord.getS3().getObject().getKey();
        objectKey = URLDecoder.decode(objectKey, StandardCharsets.UTF_8);
        if (!objectKey.endsWith("/content")) {
            if (!objectKey.contains("/thumb-")) {
                log.warn("Received event for objectKey {} not matching /content or /thumb-* - skipped", objectKey);
            }
            return;
        }

        final Optional<DocumentObjectDTO> foundDocumentObject = documentObjectService.findByObjectKey(objectKey);
        if (foundDocumentObject.isEmpty()) {
            log.error("Received event for objectKey {}, but no object found!", objectKey);
            return;
        }

        final DocumentObjectDTO documentObject = foundDocumentObject.get();
        documentObject.buildThumbnailUrl();

        // we perform this asynchronously, because when WebHooks are used, there is a timeout,
        // so the generation of thumbnails in larger documents may be too slow.
        long start = System.currentTimeMillis();
        createThumbnailAsynchronously(documentObject);
        long end = System.currentTimeMillis();
        log.info("# # # # # # # # # # # # # # # # # # # createThumbnailAsynchronously took {} milliseconds", (end - start));
    }

    //------------------------------------------------------------------------------------------------------------------

    @Async // must be public
    public void createThumbnailAsynchronously(DocumentObjectDTO documentObject) {
        ImagingService.ObjectMetaDataInfo metaData;
        try {
            metaData = imagingService.createThumbnail(documentObject.getObjectUrl(), documentObject.getThumbnailUrl());
        } catch (Exception e) {
            log.error("Error creating thumbnail for objectKey {}", documentObject.getObjectUrl(), e);
            return;
        }

        documentObject = documentObjectService.saveMetaData(documentObject.getId(), metaData);
        documentObjectService.preparePolicyBasedUrls(documentObject);

        // we pass the owner, so that it is possible in the future to send only to the owner
        publishThumbnailReadyEventToUser(documentObject.getOwnerId(), documentObject);
    }

    @SuppressWarnings("UnusedReturnValue")
    private boolean publishThumbnailReadyEventToUser(long userId, DocumentObjectDTO documentObject) {
        Optional<User> user = userService.getUserWithAuthorities(userId);
        if (user.isEmpty()) {
            log.error("User with id {} NOT FOUND!", userId);
            return false;
        }
        final String userLogin = user.get().getLogin();

        DocumentStompMessageDTO documentStompMessageDTO = new DocumentStompMessageDTO("reloadThumbnail", documentObject);

        if (applicationProperties.isUserBasedWebSocket()) {
            messagingTemplate.convertAndSendToUser(userLogin, "/topic/s3-event", documentStompMessageDTO);
        } else {
            messagingTemplate.convertAndSend("/topic/s3-event", documentStompMessageDTO);
        }
        log.info("> > > > > > > > > STOMP Client send user={}, event={}", userLogin, documentStompMessageDTO);

        return true;
    }
}
