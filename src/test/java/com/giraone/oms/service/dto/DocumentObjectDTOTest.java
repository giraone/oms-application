package com.giraone.oms.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.giraone.oms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DocumentObjectDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
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
}
