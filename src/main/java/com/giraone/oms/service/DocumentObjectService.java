package com.giraone.oms.service;

import com.giraone.oms.service.dto.DocumentObjectDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link com.giraone.oms.domain.DocumentObject}.
 */
public interface DocumentObjectService {

    /**
     * Save a documentObject.
     *
     * @param documentObjectDTO the entity to save.
     * @return the persisted entity.
     */
    DocumentObjectDTO save(DocumentObjectDTO documentObjectDTO);

    /**
     * Get all the documentObjects.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DocumentObjectDTO> findAll(Pageable pageable);


    /**
     * Get the "id" documentObject.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DocumentObjectDTO> findOne(Long id);

    /**
     * Delete the "id" documentObject.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
