package com.giraone.oms.web.rest;

import com.amazonaws.HttpMethod;
import com.giraone.oms.domain.User;
import com.giraone.oms.domain.enumeration.DocumentPolicy;
import com.giraone.oms.security.SecurityUtils;
import com.giraone.oms.service.DocumentObjectService;
import com.giraone.oms.service.ImagingService;
import com.giraone.oms.service.dto.DocumentObjectDTO;
import com.giraone.oms.service.dto.DocumentObjectWriteDTO;
import com.giraone.oms.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.giraone.oms.domain.DocumentObject}.
 */
@RestController
@RequestMapping("/api")
public class DocumentsResource {

    private final Logger log = LoggerFactory.getLogger(DocumentsResource.class);

    private static final String ROOT_UUID = "adef7792-f275-11e9-ab54-bf6dab9bc95c";
    private static final String ENTITY_NAME = "document";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocumentObjectService documentObjectService;
    private final ImagingService imagingService;

    public DocumentsResource(DocumentObjectService documentObjectService, ImagingService imagingService) {
        this.documentObjectService = documentObjectService;
        this.imagingService = imagingService;
    }

    /**
     * {@code GET /documents} : get all documents
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documentObjects in body.
     */
    @GetMapping("/documents")
    public ResponseEntity<List<DocumentObjectDTO>> getAllDocuments(Pageable pageable) {
        log.debug("REST request to get document list by user={}", SecurityUtils.getCurrentUserLogin());

        Page<DocumentObjectDTO> page = documentObjectService.findAllForCurrentUser(pageable);
        // prepare the possible pre-signed URLs based on the access policy
        page.get().forEach(d -> this.documentObjectService.preparePolicyBasedUrls(d));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET /documents/:id} : get the "id" documentObject.
     *
     * @param id the id of the documentObjectDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the documentObjectDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/documents/{id}")
    public ResponseEntity<DocumentObjectDTO> getDocumentObject(@PathVariable Long id) {
        log.debug("REST request to get DocumentObject : {}", id);
        Optional<DocumentObjectDTO> documentObjectDTO = documentObjectService.findOne(id);
        return ResponseUtil.wrapOrNotFound(documentObjectDTO);
    }

    /**
     * {@code POST /documents} : Prepare upload of a new document
     *
     * @param documentObjectWriteDTO the documentObjectWriteDTO data to create a new DocumentObject.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new documentObjectDTO,
     * or with status {@code 400 (Bad Request)} if the documentObject has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/documents")
    public ResponseEntity<DocumentObjectDTO> createDocument(@Valid @RequestBody DocumentObjectWriteDTO documentObjectWriteDTO)
        throws URISyntaxException {
        log.debug("REST request to save document : {} by user {}", documentObjectWriteDTO, SecurityUtils.getCurrentUserLogin());

        DocumentObjectDTO documentObjectDTO;
        final Instant now = Instant.now();

        if (documentObjectWriteDTO.getId() != null) {
            Optional<DocumentObjectDTO> existingDocumentObject = documentObjectService.findOne(documentObjectWriteDTO.getId());
            if (existingDocumentObject.isEmpty()) {
                throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "notfound");
            }
            documentObjectDTO = existingDocumentObject.get();
        } else {
            documentObjectDTO = new DocumentObjectDTO();
            // The name and policy is defined by the creator
            documentObjectDTO.setName(documentObjectWriteDTO.getName());
            documentObjectDTO.setDocumentPolicy(DocumentPolicy.PRIVATE);
            // Path is optional and ROOT by default
            documentObjectDTO.setPath(
                documentObjectWriteDTO.getPath() != null && documentObjectWriteDTO.getPath().trim().length() > 0
                    ? documentObjectWriteDTO.getPath().trim()
                    : "/"
            );
            // The rest is added by the service
            // TODO: Multiple path defined by creator with multiple path UUIDs
            documentObjectDTO.setPathUuid(ROOT_UUID);
            documentObjectDTO.setNameUuid(UUID.randomUUID().toString());
            documentObjectDTO.setCreation(now);
            documentObjectDTO.setNumberOfPages(0);
            documentObjectDTO.buildObjectUrl();

            // Save the meta-data
            documentObjectDTO = documentObjectService.save(documentObjectDTO);
        }

        // Reserve a pre-signed URL for a POST upload and patch the objectWriteUrl for the browser client
        documentObjectDTO.setObjectWriteUrl(
            documentObjectService.createPreSignedUrl(documentObjectDTO.getObjectKey(), HttpMethod.PUT).toExternalForm()
        );

        return ResponseEntity
            .created(new URI("/api/document-objects/" + documentObjectDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, documentObjectDTO.getId().toString()))
            .body(documentObjectDTO);
    }

    /**
     * {@code PUT /documents} : Change meta-data of an existing document.
     *
     * @param documentObjectWriteDTO the documentObjectDTO to update (currently only name is updated)
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentObjectDTO,
     * or with status {@code 400 (Bad Request)} if the documentObjectDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the documentObjectDTO couldn't be updated.
     */
    @PutMapping("/documents")
    public ResponseEntity<DocumentObjectDTO> updateDocument(@Valid @RequestBody DocumentObjectWriteDTO documentObjectWriteDTO) {
        log.debug("REST request to update document : {}", documentObjectWriteDTO);
        if (documentObjectWriteDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Optional<DocumentObjectDTO> existingDocumentObject = documentObjectService.findOne(documentObjectWriteDTO.getId());
        if (existingDocumentObject.isEmpty()) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "notfound");
        }

        if (documentObjectWriteDTO.getName() != null) {
            existingDocumentObject.get().setName(documentObjectWriteDTO.getName());
        }
        if (documentObjectWriteDTO.getDocumentPolicy() != null) {
            existingDocumentObject.get().setDocumentPolicy(documentObjectWriteDTO.getDocumentPolicy());
        }

        DocumentObjectDTO result = documentObjectService.save(existingDocumentObject.get());
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentObjectWriteDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code DELETE /documents/:id} : delete a document
     *
     * @param id the id of the documentObjectDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        log.debug("REST request to delete document : {}", id);

        boolean ok = documentObjectService.delete(id);
        if (ok) {
            return ResponseEntity
                .noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
        } else {
            log.warn("Attempt to delete non-existing document {}", id);
            return ResponseEntity.noContent().headers(HeaderUtil.createAlert(applicationName, "Document not found!", null)).build();
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    @GetMapping("/maintenance/thumbnails")
    public ResponseEntity<List<DocumentObjectDTO>> reCreateThumbnails() {
        log.debug("REST request to re-create thumbnails");

        Pageable pageable = PageRequest.of(0, 100);
        Page<DocumentObjectDTO> page = documentObjectService.findAll(pageable);
        Stream<DocumentObjectDTO> allDocuments = page.get();
        page
            .get()
            .forEach(documentObject -> {
                if (documentObject.hasObject() && !documentObject.hasThumbnail()) {
                    documentObject.buildThumbnailUrl();
                    try {
                        ImagingService.ObjectMetaDataInfo metaData = imagingService.createThumbnail(
                            documentObject.getObjectUrl(),
                            documentObject.getThumbnailUrl()
                        );
                        documentObject.setMimeType(metaData.getMimeType());
                        documentObject.setByteSize(metaData.getByteSizeOriginal());
                        documentObject.setNumberOfPages(metaData.getNumberOfPages());
                    } catch (Exception e) {
                        log.error("Error creating thumbnail for {}", documentObject.dump(), e);
                        documentObject.setThumbnailUrl(null);
                    }
                }
            });

        List<DocumentObjectDTO> ret = documentObjectService.save(allDocuments.collect(Collectors.toList()));

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(ret);
    }
}
