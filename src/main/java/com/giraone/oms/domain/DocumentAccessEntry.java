package com.giraone.oms.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

import com.giraone.oms.domain.enumeration.AccessType;

/**
 * A document access entry (access control entry)
 */
@Entity
@Table(name = "document_access_entry")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class DocumentAccessEntry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "access", nullable = false)
    private AccessType access;

    @Column(name = "until")
    private Instant until;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("documentAccessEntries")
    private DocumentObject document;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("documentAccessEntries")
    private User grantee;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AccessType getAccess() {
        return access;
    }

    public DocumentAccessEntry access(AccessType access) {
        this.access = access;
        return this;
    }

    public void setAccess(AccessType access) {
        this.access = access;
    }

    public Instant getUntil() {
        return until;
    }

    public DocumentAccessEntry until(Instant until) {
        this.until = until;
        return this;
    }

    public void setUntil(Instant until) {
        this.until = until;
    }

    public DocumentObject getDocument() {
        return document;
    }

    public DocumentAccessEntry document(DocumentObject documentObject) {
        this.document = documentObject;
        return this;
    }

    public void setDocument(DocumentObject documentObject) {
        this.document = documentObject;
    }

    public User getGrantee() {
        return grantee;
    }

    public DocumentAccessEntry grantee(User user) {
        this.grantee = user;
        return this;
    }

    public void setGrantee(User user) {
        this.grantee = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DocumentAccessEntry)) {
            return false;
        }
        return id != null && id.equals(((DocumentAccessEntry) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "DocumentAccessEntry{" +
            "id=" + getId() +
            ", access='" + getAccess() + "'" +
            ", until='" + getUntil() + "'" +
            "}";
    }
}
