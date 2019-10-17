package com.giraone.oms.web.rest;

import com.giraone.oms.OmsApp;
import com.giraone.oms.domain.DocumentAccessEntry;
import com.giraone.oms.domain.DocumentObject;
import com.giraone.oms.domain.User;
import com.giraone.oms.repository.DocumentAccessEntryRepository;
import com.giraone.oms.service.DocumentAccessEntryService;
import com.giraone.oms.service.dto.DocumentAccessEntryDTO;
import com.giraone.oms.service.mapper.DocumentAccessEntryMapper;
import com.giraone.oms.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.giraone.oms.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.giraone.oms.domain.enumeration.AccessType;
/**
 * Integration tests for the {@link DocumentAccessEntryResource} REST controller.
 */
@SpringBootTest(classes = OmsApp.class)
public class DocumentAccessEntryResourceIT {

    private static final AccessType DEFAULT_ACCESS = AccessType.READ_CONTENT;
    private static final AccessType UPDATED_ACCESS = AccessType.READ_METADATA;

    private static final Instant DEFAULT_UNTIL = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UNTIL = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private DocumentAccessEntryRepository documentAccessEntryRepository;

    @Autowired
    private DocumentAccessEntryMapper documentAccessEntryMapper;

    @Autowired
    private DocumentAccessEntryService documentAccessEntryService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restDocumentAccessEntryMockMvc;

    private DocumentAccessEntry documentAccessEntry;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DocumentAccessEntryResource documentAccessEntryResource = new DocumentAccessEntryResource(documentAccessEntryService);
        this.restDocumentAccessEntryMockMvc = MockMvcBuilders.standaloneSetup(documentAccessEntryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocumentAccessEntry createEntity(EntityManager em) {
        DocumentAccessEntry documentAccessEntry = new DocumentAccessEntry()
            .access(DEFAULT_ACCESS)
            .until(DEFAULT_UNTIL);
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
        DocumentAccessEntry documentAccessEntry = new DocumentAccessEntry()
            .access(UPDATED_ACCESS)
            .until(UPDATED_UNTIL);
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
    public void createDocumentAccessEntry() throws Exception {
        int databaseSizeBeforeCreate = documentAccessEntryRepository.findAll().size();

        // Create the DocumentAccessEntry
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);
        restDocumentAccessEntryMockMvc.perform(post("/api/document-access-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO)))
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
    public void createDocumentAccessEntryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = documentAccessEntryRepository.findAll().size();

        // Create the DocumentAccessEntry with an existing ID
        documentAccessEntry.setId(1L);
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocumentAccessEntryMockMvc.perform(post("/api/document-access-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkAccessIsRequired() throws Exception {
        int databaseSizeBeforeTest = documentAccessEntryRepository.findAll().size();
        // set the field null
        documentAccessEntry.setAccess(null);

        // Create the DocumentAccessEntry, which fails.
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);

        restDocumentAccessEntryMockMvc.perform(post("/api/document-access-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO)))
            .andExpect(status().isBadRequest());

        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDocumentAccessEntries() throws Exception {
        // Initialize the database
        documentAccessEntryRepository.saveAndFlush(documentAccessEntry);

        // Get all the documentAccessEntryList
        restDocumentAccessEntryMockMvc.perform(get("/api/document-access-entries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(documentAccessEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].access").value(hasItem(DEFAULT_ACCESS.toString())))
            .andExpect(jsonPath("$.[*].until").value(hasItem(DEFAULT_UNTIL.toString())));
    }
    
    @Test
    @Transactional
    public void getDocumentAccessEntry() throws Exception {
        // Initialize the database
        documentAccessEntryRepository.saveAndFlush(documentAccessEntry);

        // Get the documentAccessEntry
        restDocumentAccessEntryMockMvc.perform(get("/api/document-access-entries/{id}", documentAccessEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(documentAccessEntry.getId().intValue()))
            .andExpect(jsonPath("$.access").value(DEFAULT_ACCESS.toString()))
            .andExpect(jsonPath("$.until").value(DEFAULT_UNTIL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDocumentAccessEntry() throws Exception {
        // Get the documentAccessEntry
        restDocumentAccessEntryMockMvc.perform(get("/api/document-access-entries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDocumentAccessEntry() throws Exception {
        // Initialize the database
        documentAccessEntryRepository.saveAndFlush(documentAccessEntry);

        int databaseSizeBeforeUpdate = documentAccessEntryRepository.findAll().size();

        // Update the documentAccessEntry
        DocumentAccessEntry updatedDocumentAccessEntry = documentAccessEntryRepository.findById(documentAccessEntry.getId()).get();
        // Disconnect from session so that the updates on updatedDocumentAccessEntry are not directly saved in db
        em.detach(updatedDocumentAccessEntry);
        updatedDocumentAccessEntry
            .access(UPDATED_ACCESS)
            .until(UPDATED_UNTIL);
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(updatedDocumentAccessEntry);

        restDocumentAccessEntryMockMvc.perform(put("/api/document-access-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO)))
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
    public void updateNonExistingDocumentAccessEntry() throws Exception {
        int databaseSizeBeforeUpdate = documentAccessEntryRepository.findAll().size();

        // Create the DocumentAccessEntry
        DocumentAccessEntryDTO documentAccessEntryDTO = documentAccessEntryMapper.toDto(documentAccessEntry);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentAccessEntryMockMvc.perform(put("/api/document-access-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentAccessEntryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the DocumentAccessEntry in the database
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDocumentAccessEntry() throws Exception {
        // Initialize the database
        documentAccessEntryRepository.saveAndFlush(documentAccessEntry);

        int databaseSizeBeforeDelete = documentAccessEntryRepository.findAll().size();

        // Delete the documentAccessEntry
        restDocumentAccessEntryMockMvc.perform(delete("/api/document-access-entries/{id}", documentAccessEntry.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DocumentAccessEntry> documentAccessEntryList = documentAccessEntryRepository.findAll();
        assertThat(documentAccessEntryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocumentAccessEntry.class);
        DocumentAccessEntry documentAccessEntry1 = new DocumentAccessEntry();
        documentAccessEntry1.setId(1L);
        DocumentAccessEntry documentAccessEntry2 = new DocumentAccessEntry();
        documentAccessEntry2.setId(documentAccessEntry1.getId());
        assertThat(documentAccessEntry1).isEqualTo(documentAccessEntry2);
        documentAccessEntry2.setId(2L);
        assertThat(documentAccessEntry1).isNotEqualTo(documentAccessEntry2);
        documentAccessEntry1.setId(null);
        assertThat(documentAccessEntry1).isNotEqualTo(documentAccessEntry2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocumentAccessEntryDTO.class);
        DocumentAccessEntryDTO documentAccessEntryDTO1 = new DocumentAccessEntryDTO();
        documentAccessEntryDTO1.setId(1L);
        DocumentAccessEntryDTO documentAccessEntryDTO2 = new DocumentAccessEntryDTO();
        assertThat(documentAccessEntryDTO1).isNotEqualTo(documentAccessEntryDTO2);
        documentAccessEntryDTO2.setId(documentAccessEntryDTO1.getId());
        assertThat(documentAccessEntryDTO1).isEqualTo(documentAccessEntryDTO2);
        documentAccessEntryDTO2.setId(2L);
        assertThat(documentAccessEntryDTO1).isNotEqualTo(documentAccessEntryDTO2);
        documentAccessEntryDTO1.setId(null);
        assertThat(documentAccessEntryDTO1).isNotEqualTo(documentAccessEntryDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(documentAccessEntryMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(documentAccessEntryMapper.fromId(null)).isNull();
    }
}
