package com.giraone.oms.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.giraone.oms.web.rest.TestUtil;

public class DocumentAccessEntryDTOTest {

    @Test
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
}
