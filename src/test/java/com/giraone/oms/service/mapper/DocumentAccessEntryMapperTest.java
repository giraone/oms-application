package com.giraone.oms.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DocumentAccessEntryMapperTest {

    private DocumentAccessEntryMapper documentAccessEntryMapper;

    @BeforeEach
    public void setUp() {
        documentAccessEntryMapper = new DocumentAccessEntryMapperImpl();
    }
}
