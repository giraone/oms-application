package com.giraone.oms.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.giraone.oms.domain.enumeration.AccessType;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A document access entry (access control entry)
 */
@Entity
@Table(name = "document_access_entry")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DocumentAccessEntry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "access", nullable = false)
    private AccessType access;

    @Column(name = "until")
    private Instant until;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "owner" }, allowSetters = true)
    private DocumentObject document;

    @ManyToOne(optional = false)
    @NotNull
    private User grantee;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DocumentAccessEntry id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AccessType getAccess() {
        return this.access;
    }

    public DocumentAccessEntry access(AccessType access) {
        this.setAccess(access);
        return this;
    }

    public void setAccess(AccessType access) {
        this.access = access;
    }

    public Instant getUntil() {
        return this.until;
    }

    public DocumentAccessEntry until(Instant until) {
        this.setUntil(until);
        return this;
    }

    public void setUntil(Instant until) {
        this.until = until;
    }

    public DocumentObject getDocument() {
        return this.document;
    }

    public void setDocument(DocumentObject documentObject) {
        this.document = documentObject;
    }

    public DocumentAccessEntry document(DocumentObject documentObject) {
        this.setDocument(documentObject);
        return this;
    }

    public User getGrantee() {
        return this.grantee;
    }

    public void setGrantee(User user) {
        this.grantee = user;
    }

    public DocumentAccessEntry grantee(User user) {
        this.setGrantee(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

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
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DocumentAccessEntry{" +
            "id=" + getId() +
            ", access='" + getAccess() + "'" +
            ", until='" + getUntil() + "'" +
            "}";
    }
}
