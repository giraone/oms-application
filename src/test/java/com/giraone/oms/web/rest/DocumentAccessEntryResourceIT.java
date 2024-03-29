package com.giraone.oms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.giraone.oms.IntegrationTest;
import com.giraone.oms.domain.DocumentAccessEntry;
import com.giraone.oms.domain.DocumentObject;
import com.giraone.oms.domain.User;
import com.giraone.oms.domain.enumeration.AccessType;
import com.giraone.oms.repository.DocumentAccessEntryRepository;
import com.giraone.oms.service.dto.DocumentAccessEntryDTO;
import com.giraone.oms.service.mapper.DocumentAccessEntryMapper;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DocumentAccessEntryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DocumentAccessEntryResourceIT {

    private static final AccessType DEFAULT_ACCESS = AccessType.READ_CONTENT;
    private static final AccessType UPDATED_ACCESS = AccessType.READ_METADATA;

    private static final Instant DEFAULT_UNTIL = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UNTIL = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/document-access-entries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DocumentAccessEntryRepository documentAccessEntryRepository;

    @Autowired
    private DocumentAccessEntryMapper documentAccessEntryMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDocumentAccessEntryMockMvc;

    private DocumentAccessEntry documentAccessEntry;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocumentAccessEntry createEntity(EntityManager em) {
        DocumentAccessEntry documentAccessEntry = new DocumentAccessEntry().access(DEFAULT_ACCESS).until(DEFAULT_UNTIL);
        // Add required entity
        DocumentObject documentObject;
        if (TestUtil.findAll(em, DocumentObject.class).isEmpty()) {
            documentObject = DocumentObjectResourceIT.createEntity(em);
            em.persist(documentObject);
            em.flush();
        } else {
            documentObject = TestUtil.findAll(em, DocumentObject.class).get(0);
        }
        documentAccessEntry.setDocument(documentObject);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        documentAccessEntry.setGrantee(user);
        return documentAccessEntry;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocumentAccessEntry createUpdatedEntity(EntityManager em) {
        DocumentAccessEntry documentAccessEntry = new DocumentAccessEntry().access(UPDATED_ACCESS).until(UPDATED_UNTIL);
        // Add required entity
        DocumentObject documentObject;
        if (TestUtil.findAll(em, DocumentObject.class).isEmpty()) {
            documentObject = DocumentObjectResourceIT.createUpdatedEntity(em);
            em.persist(documentObject);
            em.flush();
        } else {
            documentObject = TestUtil.findAll(em, DocumentObject.class).get(0);
        }
        documentAccessEntry.setDocument(documentObject);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        documentAccessEntry.setGrantee(user);
        return documentAccessEntry;
    }

    @BeforeEach
    public void initTest() {
        documentAccessEntry = createEntity(em);
    }

    @Test
    @Transactional
    void createDocumentAccessEntry() throws Exception {
        int databaseSizeBeforeCreate = documentAccessEntryRepository.findAll().size();
        // Create the DocumentAccessEntry
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);
        restDocumentAccessEntryMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO))
            )
            .andExpect(status().isCreated());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeCreate + 1);
        DocumentAccessEntry testDocumentAccessEntry = documentAccessEntryList.get(documentAccessEntryList.size() - 1);
        assertThat(testDocumentAccessEntry.getAccess()).isEqualTo(DEFAULT_ACCESS);
        assertThat(testDocumentAccessEntry.getUntil()).isEqualTo(DEFAULT_UNTIL);
    }

    @Test
    @Transactional
    void createDocumentAccessEntryWithExistingId() throws Exception {
        // Create the DocumentAccessEntry with an existing ID
        documentAccessEntry.setId(1L);
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);

        int databaseSizeBeforeCreate = documentAccessEntryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocumentAccessEntryMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAccessIsRequired() throws Exception {
        int databaseSizeBeforeTest = documentAccessEntryRepository.findAll().size();
        // set the field null
        documentAccessEntry.setAccess(null);

        // Create the DocumentAccessEntry, which fails.
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);

        restDocumentAccessEntryMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO))
            )
            .andExpect(status().isBadRequest());

        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDocumentAccessEntries() throws Exception {
        // Initialize the database
        documentAccessEntryRepository.saveAndFlush(documentAccessEntry);

        // Get all the documentAccessEntryList
        restDocumentAccessEntryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(documentAccessEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].access").value(hasItem(DEFAULT_ACCESS.toString())))
            .andExpect(jsonPath("$.[*].until").value(hasItem(DEFAULT_UNTIL.toString())));
    }

    @Test
    @Transactional
    void getDocumentAccessEntry() throws Exception {
        // Initialize the database
        documentAccessEntryRepository.saveAndFlush(documentAccessEntry);

        // Get the documentAccessEntry
        restDocumentAccessEntryMockMvc
            .perform(get(ENTITY_API_URL_ID, documentAccessEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(documentAccessEntry.getId().intValue()))
            .andExpect(jsonPath("$.access").value(DEFAULT_ACCESS.toString()))
            .andExpect(jsonPath("$.until").value(DEFAULT_UNTIL.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDocumentAccessEntry() throws Exception {
        // Get the documentAccessEntry
        restDocumentAccessEntryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDocumentAccessEntry() throws Exception {
        // Initialize the database
        documentAccessEntryRepository.saveAndFlush(documentAccessEntry);

        int databaseSizeBeforeUpdate = documentAccessEntryRepository.findAll().size();

        // Update the documentAccessEntry
        DocumentAccessEntry updatedDocumentAccessEntry = documentAccessEntryRepository.findById(documentAccessEntry.getId()).get();
        // Disconnect from session so that the updates on updatedDocumentAccessEntry are not directly saved in db
        em.detach(updatedDocumentAccessEntry);
        updatedDocumentAccessEntry.access(UPDATED_ACCESS).until(UPDATED_UNTIL);
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(updatedDocumentAccessEntry);

        restDocumentAccessEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, documentAccessEntryDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO))
            )
            .andExpect(status().isOk());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeUpdate);
        DocumentAccessEntry testDocumentAccessEntry = documentAccessEntryList.get(documentAccessEntryList.size() - 1);
        assertThat(testDocumentAccessEntry.getAccess()).isEqualTo(UPDATED_ACCESS);
        assertThat(testDocumentAccessEntry.getUntil()).isEqualTo(UPDATED_UNTIL);
    }

    @Test
    @Transactional
    void putNonExistingDocumentAccessEntry() throws Exception {
        int databaseSizeBeforeUpdate = documentAccessEntryRepository.findAll().size();
        documentAccessEntry.setId(count.incrementAndGet());

        // Create the DocumentAccessEntry
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentAccessEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, documentAccessEntryDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDocumentAccessEntry() throws Exception {
        int databaseSizeBeforeUpdate = documentAccessEntryRepository.findAll().size();
        documentAccessEntry.setId(count.incrementAndGet());

        // Create the DocumentAccessEntry
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentAccessEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDocumentAccessEntry() throws Exception {
        int databaseSizeBeforeUpdate = documentAccessEntryRepository.findAll().size();
        documentAccessEntry.setId(count.incrementAndGet());

        // Create the DocumentAccessEntry
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentAccessEntryMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDocumentAccessEntryWithPatch() throws Exception {
        // Initialize the database
        documentAccessEntryRepository.saveAndFlush(documentAccessEntry);

        int databaseSizeBeforeUpdate = documentAccessEntryRepository.findAll().size();

        // Update the documentAccessEntry using partial update
        DocumentAccessEntry partialUpdatedDocumentAccessEntry = new DocumentAccessEntry();
        partialUpdatedDocumentAccessEntry.setId(documentAccessEntry.getId());

        restDocumentAccessEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocumentAccessEntry.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDocumentAccessEntry))
            )
            .andExpect(status().isOk());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeUpdate);
        DocumentAccessEntry testDocumentAccessEntry = documentAccessEntryList.get(documentAccessEntryList.size() - 1);
        assertThat(testDocumentAccessEntry.getAccess()).isEqualTo(DEFAULT_ACCESS);
        assertThat(testDocumentAccessEntry.getUntil()).isEqualTo(DEFAULT_UNTIL);
    }

    @Test
    @Transactional
    void fullUpdateDocumentAccessEntryWithPatch() throws Exception {
        // Initialize the database
        documentAccessEntryRepository.saveAndFlush(documentAccessEntry);

        int databaseSizeBeforeUpdate = documentAccessEntryRepository.findAll().size();

        // Update the documentAccessEntry using partial update
        DocumentAccessEntry partialUpdatedDocumentAccessEntry = new DocumentAccessEntry();
        partialUpdatedDocumentAccessEntry.setId(documentAccessEntry.getId());

        partialUpdatedDocumentAccessEntry.access(UPDATED_ACCESS).until(UPDATED_UNTIL);

        restDocumentAccessEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocumentAccessEntry.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDocumentAccessEntry))
            )
            .andExpect(status().isOk());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeUpdate);
        DocumentAccessEntry testDocumentAccessEntry = documentAccessEntryList.get(documentAccessEntryList.size() - 1);
        assertThat(testDocumentAccessEntry.getAccess()).isEqualTo(UPDATED_ACCESS);
        assertThat(testDocumentAccessEntry.getUntil()).isEqualTo(UPDATED_UNTIL);
    }

    @Test
    @Transactional
    void patchNonExistingDocumentAccessEntry() throws Exception {
        int databaseSizeBeforeUpdate = documentAccessEntryRepository.findAll().size();
        documentAccessEntry.setId(count.incrementAndGet());

        // Create the DocumentAccessEntry
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentAccessEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, documentAccessEntryDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDocumentAccessEntry() throws Exception {
        int databaseSizeBeforeUpdate = documentAccessEntryRepository.findAll().size();
        documentAccessEntry.setId(count.incrementAndGet());

        // Create the DocumentAccessEntry
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentAccessEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDocumentAccessEntry() throws Exception {
        int databaseSizeBeforeUpdate = documentAccessEntryRepository.findAll().size();
        documentAccessEntry.setId(count.incrementAndGet());

        // Create the DocumentAccessEntry
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentAccessEntryMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDocumentAccessEntry() throws Exception {
        // Initialize the database
        documentAccessEntryRepository.saveAndFlush(documentAccessEntry);

        int databaseSizeBeforeDelete = documentAccessEntryRepository.findAll().size();

        // Delete the documentAccessEntry
        restDocumentAccessEntryMockMvc
            .perform(delete(ENTITY_API_URL_ID, documentAccessEntry.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
