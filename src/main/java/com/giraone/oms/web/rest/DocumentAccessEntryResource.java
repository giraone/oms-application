package com.giraone.oms.web.rest;

import com.giraone.oms.service.DocumentAccessEntryService;
import com.giraone.oms.service.dto.DocumentAccessEntryDTO;
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

    public DocumentAccessEntryResource(DocumentAccessEntryService documentAccessEntryService) {
        this.documentAccessEntryService = documentAccessEntryService;
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
     * {@code PUT  /document-access-entries} : Updates an existing documentAccessEntry.
     *
     * @param documentAccessEntryDTO the documentAccessEntryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentAccessEntryDTO,
     * or with status {@code 400 (Bad Request)} if the documentAccessEntryDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the documentAccessEntryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/document-access-entries")
    public ResponseEntity<DocumentAccessEntryDTO> updateDocumentAccessEntry(
        @Valid @RequestBody DocumentAccessEntryDTO documentAccessEntryDTO
    ) throws URISyntaxException {
        log.debug("REST request to update DocumentAccessEntry : {}", documentAccessEntryDTO);
        if (documentAccessEntryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DocumentAccessEntryDTO result = documentAccessEntryService.save(documentAccessEntryDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentAccessEntryDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /document-access-entries} : get all the documentAccessEntries.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documentAccessEntries in body.
     */
    @GetMapping("/document-access-entries")
    public ResponseEntity<List<DocumentAccessEntryDTO>> getAllDocumentAccessEntries(Pageable pageable) {
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
