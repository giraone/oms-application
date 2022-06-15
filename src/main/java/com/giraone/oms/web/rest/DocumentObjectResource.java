package com.giraone.oms.web.rest;

import com.giraone.oms.service.DocumentObjectService;
import com.giraone.oms.service.dto.DocumentObjectDTO;
import com.giraone.oms.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
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
public class DocumentObjectResource {

    private final Logger log = LoggerFactory.getLogger(DocumentObjectResource.class);

    private static final String ENTITY_NAME = "documentObject";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocumentObjectService documentObjectService;

    public DocumentObjectResource(DocumentObjectService documentObjectService) {
        this.documentObjectService = documentObjectService;
    }

    /**
     * {@code POST  /document-objects} : Create a new documentObject.
     *
     * @param documentObjectDTO the documentObjectDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new documentObjectDTO, or with status {@code 400 (Bad Request)} if the documentObject has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/document-objects")
    public ResponseEntity<DocumentObjectDTO> createDocumentObject(@Valid @RequestBody DocumentObjectDTO documentObjectDTO)
        throws URISyntaxException {
        log.debug("REST request to save DocumentObject : {}", documentObjectDTO);
        if (documentObjectDTO.getId() != null) {
            throw new BadRequestAlertException("A new documentObject cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DocumentObjectDTO result = documentObjectService.save(documentObjectDTO);
        return ResponseEntity
            .created(new URI("/api/document-objects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /document-objects} : Updates an existing documentObject.
     *
     * @param documentObjectDTO the documentObjectDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentObjectDTO,
     * or with status {@code 400 (Bad Request)} if the documentObjectDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the documentObjectDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/document-objects")
    public ResponseEntity<DocumentObjectDTO> updateDocumentObject(@Valid @RequestBody DocumentObjectDTO documentObjectDTO)
        throws URISyntaxException {
        log.debug("REST request to update DocumentObject : {}", documentObjectDTO);
        if (documentObjectDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DocumentObjectDTO result = documentObjectService.save(documentObjectDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentObjectDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /document-objects} : get all the documentObjects.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documentObjects in body.
     */
    @GetMapping("/document-objects")
    public ResponseEntity<List<DocumentObjectDTO>> getAllDocumentObjects(Pageable pageable) {
        log.debug("REST request to get a page of DocumentObjects");
        Page<DocumentObjectDTO> page = documentObjectService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /document-objects/:id} : get the "id" documentObject.
     *
     * @param id the id of the documentObjectDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the documentObjectDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/document-objects/{id}")
    public ResponseEntity<DocumentObjectDTO> getDocumentObject(@PathVariable Long id) {
        log.debug("REST request to get DocumentObject : {}", id);
        Optional<DocumentObjectDTO> documentObjectDTO = documentObjectService.findOne(id);
        return ResponseUtil.wrapOrNotFound(documentObjectDTO);
    }

    /**
     * {@code DELETE  /document-objects/:id} : delete the "id" documentObject.
     *
     * @param id the id of the documentObjectDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/document-objects/{id}")
    public ResponseEntity<Void> deleteDocumentObject(@PathVariable Long id) {
        log.debug("REST request to delete DocumentObject : {}", id);
        documentObjectService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
