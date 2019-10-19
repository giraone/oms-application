package com.giraone.oms.web.rest;

import com.amazonaws.HttpMethod;
import com.giraone.imaging.ConversionCommand;
import com.giraone.imaging.ImagingProvider;
import com.giraone.imaging.java2.ProviderJava2D;
import com.giraone.oms.config.ApplicationProperties;
import com.giraone.oms.domain.User;
import com.giraone.oms.security.SecurityUtils;
import com.giraone.oms.service.DocumentObjectService;
import com.giraone.oms.service.UserService;
import com.giraone.oms.service.dto.DocumentObjectDTO;
import com.giraone.oms.service.s3.S3StorageService;
import com.giraone.oms.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * REST controller for managing {@link com.giraone.oms.domain.DocumentObject}.
 */
@RestController
@RequestMapping("/api")
public class DocumentsResource {

    private final Logger log = LoggerFactory.getLogger(DocumentsResource.class);

    private static final String MIME_TYPE_THUMBNAIL = "image/jpeg";
    private static final String ENTITY_NAME = "documentObject";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;


    private final ApplicationProperties applicationProperties;
    private final DocumentObjectService documentObjectService;
    private final S3StorageService s3StorageService;
    private final UserService userService;

    private ImagingProvider provider = new ProviderJava2D();

    public DocumentsResource(ApplicationProperties applicationProperties, DocumentObjectService documentObjectService,
                             S3StorageService s3StorageService, UserService userService) {
        this.applicationProperties = applicationProperties;
        this.documentObjectService = documentObjectService;
        this.s3StorageService = s3StorageService;
        this.userService = userService;
    }

    /**
     * {@code GET  /documents} : get all documents
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documentObjects in body.
     */
    @GetMapping("/documents")
    public ResponseEntity<List<DocumentObjectDTO>> getAllDocuments(Pageable pageable) {

        log.debug("REST request to get documents list");

        Optional<User> user = getUser();

        // TODO: Access Control
        Page<DocumentObjectDTO> page = documentObjectService.findAll(pageable);

        page.get().forEach(d -> {

            d.setObjectUrl(s3StorageService.createPreSignedUrl(d.getObjectUrl(), HttpMethod.GET, 1, 0).toExternalForm());
            if (d.getThumbnailUrl() != null) {
                d.setThumbnailUrl(s3StorageService.createPreSignedUrl(d.getThumbnailUrl(), HttpMethod.GET, 1, 0).toExternalForm());
            }
        });
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code POST  /documents} : Prepare upload of a new document
     *
     * @param documentObjectDTO the documentObjectDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new documentObjectDTO, or with status {@code 400 (Bad Request)} if the documentObject has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/documents")
    public ResponseEntity<DocumentObjectDTO> createDocument(@Valid @RequestBody DocumentObjectDTO documentObjectDTO) throws URISyntaxException {

        log.debug("REST request to save document : {}", documentObjectDTO);
        if (documentObjectDTO.getId() != null) {
            throw new BadRequestAlertException("A new documentObject cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Optional<User> user = getUser();

        // path and name are kept untouched - this is the view of the creator
        // TODO => UUID also for folder

        final String rootPath = documentObjectDTO.getPath() + "/" + UUID.randomUUID().toString();
        final String objectPath = rootPath + "/content";
        documentObjectDTO.setOwnerId(user.get().getId());
        documentObjectDTO.setObjectUrl(objectPath);

        // Reserve a pre-signed URL for a POST upload
        URL url = s3StorageService.createPreSignedUrl(objectPath, HttpMethod.PUT, 1, 0);
        System.err.println(url.toExternalForm());

        // Save the meta-data
        DocumentObjectDTO result = documentObjectService.save(documentObjectDTO);

        // Patch the objectUrl for the browser client
        result.setObjectUrl(url.toExternalForm());

        return ResponseEntity.created(new URI("/api/document-objects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @GetMapping("/maintenance/thumbnails")
    public ResponseEntity<List<DocumentObjectDTO>> reCreateThumbnails() {

        log.debug("REST request to re-create thumbnails");

        Pageable pageable = PageRequest.of(0, 100);
        Page<DocumentObjectDTO> page = documentObjectService.findAll(pageable);

        page.get().forEach(d -> {

            final String thumbnailPath = d.getObjectUrl().replace("/content", "thumb-0001.jpg");
            try {
                this.createThumbnail(d.getPath(), thumbnailPath);
                d.setThumbnailUrl(thumbnailPath);
            } catch (Exception e) {
                log.error("Error creating thumbnail for {}", d.getPath(), e);
            }
        });

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    //------------------------------------------------------------------------------------------------------------------

    private Optional<User> getUser() {
        Optional<String> userLogin = SecurityUtils.getCurrentUserLogin();
        if (!userLogin.isPresent()) {
            throw new BadRequestAlertException("Cannot get user login", ENTITY_NAME, "no_user");
        }

        Optional<User> user = userService.getUserWithAuthoritiesByLogin(userLogin.get());
        if (!user.isPresent()) {
            throw new BadRequestAlertException("Cannot get user account", ENTITY_NAME, "no_user_account");
        }
        return user;
    }

    // TODO: Test
    private void createThumbnail(String urlOriginal, String urlThumbnail) throws Exception {

        File tmpFileOriginal = File.createTempFile("thumb-", ".jpg");
        File tmpFileThumbnail = File.createTempFile("thumb-", ".jpg");

        try {
            try (FileOutputStream outputStreamOriginal = new FileOutputStream(tmpFileOriginal)) {
                s3StorageService.transferToStream(urlOriginal, outputStreamOriginal);
            }
            try (FileOutputStream outputStreamThumbnail = new FileOutputStream(tmpFileThumbnail)) {
                provider.createThumbNail(tmpFileOriginal, outputStreamThumbnail, MIME_TYPE_THUMBNAIL,
                    applicationProperties.getThumbWidthAndHeight(), applicationProperties.getThumbWidthAndHeight(),
                    ConversionCommand.CompressionQuality.LOSSY_BEST, ConversionCommand.SpeedHint.ULTRA_QUALITY);
            }
            try (FileInputStream inputStreamThumbnail = new FileInputStream(tmpFileThumbnail)) {
                s3StorageService.storeFromStream(inputStreamThumbnail, MIME_TYPE_THUMBNAIL, tmpFileThumbnail.length(), urlThumbnail);
            }
        }
        finally {
            tmpFileOriginal.delete();
            tmpFileThumbnail.delete();
        }
    }
}
