package com.giraone.oms.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

import com.giraone.oms.domain.enumeration.DocumentPolicy;

/**
 * A document entity.
 */
@Entity
@Table(name = "document_object")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DocumentObject implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * The folder structure of the object using human readable path components
     */
    @NotNull
    @Column(name = "path", nullable = false)
    private String path;

    /**
     * The human readable name of the document
     */
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * The folder structure as an internal UUID
     */
    @NotNull
    @Column(name = "path_uuid", nullable = false)
    private String pathUuid;

    /**
     * The name of the document as an internal UUID
     */
    @NotNull
    @Column(name = "name_uuid", nullable = false)
    private String nameUuid;

    /**
     * The MIME type of the document
     */
    @Column(name = "mime_type")
    private String mimeType;

    /**
     * The S3 object key to access the document
     */
    @Size(max = 1024)
    @Column(name = "object_url", length = 1024)
    private String objectUrl;

    /**
     * The S3 object key to access a thumbnail of the document
     */
    @Size(max = 1024)
    @Column(name = "thumbnail_url", length = 1024)
    private String thumbnailUrl;

    /**
     * Size in bytes of the document
     */
    @Column(name = "byte_size")
    private Long byteSize;

    /**
     * Number of pages of the document (if e.g. PDF). If not given, the document is not page oriented
     */
    @Column(name = "number_of_pages")
    private Integer numberOfPages;

    /**
     * Timestamp of creation
     */
    @Column(name = "creation")
    private Instant creation;

    /**
     * Timestamp of last content modification
     */
    @Column(name = "last_content_modification")
    private Instant lastContentModification;

    /**
     * Simple policy to show attribute based access controls
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "document_policy")
    private DocumentPolicy documentPolicy;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "documentObjects", allowSetters = true)
    private User owner;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public DocumentObject path(String path) {
        this.path = path;
        return this;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getName() {
        return name;
    }

    public DocumentObject name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPathUuid() {
        return pathUuid;
    }

    public DocumentObject pathUuid(String pathUuid) {
        this.pathUuid = pathUuid;
        return this;
    }

    public void setPathUuid(String pathUuid) {
        this.pathUuid = pathUuid;
    }

    public String getNameUuid() {
        return nameUuid;
    }

    public DocumentObject nameUuid(String nameUuid) {
        this.nameUuid = nameUuid;
        return this;
    }

    public void setNameUuid(String nameUuid) {
        this.nameUuid = nameUuid;
    }

    public String getMimeType() {
        return mimeType;
    }

    public DocumentObject mimeType(String mimeType) {
        this.mimeType = mimeType;
        return this;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getObjectUrl() {
        return objectUrl;
    }

    public DocumentObject objectUrl(String objectUrl) {
        this.objectUrl = objectUrl;
        return this;
    }

    public void setObjectUrl(String objectUrl) {
        this.objectUrl = objectUrl;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public DocumentObject thumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
        return this;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public Long getByteSize() {
        return byteSize;
    }

    public DocumentObject byteSize(Long byteSize) {
        this.byteSize = byteSize;
        return this;
    }

    public void setByteSize(Long byteSize) {
        this.byteSize = byteSize;
    }

    public Integer getNumberOfPages() {
        return numberOfPages;
    }

    public DocumentObject numberOfPages(Integer numberOfPages) {
        this.numberOfPages = numberOfPages;
        return this;
    }

    public void setNumberOfPages(Integer numberOfPages) {
        this.numberOfPages = numberOfPages;
    }

    public Instant getCreation() {
        return creation;
    }

    public DocumentObject creation(Instant creation) {
        this.creation = creation;
        return this;
    }

    public void setCreation(Instant creation) {
        this.creation = creation;
    }

    public Instant getLastContentModification() {
        return lastContentModification;
    }

    public DocumentObject lastContentModification(Instant lastContentModification) {
        this.lastContentModification = lastContentModification;
        return this;
    }

    public void setLastContentModification(Instant lastContentModification) {
        this.lastContentModification = lastContentModification;
    }

    public DocumentPolicy getDocumentPolicy() {
        return documentPolicy;
    }

    public DocumentObject documentPolicy(DocumentPolicy documentPolicy) {
        this.documentPolicy = documentPolicy;
        return this;
    }

    public void setDocumentPolicy(DocumentPolicy documentPolicy) {
        this.documentPolicy = documentPolicy;
    }

    public User getOwner() {
        return owner;
    }

    public DocumentObject owner(User user) {
        this.owner = user;
        return this;
    }

    public void setOwner(User user) {
        this.owner = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DocumentObject)) {
            return false;
        }
        return id != null && id.equals(((DocumentObject) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DocumentObject{" +
            "id=" + getId() +
            ", path='" + getPath() + "'" +
            ", name='" + getName() + "'" +
            ", pathUuid='" + getPathUuid() + "'" +
            ", nameUuid='" + getNameUuid() + "'" +
            ", mimeType='" + getMimeType() + "'" +
            ", objectUrl='" + getObjectUrl() + "'" +
            ", thumbnailUrl='" + getThumbnailUrl() + "'" +
            ", byteSize=" + getByteSize() +
            ", numberOfPages=" + getNumberOfPages() +
            ", creation='" + getCreation() + "'" +
            ", lastContentModification='" + getLastContentModification() + "'" +
            ", documentPolicy='" + getDocumentPolicy() + "'" +
            "}";
    }
}
