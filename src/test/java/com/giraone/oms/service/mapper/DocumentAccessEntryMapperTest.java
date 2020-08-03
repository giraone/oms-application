package com.giraone.oms.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class DocumentAccessEntryMapperTest {

    private DocumentAccessEntryMapper documentAccessEntryMapper;

    @BeforeEach
    public void setUp() {
        documentAccessEntryMapper = new DocumentAccessEntryMapperImpl();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(documentAccessEntryMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(documentAccessEntryMapper.fromId(null)).isNull();
    }
}
