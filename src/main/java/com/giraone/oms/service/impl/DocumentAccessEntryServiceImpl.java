package com.giraone.oms.service.impl;

import com.giraone.oms.service.DocumentAccessEntryService;
import com.giraone.oms.domain.DocumentAccessEntry;
import com.giraone.oms.repository.DocumentAccessEntryRepository;
import com.giraone.oms.service.dto.DocumentAccessEntryDTO;
import com.giraone.oms.service.mapper.DocumentAccessEntryMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link DocumentAccessEntry}.
 */
@Service
@Transactional
public class DocumentAccessEntryServiceImpl implements DocumentAccessEntryService {

    private final Logger log = LoggerFactory.getLogger(DocumentAccessEntryServiceImpl.class);

    private final DocumentAccessEntryRepository documentAccessEntryRepository;

    private final DocumentAccessEntryMapper documentAccessEntryMapper;

    public DocumentAccessEntryServiceImpl(DocumentAccessEntryRepository documentAccessEntryRepository, DocumentAccessEntryMapper documentAccessEntryMapper) {
        this.documentAccessEntryRepository = documentAccessEntryRepository;
        this.documentAccessEntryMapper = documentAccessEntryMapper;
    }

    /**
     * Save a documentAccessEntry.
     *
     * @param documentAccessEntryDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public DocumentAccessEntryDTO save(DocumentAccessEntryDTO documentAccessEntryDTO) {
        log.debug("Request to save DocumentAccessEntry : {}", documentAccessEntryDTO);
        DocumentAccessEntry documentAccessEntry = documentAccessEntryMapper.toEntity(documentAccessEntryDTO);
        documentAccessEntry = documentAccessEntryRepository.save(documentAccessEntry);
        return documentAccessEntryMapper.toDto(documentAccessEntry);
    }

    /**
     * Get all the documentAccessEntries.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<DocumentAccessEntryDTO> findAll(Pageable pageable) {
        log.debug("Request to get all DocumentAccessEntries");
        return documentAccessEntryRepository.findAll(pageable)
            .map(documentAccessEntryMapper::toDto);
    }


    /**
     * Get one documentAccessEntry by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<DocumentAccessEntryDTO> findOne(Long id) {
        log.debug("Request to get DocumentAccessEntry : {}", id);
        return documentAccessEntryRepository.findById(id)
            .map(documentAccessEntryMapper::toDto);
    }

    /**
     * Delete the documentAccessEntry by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DocumentAccessEntry : {}", id);
        documentAccessEntryRepository.deleteById(id);
    }
}
