package com.giraone.oms.service.dto;

import io.swagger.annotations.ApiModel;
import java.time.Instant;
import javax.validation.constraints.*;
import java.io.Serializable;
import com.giraone.oms.domain.enumeration.AccessType;

/**
 * A DTO for the {@link com.giraone.oms.domain.DocumentAccessEntry} entity.
 */
@ApiModel(description = "A document access entry (access control entry)")
public class DocumentAccessEntryDTO implements Serializable {
    
    private Long id;

    @NotNull
    private AccessType access;

    private Instant until;


    private Long documentId;

    private Long granteeId;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AccessType getAccess() {
        return access;
    }

    public void setAccess(AccessType access) {
        this.access = access;
    }

    public Instant getUntil() {
        return until;
    }

    public void setUntil(Instant until) {
        this.until = until;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentObjectId) {
        this.documentId = documentObjectId;
    }

    public Long getGranteeId() {
        return granteeId;
    }

    public void setGranteeId(Long userId) {
        this.granteeId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DocumentAccessEntryDTO)) {
            return false;
        }

        return id != null && id.equals(((DocumentAccessEntryDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DocumentAccessEntryDTO{" +
            "id=" + getId() +
            ", access='" + getAccess() + "'" +
            ", until='" + getUntil() + "'" +
            ", documentId=" + getDocumentId() +
            ", granteeId=" + getGranteeId() +
            "}";
    }
}
