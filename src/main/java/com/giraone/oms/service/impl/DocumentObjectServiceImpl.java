package com.giraone.oms.service.impl;

import com.giraone.oms.service.DocumentObjectService;
import com.giraone.oms.domain.DocumentObject;
import com.giraone.oms.repository.DocumentObjectRepository;
import com.giraone.oms.service.dto.DocumentObjectDTO;
import com.giraone.oms.service.mapper.DocumentObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link DocumentObject}.
 */
@Service
@Transactional
public class DocumentObjectServiceImpl implements DocumentObjectService {

    private final Logger log = LoggerFactory.getLogger(DocumentObjectServiceImpl.class);

    private final DocumentObjectRepository documentObjectRepository;

    private final DocumentObjectMapper documentObjectMapper;

    public DocumentObjectServiceImpl(DocumentObjectRepository documentObjectRepository, DocumentObjectMapper documentObjectMapper) {
        this.documentObjectRepository = documentObjectRepository;
        this.documentObjectMapper = documentObjectMapper;
    }

    /**
     * Save a documentObject.
     *
     * @param documentObjectDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public DocumentObjectDTO save(DocumentObjectDTO documentObjectDTO) {
        log.debug("Request to save DocumentObject : {}", documentObjectDTO);
        DocumentObject documentObject = documentObjectMapper.toEntity(documentObjectDTO);
        documentObject = documentObjectRepository.save(documentObject);
        return documentObjectMapper.toDto(documentObject);
    }

    /**
     * Save multiple documentObjects.
     *
     * @param documentObjectDTOs the collection to save.
     * @return the persisted entities.
     */
    @Override
    public List<DocumentObjectDTO> save(Collection<DocumentObjectDTO> documentObjectDTOs) {
        log.debug("Request to save DocumentObjects : #={}", documentObjectDTOs.size());
        List<DocumentObject> entities = documentObjectDTOs.stream()
            .map(d -> documentObjectMapper.toEntity(d)).collect(Collectors.toList());
        entities = documentObjectRepository.saveAll(entities);
        return documentObjectMapper.toDto(entities);
    }

    /**
     * Get all the documentObjects.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<DocumentObjectDTO> findAll(Pageable pageable) {
        log.debug("Request to get all DocumentObjects");
        return documentObjectRepository.findAll(pageable)
            .map(documentObjectMapper::toDto);
    }


    /**
     * Get one documentObject by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<DocumentObjectDTO> findOne(Long id) {
        log.debug("Request to get DocumentObject : {}", id);
        return documentObjectRepository.findById(id)
            .map(documentObjectMapper::toDto);
    }

    /**
     * Get the documentObject by its S3 objectKey
     *
     * @param objectKey the S3 objectKey of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<DocumentObjectDTO> findByObjectKey(String objectKey) {
        log.debug("Request to get DocumentObject by objectKey: {}", objectKey);

        int slash = objectKey.indexOf('/');
        if (slash == -1) {
            log.error("Object key mismatch: No / in objectKey {}", objectKey);
            return Optional.empty();
        }
        String pathUuid = objectKey.substring(0, slash);
        String nameUuid = objectKey.substring(slash + 1);
        slash = nameUuid.indexOf('/');
        nameUuid = nameUuid.substring(0, slash);
        return documentObjectRepository.findByPathUuidAndNameUuid(pathUuid, nameUuid)
            .map(documentObjectMapper::toDto);
    }

    /**
     * Delete the documentObject by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DocumentObject : {}", id);
        documentObjectRepository.deleteById(id);
    }
}
