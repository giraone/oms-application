package com.giraone.oms.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class DocumentObjectMapperTest {

    private DocumentObjectMapper documentObjectMapper;

    @BeforeEach
    public void setUp() {
        documentObjectMapper = new DocumentObjectMapperImpl();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(documentObjectMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(documentObjectMapper.fromId(null)).isNull();
    }
}
