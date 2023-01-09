package com.giraone.oms.service;

import com.giraone.oms.service.dto.DocumentAccessEntryDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
     * Updates a documentAccessEntry.
     *
     * @param documentAccessEntryDTO the entity to update.
     * @return the persisted entity.
     */
    DocumentAccessEntryDTO update(DocumentAccessEntryDTO documentAccessEntryDTO);

    /**
     * Partially updates a documentAccessEntry.
     *
     * @param documentAccessEntryDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DocumentAccessEntryDTO> partialUpdate(DocumentAccessEntryDTO documentAccessEntryDTO);

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
