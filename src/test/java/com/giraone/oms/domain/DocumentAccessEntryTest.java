package com.giraone.oms.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.giraone.oms.web.rest.TestUtil;

public class DocumentAccessEntryTest {

    @Test
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
}
