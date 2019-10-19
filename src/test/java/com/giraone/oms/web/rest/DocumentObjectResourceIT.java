package com.giraone.oms.web.rest;

import com.giraone.oms.OmsApp;
import com.giraone.oms.domain.DocumentObject;
import com.giraone.oms.domain.User;
import com.giraone.oms.repository.DocumentObjectRepository;
import com.giraone.oms.service.DocumentObjectService;
import com.giraone.oms.service.dto.DocumentObjectDTO;
import com.giraone.oms.service.mapper.DocumentObjectMapper;
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
import java.util.List;

import static com.giraone.oms.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link DocumentObjectResource} REST controller.
 */
@SpringBootTest(classes = OmsApp.class)
public class DocumentObjectResourceIT {

    private static final String DEFAULT_PATH = "AAAAAAAAAA";
    private static final String UPDATED_PATH = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PATH_UUID = "AAAAAAAAAA";
    private static final String UPDATED_PATH_UUID = "BBBBBBBBBB";

    private static final String DEFAULT_NAME_UUID = "AAAAAAAAAA";
    private static final String UPDATED_NAME_UUID = "BBBBBBBBBB";

    private static final String DEFAULT_MIME_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_MIME_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_OBJECT_URL = "AAAAAAAAAA";
    private static final String UPDATED_OBJECT_URL = "BBBBBBBBBB";

    private static final String DEFAULT_THUMBNAIL_URL = "AAAAAAAAAA";
    private static final String UPDATED_THUMBNAIL_URL = "BBBBBBBBBB";

    private static final Integer DEFAULT_BYTE_SIZE = 1;
    private static final Integer UPDATED_BYTE_SIZE = 2;

    private static final Integer DEFAULT_NUMBER_OF_PAGES = 1;
    private static final Integer UPDATED_NUMBER_OF_PAGES = 2;

    @Autowired
    private DocumentObjectRepository documentObjectRepository;

    @Autowired
    private DocumentObjectMapper documentObjectMapper;

    @Autowired
    private DocumentObjectService documentObjectService;

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

    private MockMvc restDocumentObjectMockMvc;

    private DocumentObject documentObject;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DocumentObjectResource documentObjectResource = new DocumentObjectResource(documentObjectService);
        this.restDocumentObjectMockMvc = MockMvcBuilders.standaloneSetup(documentObjectResource)
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
    public static DocumentObject createEntity(EntityManager em) {
        DocumentObject documentObject = new DocumentObject()
            .path(DEFAULT_PATH)
            .name(DEFAULT_NAME)
            .pathUuid(DEFAULT_PATH_UUID)
            .nameUuid(DEFAULT_NAME_UUID)
            .mimeType(DEFAULT_MIME_TYPE)
            .objectUrl(DEFAULT_OBJECT_URL)
            .thumbnailUrl(DEFAULT_THUMBNAIL_URL)
            .byteSize(DEFAULT_BYTE_SIZE)
            .numberOfPages(DEFAULT_NUMBER_OF_PAGES);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        documentObject.setOwner(user);
        return documentObject;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocumentObject createUpdatedEntity(EntityManager em) {
        DocumentObject documentObject = new DocumentObject()
            .path(UPDATED_PATH)
            .name(UPDATED_NAME)
            .pathUuid(UPDATED_PATH_UUID)
            .nameUuid(UPDATED_NAME_UUID)
            .mimeType(UPDATED_MIME_TYPE)
            .objectUrl(UPDATED_OBJECT_URL)
            .thumbnailUrl(UPDATED_THUMBNAIL_URL)
            .byteSize(UPDATED_BYTE_SIZE)
            .numberOfPages(UPDATED_NUMBER_OF_PAGES);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        documentObject.setOwner(user);
        return documentObject;
    }

    @BeforeEach
    public void initTest() {
        documentObject = createEntity(em);
    }

    @Test
    @Transactional
    public void createDocumentObject() throws Exception {
        int databaseSizeBeforeCreate = documentObjectRepository.findAll().size();

        // Create the DocumentObject
        DocumentObjectDTO documentObjectDTO = documentObjectMapper.toDto(documentObject);
        restDocumentObjectMockMvc.perform(post("/api/document-objects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentObjectDTO)))
            .andExpect(status().isCreated());

        // Validate the DocumentObject in the database
        List<DocumentObject> documentObjectList = documentObjectRepository.findAll();
        assertThat(documentObjectList).hasSize(databaseSizeBeforeCreate + 1);
        DocumentObject testDocumentObject = documentObjectList.get(documentObjectList.size() - 1);
        assertThat(testDocumentObject.getPath()).isEqualTo(DEFAULT_PATH);
        assertThat(testDocumentObject.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDocumentObject.getPathUuid()).isEqualTo(DEFAULT_PATH_UUID);
        assertThat(testDocumentObject.getNameUuid()).isEqualTo(DEFAULT_NAME_UUID);
        assertThat(testDocumentObject.getMimeType()).isEqualTo(DEFAULT_MIME_TYPE);
        assertThat(testDocumentObject.getObjectUrl()).isEqualTo(DEFAULT_OBJECT_URL);
        assertThat(testDocumentObject.getThumbnailUrl()).isEqualTo(DEFAULT_THUMBNAIL_URL);
        assertThat(testDocumentObject.getByteSize()).isEqualTo(DEFAULT_BYTE_SIZE);
        assertThat(testDocumentObject.getNumberOfPages()).isEqualTo(DEFAULT_NUMBER_OF_PAGES);
    }

    @Test
    @Transactional
    public void createDocumentObjectWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = documentObjectRepository.findAll().size();

        // Create the DocumentObject with an existing ID
        documentObject.setId(1L);
        DocumentObjectDTO documentObjectDTO = documentObjectMapper.toDto(documentObject);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocumentObjectMockMvc.perform(post("/api/document-objects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentObjectDTO)))
            .andExpect(status().isBadRequest());

        // Validate the DocumentObject in the database
        List<DocumentObject> documentObjectList = documentObjectRepository.findAll();
        assertThat(documentObjectList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkPathIsRequired() throws Exception {
        int databaseSizeBeforeTest = documentObjectRepository.findAll().size();
        // set the field null
        documentObject.setPath(null);

        // Create the DocumentObject, which fails.
        DocumentObjectDTO documentObjectDTO = documentObjectMapper.toDto(documentObject);

        restDocumentObjectMockMvc.perform(post("/api/document-objects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentObjectDTO)))
            .andExpect(status().isBadRequest());

        List<DocumentObject> documentObjectList = documentObjectRepository.findAll();
        assertThat(documentObjectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = documentObjectRepository.findAll().size();
        // set the field null
        documentObject.setName(null);

        // Create the DocumentObject, which fails.
        DocumentObjectDTO documentObjectDTO = documentObjectMapper.toDto(documentObject);

        restDocumentObjectMockMvc.perform(post("/api/document-objects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentObjectDTO)))
            .andExpect(status().isBadRequest());

        List<DocumentObject> documentObjectList = documentObjectRepository.findAll();
        assertThat(documentObjectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPathUuidIsRequired() throws Exception {
        int databaseSizeBeforeTest = documentObjectRepository.findAll().size();
        // set the field null
        documentObject.setPathUuid(null);

        // Create the DocumentObject, which fails.
        DocumentObjectDTO documentObjectDTO = documentObjectMapper.toDto(documentObject);

        restDocumentObjectMockMvc.perform(post("/api/document-objects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentObjectDTO)))
            .andExpect(status().isBadRequest());

        List<DocumentObject> documentObjectList = documentObjectRepository.findAll();
        assertThat(documentObjectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameUuidIsRequired() throws Exception {
        int databaseSizeBeforeTest = documentObjectRepository.findAll().size();
        // set the field null
        documentObject.setNameUuid(null);

        // Create the DocumentObject, which fails.
        DocumentObjectDTO documentObjectDTO = documentObjectMapper.toDto(documentObject);

        restDocumentObjectMockMvc.perform(post("/api/document-objects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentObjectDTO)))
            .andExpect(status().isBadRequest());

        List<DocumentObject> documentObjectList = documentObjectRepository.findAll();
        assertThat(documentObjectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDocumentObjects() throws Exception {
        // Initialize the database
        documentObjectRepository.saveAndFlush(documentObject);

        // Get all the documentObjectList
        restDocumentObjectMockMvc.perform(get("/api/document-objects?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(documentObject.getId().intValue())))
            .andExpect(jsonPath("$.[*].path").value(hasItem(DEFAULT_PATH)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].pathUuid").value(hasItem(DEFAULT_PATH_UUID)))
            .andExpect(jsonPath("$.[*].nameUuid").value(hasItem(DEFAULT_NAME_UUID)))
            .andExpect(jsonPath("$.[*].mimeType").value(hasItem(DEFAULT_MIME_TYPE)))
            .andExpect(jsonPath("$.[*].objectUrl").value(hasItem(DEFAULT_OBJECT_URL)))
            .andExpect(jsonPath("$.[*].thumbnailUrl").value(hasItem(DEFAULT_THUMBNAIL_URL)))
            .andExpect(jsonPath("$.[*].byteSize").value(hasItem(DEFAULT_BYTE_SIZE)))
            .andExpect(jsonPath("$.[*].numberOfPages").value(hasItem(DEFAULT_NUMBER_OF_PAGES)));
    }
    
    @Test
    @Transactional
    public void getDocumentObject() throws Exception {
        // Initialize the database
        documentObjectRepository.saveAndFlush(documentObject);

        // Get the documentObject
        restDocumentObjectMockMvc.perform(get("/api/document-objects/{id}", documentObject.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(documentObject.getId().intValue()))
            .andExpect(jsonPath("$.path").value(DEFAULT_PATH))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.pathUuid").value(DEFAULT_PATH_UUID))
            .andExpect(jsonPath("$.nameUuid").value(DEFAULT_NAME_UUID))
            .andExpect(jsonPath("$.mimeType").value(DEFAULT_MIME_TYPE))
            .andExpect(jsonPath("$.objectUrl").value(DEFAULT_OBJECT_URL))
            .andExpect(jsonPath("$.thumbnailUrl").value(DEFAULT_THUMBNAIL_URL))
            .andExpect(jsonPath("$.byteSize").value(DEFAULT_BYTE_SIZE))
            .andExpect(jsonPath("$.numberOfPages").value(DEFAULT_NUMBER_OF_PAGES));
    }

    @Test
    @Transactional
    public void getNonExistingDocumentObject() throws Exception {
        // Get the documentObject
        restDocumentObjectMockMvc.perform(get("/api/document-objects/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDocumentObject() throws Exception {
        // Initialize the database
        documentObjectRepository.saveAndFlush(documentObject);

        int databaseSizeBeforeUpdate = documentObjectRepository.findAll().size();

        // Update the documentObject
        DocumentObject updatedDocumentObject = documentObjectRepository.findById(documentObject.getId()).get();
        // Disconnect from session so that the updates on updatedDocumentObject are not directly saved in db
        em.detach(updatedDocumentObject);
        updatedDocumentObject
            .path(UPDATED_PATH)
            .name(UPDATED_NAME)
            .pathUuid(UPDATED_PATH_UUID)
            .nameUuid(UPDATED_NAME_UUID)
            .mimeType(UPDATED_MIME_TYPE)
            .objectUrl(UPDATED_OBJECT_URL)
            .thumbnailUrl(UPDATED_THUMBNAIL_URL)
            .byteSize(UPDATED_BYTE_SIZE)
            .numberOfPages(UPDATED_NUMBER_OF_PAGES);
        DocumentObjectDTO documentObjectDTO = documentObjectMapper.toDto(updatedDocumentObject);

        restDocumentObjectMockMvc.perform(put("/api/document-objects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentObjectDTO)))
            .andExpect(status().isOk());

        // Validate the DocumentObject in the database
        List<DocumentObject> documentObjectList = documentObjectRepository.findAll();
        assertThat(documentObjectList).hasSize(databaseSizeBeforeUpdate);
        DocumentObject testDocumentObject = documentObjectList.get(documentObjectList.size() - 1);
        assertThat(testDocumentObject.getPath()).isEqualTo(UPDATED_PATH);
        assertThat(testDocumentObject.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDocumentObject.getPathUuid()).isEqualTo(UPDATED_PATH_UUID);
        assertThat(testDocumentObject.getNameUuid()).isEqualTo(UPDATED_NAME_UUID);
        assertThat(testDocumentObject.getMimeType()).isEqualTo(UPDATED_MIME_TYPE);
        assertThat(testDocumentObject.getObjectUrl()).isEqualTo(UPDATED_OBJECT_URL);
        assertThat(testDocumentObject.getThumbnailUrl()).isEqualTo(UPDATED_THUMBNAIL_URL);
        assertThat(testDocumentObject.getByteSize()).isEqualTo(UPDATED_BYTE_SIZE);
        assertThat(testDocumentObject.getNumberOfPages()).isEqualTo(UPDATED_NUMBER_OF_PAGES);
    }

    @Test
    @Transactional
    public void updateNonExistingDocumentObject() throws Exception {
        int databaseSizeBeforeUpdate = documentObjectRepository.findAll().size();

        // Create the DocumentObject
        DocumentObjectDTO documentObjectDTO = documentObjectMapper.toDto(documentObject);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentObjectMockMvc.perform(put("/api/document-objects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentObjectDTO)))
            .andExpect(status().isBadRequest());

        // Validate the DocumentObject in the database
        List<DocumentObject> documentObjectList = documentObjectRepository.findAll();
        assertThat(documentObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDocumentObject() throws Exception {
        // Initialize the database
        documentObjectRepository.saveAndFlush(documentObject);

        int databaseSizeBeforeDelete = documentObjectRepository.findAll().size();

        // Delete the documentObject
        restDocumentObjectMockMvc.perform(delete("/api/document-objects/{id}", documentObject.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DocumentObject> documentObjectList = documentObjectRepository.findAll();
        assertThat(documentObjectList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocumentObject.class);
        DocumentObject documentObject1 = new DocumentObject();
        documentObject1.setId(1L);
        DocumentObject documentObject2 = new DocumentObject();
        documentObject2.setId(documentObject1.getId());
        assertThat(documentObject1).isEqualTo(documentObject2);
        documentObject2.setId(2L);
        assertThat(documentObject1).isNotEqualTo(documentObject2);
        documentObject1.setId(null);
        assertThat(documentObject1).isNotEqualTo(documentObject2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocumentObjectDTO.class);
        DocumentObjectDTO documentObjectDTO1 = new DocumentObjectDTO();
        documentObjectDTO1.setId(1L);
        DocumentObjectDTO documentObjectDTO2 = new DocumentObjectDTO();
        assertThat(documentObjectDTO1).isNotEqualTo(documentObjectDTO2);
        documentObjectDTO2.setId(documentObjectDTO1.getId());
        assertThat(documentObjectDTO1).isEqualTo(documentObjectDTO2);
        documentObjectDTO2.setId(2L);
        assertThat(documentObjectDTO1).isNotEqualTo(documentObjectDTO2);
        documentObjectDTO1.setId(null);
        assertThat(documentObjectDTO1).isNotEqualTo(documentObjectDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(documentObjectMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(documentObjectMapper.fromId(null)).isNull();
    }
}
