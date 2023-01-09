package com.giraone.oms.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DocumentObjectMapperTest {

    private DocumentObjectMapper documentObjectMapper;

    @BeforeEach
    public void setUp() {
        documentObjectMapper = new DocumentObjectMapperImpl();
    }
}
