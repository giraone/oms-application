package com.giraone.oms.web.rest;

import com.amazonaws.services.s3.event.S3EventNotification;
import com.giraone.oms.domain.User;
import com.giraone.oms.service.DocumentObjectService;
import com.giraone.oms.service.ImagingService;
import com.giraone.oms.service.UserService;
import com.giraone.oms.service.dto.DocumentObjectDTO;
import com.giraone.oms.web.websocket.dto.S3ClientEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Optional;

/**
 * REST controller for managing {@link com.giraone.oms.domain.DocumentObject}.
 */
@RestController
@RequestMapping("/event-api")
public class WebHooksResource {

    private final Logger log = LoggerFactory.getLogger(WebHooksResource.class);

    private final ImagingService imagingService;
    private final DocumentObjectService documentObjectService;
    private final UserService userService;
    private final SimpMessageSendingOperations messagingTemplate;

    public WebHooksResource(ImagingService imagingService, DocumentObjectService documentObjectService,
                            UserService userService, SimpMessageSendingOperations messagingTemplate) {
        this.imagingService = imagingService;
        this.documentObjectService = documentObjectService;
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }

    @PostMapping("/s3")
    public ResponseEntity<Void> receiveEventPost(@RequestBody(required = false) S3EventNotification eventNotification) {

        long start = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("# # # # # # # # # # # # # # # # # # # CONVERTED S3 EVENT: {}", eventNotification == null ? "null" : eventNotification.toJson());
        }
        if (eventNotification == null) {
            return ResponseEntity.accepted().build();
        }

        eventNotification.getRecords().forEach(this::processOneEvent);
        long end = System.currentTimeMillis();
        log.info("# # # # # # # # # # # # # # # # # # # PROCESSING S3 EVENT took {} msecs", (end-start));
        return ResponseEntity.accepted().build();
    }

    private void processOneEvent(S3EventNotification.S3EventNotificationRecord eventRecord) {
        String objectKey = eventRecord.getS3().getObject().getKey();
        try {
            objectKey = URLDecoder.decode(objectKey, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            log.error("Received event for objectKey {}, but cannot decode", objectKey);
            return;
        }

        if (!objectKey.endsWith("/content")) {
            if (!objectKey.contains("/thumb-")) {
                log.warn("Received event for objectKey {} not matching /content or /thumb-* - skipped", objectKey);
            }
            return;
        }

        final Optional<DocumentObjectDTO> foundDocumentObject = documentObjectService.findByObjectKey(objectKey);
        if (!foundDocumentObject.isPresent()) {
            log.error("Received event for objectKey {}, but no object found!", objectKey);
            return;
        }

        final DocumentObjectDTO documentObject = foundDocumentObject.get();
        documentObject.buildThumbnailUrl();

        // we perform this asynchronously, because when WebHooks are used, there is a timeout,
        // so the generation of thumbnails in larger documents may be to slow.
        long start = System.currentTimeMillis();
        createThumbnailAsynchronously(documentObject);
        long end = System.currentTimeMillis();
        log.info("# # # # # # # # # # # # # # # # # # # createThumbnailAsynchronously took {} msecs", (end-start));
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

        documentObject.setLastContentModification(Instant.now());
        documentObject.setMimeType(metaData.getMimeType());
        documentObject.setByteSize(metaData.getByteSizeOriginal());
        documentObject.setNumberOfPages(metaData.getNumberOfPages());

        documentObjectService.save(documentObject);

        publishReadyEventToUser(documentObject.getOwnerId());
    }

    private boolean publishReadyEventToUser(long userId) {

        Optional<User> user = userService.getUserWithAuthorities(userId);
        if (!user.isPresent()) {
            log.error("User with id {} NOT FOUND!", userId);
            return false;
        }
        final String userLogin = user.get().getLogin();

        S3ClientEventDTO s3ClientEventDTO = new S3ClientEventDTO();
        s3ClientEventDTO.setPayload("ready");
        messagingTemplate.convertAndSendToUser(userLogin, "/topic/s3-event", s3ClientEventDTO);
        log.info("> > > > > > > > > STOMP Client send user={}, payload={}", userLogin, s3ClientEventDTO.getPayload());

        return true;
    }
}
