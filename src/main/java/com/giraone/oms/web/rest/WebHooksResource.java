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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<String> receiveEventPost(@RequestBody String eventString) {

        log.info("# # # # # # # # # # # # # # # # # # # RECEIVED S3 EVENT by POST: {}", eventString);

        final S3EventNotification eventNotification = S3EventNotification.parseJson(eventString);

        log.info("# # # # # # # # # # # # # # # # # # # CONVERTED EVENT: {}", eventNotification);

        eventNotification.getRecords().forEach(this::processOneEvent);

        return ResponseEntity.accepted().build();
    }

    // TODO: When WebHooks are used, there is a timeout, so the generation should be asynchronous
    private boolean processOneEvent(S3EventNotification.S3EventNotificationRecord eventRecord) {
        String objectKey = eventRecord.getS3().getObject().getKey();
        try {
            objectKey = URLDecoder.decode(objectKey, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            log.error("Received event for objectKey {}, but cannot decode", objectKey);
        }

        log.info("# # # # # # # # # # # # # # # # # # # OBJECT-KEY: {}", objectKey);

        if (!objectKey.endsWith("/content")) {
            log.warn("Received event for objectKey {} no ending in /content", objectKey);
            return false;
        }

        final Optional<DocumentObjectDTO> foundDocumentObject = documentObjectService.findByObjectKey(objectKey);
        if (!foundDocumentObject.isPresent()) {
            log.error("Received event for objectKey {}, but no object found!", objectKey);
            return false;
        }

        final DocumentObjectDTO documentObject = foundDocumentObject.get();
        documentObject.buildThumbnailUrl();

        ImagingService.ObjectMetaDataInfo metaData;
        try {
            metaData = imagingService.createThumbnail(documentObject.getObjectUrl(), documentObject.getThumbnailUrl());
        } catch (Exception e) {
            log.error("Error creating thumbnail for objectKey {}", objectKey, e);
            return false;
        }

        documentObject.setLastContentModification(Instant.now());
        documentObject.setMimeType(metaData.getMimeType());
        documentObject.setByteSize(metaData.getByteSizeOriginal());
        documentObject.setNumberOfPages(metaData.getNumberOfPages());

        documentObjectService.save(documentObject);

        publishReadyEventToUser(documentObject.getOwnerId());

        return true;
    }

    //------------------------------------------------------------------------------------------------------------------

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
