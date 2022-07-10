package com.giraone.oms.service.impl;

import com.amazonaws.HttpMethod;
import com.giraone.oms.config.ApplicationProperties;
import com.giraone.oms.domain.DocumentObject;
import com.giraone.oms.domain.User;
import com.giraone.oms.domain.enumeration.DocumentPolicy;
import com.giraone.oms.repository.DocumentObjectRepository;
import com.giraone.oms.security.SecurityUtils;
import com.giraone.oms.service.DocumentObjectService;
import com.giraone.oms.service.ImagingService;
import com.giraone.oms.service.UserService;
import com.giraone.oms.service.dto.DocumentObjectDTO;
import com.giraone.oms.service.mapper.DocumentObjectMapper;
import com.giraone.oms.service.s3.S3StorageService;
import com.giraone.oms.web.rest.errors.BadRequestAlertException;
import java.net.URL;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link DocumentObject}.
 */
@Service
@Transactional
public class DocumentObjectServiceImpl implements DocumentObjectService {

    private final Logger log = LoggerFactory.getLogger(DocumentObjectServiceImpl.class);

    private final DocumentObjectRepository documentObjectRepository;
    private final DocumentObjectMapper documentObjectMapper;
    private final S3StorageService s3StorageService;
    private final UserService userService;
    private final ApplicationProperties applicationProperties;

    public DocumentObjectServiceImpl(
        DocumentObjectRepository documentObjectRepository,
        DocumentObjectMapper documentObjectMapper,
        S3StorageService s3StorageService,
        UserService userService,
        ApplicationProperties applicationProperties
    ) {
        this.documentObjectRepository = documentObjectRepository;
        this.documentObjectMapper = documentObjectMapper;
        this.s3StorageService = s3StorageService;
        this.userService = userService;
        this.applicationProperties = applicationProperties;
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
        Optional<User> user = this.getCurrentUser();
        documentObjectDTO.setOwnerId(user.isPresent() ? user.get().getId() : 1); // Default admin
        DocumentObject documentObject = documentObjectMapper.toEntity(documentObjectDTO);
        documentObject = documentObjectRepository.save(documentObject);
        return documentObjectMapper.toDto(documentObject);
    }

    /**
     * Save meta data for an existing document object
     *
     * @param documentId the id of the document object
     * @param metaData the metadata to be stored
     * @return the persisted entity.
     */
    @Override
    public DocumentObjectDTO saveMetaData(long documentId, ImagingService.ObjectMetaDataInfo metaData) {
        final Optional<DocumentObjectDTO> documentObjectOptional = this.findOne(documentId);
        if (documentObjectOptional.isEmpty()) {
            return null;
        }
        final DocumentObjectDTO documentObject = documentObjectOptional.get();
        documentObject.buildThumbnailUrl();
        documentObject.setLastContentModification(Instant.now());
        documentObject.setMimeType(metaData.getMimeType());
        documentObject.setByteSize(metaData.getByteSizeOriginal());
        documentObject.setNumberOfPages(metaData.getNumberOfPages());
        return this.save(documentObject);
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
        List<DocumentObject> entities = documentObjectDTOs.stream().map(documentObjectMapper::toEntity).collect(Collectors.toList());
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
        return documentObjectRepository.findAll(pageable).map(documentObjectMapper::toDto);
    }

    /**
     * Get all the documentObjects of a user
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<DocumentObjectDTO> findAllForCurrentUser(Pageable pageable) {
        final Optional<User> user = getCurrentUser();
        long userId = user.isPresent() ? user.get().getId() : 0; // No user, no result for 0
        log.debug("Request to get all DocumentObjects of user {}", userId);
        return documentObjectRepository.findByAllowedAccess(userId, pageable).map(documentObjectMapper::toDto);
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
        return documentObjectRepository.findById(id).map(documentObjectMapper::toDto);
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
        return documentObjectRepository.findByPathUuidAndNameUuid(pathUuid, nameUuid).map(documentObjectMapper::toDto);
    }

    /**
     * Delete the documentObject by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public boolean delete(Long id) {
        log.debug("Request to delete DocumentObject : {}", id);

        Optional<DocumentObjectDTO> document = this.findOne(id);
        if (document.isEmpty()) {
            log.warn("Attempt to delete non-existing document {}", id);
            return false;
        }
        final String objectKey = document.get().getObjectUrl();
        if (s3StorageService.exists(objectKey)) {
            log.debug("Try to delete object with object key {} in S3", objectKey);
            boolean success = s3StorageService.delete(objectKey);
            log.info("Delete object with object key {} in S3: success = {}", objectKey, success);
        } else {
            log.debug("No document with object key {} in S3", objectKey);
        }
        documentObjectRepository.deleteById(id);
        return true;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Not really 100% in scope of the class, but code is needed also from WebHooksResource
    //------------------------------------------------------------------------------------------------------------------

    @Override
    public void preparePolicyBasedUrls(DocumentObjectDTO d) {
        final Optional<User> user = getCurrentUser();
        // When called from WebHooksResource, there is no user. So we prepare for the owner.
        // TODO: currently this is not secure, as long as teh websocket protocol is not-user based!
        long userId = user.isPresent() ? user.get().getId() : (d.getOwnerId() != null ? d.getOwnerId() : 0);

        // everybody, who has access can read the content
        d.setObjectUrl(
            s3StorageService
                .createPreSignedUrl(d.getObjectKey(), HttpMethod.GET, 1, applicationProperties.getCacheControlContentRead())
                .toExternalForm()
        );
        // everybody, who has access can read the thumbnail
        if (d.getThumbnailUrl() != null) {
            d.setThumbnailUrl(
                s3StorageService
                    .createPreSignedUrl(d.getThumbnailKey(), HttpMethod.GET, 1, applicationProperties.getCacheControlThumbnail())
                    .toExternalForm()
            );
        }
        // if the document is not locked and if the caller is the owner write access is possible
        if (d.getDocumentPolicy() != DocumentPolicy.LOCKED && d.getOwnerId() == userId) {
            d.setObjectWriteUrl(
                s3StorageService
                    .createPreSignedUrl(d.getObjectKey(), HttpMethod.PUT, 1, applicationProperties.getCacheControlContentWrite())
                    .toExternalForm()
            );
        }
    }

    @Override
    public URL createPreSignedUrl(String objectKey, HttpMethod httpMethod) {
        return this.s3StorageService.createPreSignedUrl(objectKey, httpMethod, 1, 0);
    }

    //------------------------------------------------------------------------------------------------------------------

    private Optional<User> getCurrentUser() {
        Optional<String> userLogin = SecurityUtils.getCurrentUserLogin();
        if (userLogin.isEmpty()) {
            throw new BadRequestAlertException("Cannot get user login", "document", "no_user");
        }

        return userService.getUserWithAuthoritiesByLogin(userLogin.get());
    }
}
