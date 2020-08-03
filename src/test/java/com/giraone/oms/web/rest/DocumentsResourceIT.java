package com.giraone.oms.web.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.giraone.oms.OmsApp;
import com.giraone.oms.domain.DocumentObject;
import com.giraone.oms.repository.DocumentObjectRepository;
import com.giraone.oms.security.AuthoritiesConstants;
import com.giraone.oms.service.dto.DocumentObjectDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.Collections;
import java.util.List;

import static com.giraone.oms.testutil.RegexMatcher.matchesRegex;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for the {@link DocumentObjectResource} REST controller.
 */
@SpringBootTest(classes = OmsApp.class)
@WithMockUser(username = "user", authorities = {AuthoritiesConstants.USER})
public class DocumentsResourceIT {

    private static final String BASE_URL = "/api/documents";

    private static final UserDetails DEFAULT_USER_USER = new org.springframework.security.core.userdetails.User(
        "user", "", Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.USER)));

    @Autowired
    private WebApplicationContext wac;
    @Autowired
    private DocumentObjectRepository documentObjectRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();
    }

    @Test
    @Transactional
    public void assertThat_create_works_basically() throws Exception {

        // arrange
        int databaseSizeBeforeCreate = documentObjectRepository.findAll().size();

        String name = "file001";

        // act/assert
        DocumentObjectDTO documentObjectDTO = new DocumentObjectDTO();
        documentObjectDTO.setPath("folder001");
        documentObjectDTO.setName(name);

        String json = mockMvc.perform(post(BASE_URL)
            .with(user(DEFAULT_USER_USER))
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(documentObjectDTO)))
            .andDo(print())
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value(name))
            .andExpect(jsonPath("$.path").isNotEmpty())
            .andExpect(jsonPath("$.objectUrl").isNotEmpty())
            .andExpect(jsonPath("$.objectUrl", matchesRegex("http.*/content.*")))
            .andExpect(jsonPath("$.ownerId").value(4)) // TODO
            .andReturn().getResponse().getContentAsString()
        ;

        DocumentObjectDTO returnedDocumentObjectDTO = objectMapper.readValue(json, DocumentObjectDTO.class);
        assertThat(returnedDocumentObjectDTO).isNotNull();

        // assert
        List<DocumentObject> documentObjectList = documentObjectRepository.findAll();
        assertThat(documentObjectList).hasSize(databaseSizeBeforeCreate + 1);
    }
}
