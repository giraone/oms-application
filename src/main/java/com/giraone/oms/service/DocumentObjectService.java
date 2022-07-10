package com.giraone.oms.service;

import com.amazonaws.HttpMethod;
import com.giraone.oms.service.dto.DocumentObjectDTO;
import java.net.URL;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.giraone.oms.domain.DocumentObject}.
 */
public interface DocumentObjectService {
    /**
     * Save a document object.
     *
     * @param documentObjectDTO the entity to save.
     * @return the persisted entity.
     */
    DocumentObjectDTO save(DocumentObjectDTO documentObjectDTO);

    /**
     * Save meta data for an existing document object
     *
     * @param documentId the id of the document object
     * @param metaData the metadata to be stored
     * @return the persisted entity.
     */
    DocumentObjectDTO saveMetaData(long documentId, ImagingService.ObjectMetaDataInfo metaData);

    /**
     * Save multiple : document objects.
     *
     * @param documentObjectDTOs the collection to save.
     * @return the persisted entities.
     */
    List<DocumentObjectDTO> save(Collection<DocumentObjectDTO> documentObjectDTOs);

    /**
     * Get all the : document objects.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DocumentObjectDTO> findAll(Pageable pageable);

    /**
     * Get all the : document objects of a user
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DocumentObjectDTO> findAllForCurrentUser(Pageable pageable);

    /**
     * Get the "id" : document object.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DocumentObjectDTO> findOne(Long id);

    /**
     * Get the : document object by its S3 objectKey
     *
     * @param objectKey the S3 objectKey of the entity.
     * @return the entity.
     */
    Optional<DocumentObjectDTO> findByObjectKey(String objectKey);

    /**
     * Delete the "id" : document object.
     *
     * @param id the id of the entity.
     * @return true, if the id was found, false otherwise
     */
    boolean delete(Long id);

    void preparePolicyBasedUrls(DocumentObjectDTO d);

    URL createPreSignedUrl(String objectKey, HttpMethod httpMethod);
}
