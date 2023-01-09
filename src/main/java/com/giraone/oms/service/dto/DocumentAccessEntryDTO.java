package com.giraone.oms.service.dto;

import com.giraone.oms.domain.enumeration.AccessType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.giraone.oms.domain.DocumentAccessEntry} entity.
 */
@Schema(description = "A document access entry (access control entry)")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DocumentAccessEntryDTO implements Serializable {

    private Long id;

    @NotNull
    private AccessType access;

    private Instant until;

    private DocumentObjectDTO document;

    private UserDTO grantee;

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

    public DocumentObjectDTO getDocument() {
        return document;
    }

    public void setDocument(DocumentObjectDTO document) {
        this.document = document;
    }

    public UserDTO getGrantee() {
        return grantee;
    }

    public void setGrantee(UserDTO grantee) {
        this.grantee = grantee;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DocumentAccessEntryDTO)) {
            return false;
        }

        DocumentAccessEntryDTO documentAccessEntryDTO = (DocumentAccessEntryDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, documentAccessEntryDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DocumentAccessEntryDTO{" +
            "id=" + getId() +
            ", access='" + getAccess() + "'" +
            ", until='" + getUntil() + "'" +
            ", document=" + getDocument() +
            ", grantee=" + getGrantee() +
            "}";
    }
}
