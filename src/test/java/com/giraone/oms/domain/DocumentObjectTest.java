package com.giraone.oms.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.giraone.oms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DocumentObjectTest {

    @Test
    void equalsVerifier() throws Exception {
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
}
