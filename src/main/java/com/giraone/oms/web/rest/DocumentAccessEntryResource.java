package com.giraone.oms.web.rest;

import com.giraone.oms.repository.DocumentAccessEntryRepository;
import com.giraone.oms.service.DocumentAccessEntryService;
import com.giraone.oms.service.dto.DocumentAccessEntryDTO;
import com.giraone.oms.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.giraone.oms.domain.DocumentAccessEntry}.
 */
@RestController
@RequestMapping("/api")
public class DocumentAccessEntryResource {

    private final Logger log = LoggerFactory.getLogger(DocumentAccessEntryResource.class);

    private static final String ENTITY_NAME = "documentAccessEntry";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocumentAccessEntryService documentAccessEntryService;

    private final DocumentAccessEntryRepository documentAccessEntryRepository;

    public DocumentAccessEntryResource(
        DocumentAccessEntryService documentAccessEntryService,
        DocumentAccessEntryRepository documentAccessEntryRepository
    ) {
        this.documentAccessEntryService = documentAccessEntryService;
        this.documentAccessEntryRepository = documentAccessEntryRepository;
    }

    /**
     * {@code POST  /document-access-entries} : Create a new documentAccessEntry.
     *
     * @param documentAccessEntryDTO the documentAccessEntryDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new documentAccessEntryDTO, or with status {@code 400 (Bad Request)} if the documentAccessEntry has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/document-access-entries")
    public ResponseEntity<DocumentAccessEntryDTO> createDocumentAccessEntry(
        @Valid @RequestBody DocumentAccessEntryDTO documentAccessEntryDTO
    ) throws URISyntaxException {
        log.debug("REST request to save DocumentAccessEntry : {}", documentAccessEntryDTO);
        if (documentAccessEntryDTO.getId() != null) {
            throw new BadRequestAlertException("A new documentAccessEntry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DocumentAccessEntryDTO result = documentAccessEntryService.save(documentAccessEntryDTO);
        return ResponseEntity
            .created(new URI("/api/document-access-entries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /document-access-entries/:id} : Updates an existing documentAccessEntry.
     *
     * @param id the id of the documentAccessEntryDTO to save.
     * @param documentAccessEntryDTO the documentAccessEntryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentAccessEntryDTO,
     * or with status {@code 400 (Bad Request)} if the documentAccessEntryDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the documentAccessEntryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/document-access-entries/{id}")
    public ResponseEntity<DocumentAccessEntryDTO> updateDocumentAccessEntry(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DocumentAccessEntryDTO documentAccessEntryDTO
    ) throws URISyntaxException {
        log.debug("REST request to update DocumentAccessEntry : {}, {}", id, documentAccessEntryDTO);
        if (documentAccessEntryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, documentAccessEntryDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!documentAccessEntryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DocumentAccessEntryDTO result = documentAccessEntryService.update(documentAccessEntryDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentAccessEntryDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /document-access-entries/:id} : Partial updates given fields of an existing documentAccessEntry, field will ignore if it is null
     *
     * @param id the id of the documentAccessEntryDTO to save.
     * @param documentAccessEntryDTO the documentAccessEntryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentAccessEntryDTO,
     * or with status {@code 400 (Bad Request)} if the documentAccessEntryDTO is not valid,
     * or with status {@code 404 (Not Found)} if the documentAccessEntryDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the documentAccessEntryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/document-access-entries/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DocumentAccessEntryDTO> partialUpdateDocumentAccessEntry(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DocumentAccessEntryDTO documentAccessEntryDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update DocumentAccessEntry partially : {}, {}", id, documentAccessEntryDTO);
        if (documentAccessEntryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, documentAccessEntryDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!documentAccessEntryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DocumentAccessEntryDTO> result = documentAccessEntryService.partialUpdate(documentAccessEntryDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentAccessEntryDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /document-access-entries} : get all the documentAccessEntries.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documentAccessEntries in body.
     */
    @GetMapping("/document-access-entries")
    public ResponseEntity<List<DocumentAccessEntryDTO>> getAllDocumentAccessEntries(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of DocumentAccessEntries");
        Page<DocumentAccessEntryDTO> page = documentAccessEntryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /document-access-entries/:id} : get the "id" documentAccessEntry.
     *
     * @param id the id of the documentAccessEntryDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the documentAccessEntryDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/document-access-entries/{id}")
    public ResponseEntity<DocumentAccessEntryDTO> getDocumentAccessEntry(@PathVariable Long id) {
        log.debug("REST request to get DocumentAccessEntry : {}", id);
        Optional<DocumentAccessEntryDTO> documentAccessEntryDTO = documentAccessEntryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(documentAccessEntryDTO);
    }

    /**
     * {@code DELETE  /document-access-entries/:id} : delete the "id" documentAccessEntry.
     *
     * @param id the id of the documentAccessEntryDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/document-access-entries/{id}")
    public ResponseEntity<Void> deleteDocumentAccessEntry(@PathVariable Long id) {
        log.debug("REST request to delete DocumentAccessEntry : {}", id);
        documentAccessEntryService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
