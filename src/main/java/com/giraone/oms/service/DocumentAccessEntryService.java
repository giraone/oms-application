package com.giraone.oms.service;

import com.giraone.oms.service.dto.DocumentAccessEntryDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link com.giraone.oms.domain.DocumentAccessEntry}.
 */
public interface DocumentAccessEntryService {

    /**
     * Save a documentAccessEntry.
     *
     * @param documentAccessEntryDTO the entity to save.
     * @return the persisted entity.
     */
    DocumentAccessEntryDTO save(DocumentAccessEntryDTO documentAccessEntryDTO);

    /**
     * Get all the documentAccessEntries.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DocumentAccessEntryDTO> findAll(Pageable pageable);


    /**
     * Get the "id" documentAccessEntry.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DocumentAccessEntryDTO> findOne(Long id);

    /**
     * Delete the "id" documentAccessEntry.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
