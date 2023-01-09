package com.giraone.oms.domain;

import com.giraone.oms.domain.enumeration.DocumentPolicy;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A document entity.
 */
@Entity
@Table(name = "document_object")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DocumentObject implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
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
     * Simple policy to show attribute based access control
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "document_policy")
    private DocumentPolicy documentPolicy;

    @ManyToOne(optional = false)
    @NotNull
    private User owner;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DocumentObject id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPath() {
        return this.path;
    }

    public DocumentObject path(String path) {
        this.setPath(path);
        return this;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getName() {
        return this.name;
    }

    public DocumentObject name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPathUuid() {
        return this.pathUuid;
    }

    public DocumentObject pathUuid(String pathUuid) {
        this.setPathUuid(pathUuid);
        return this;
    }

    public void setPathUuid(String pathUuid) {
        this.pathUuid = pathUuid;
    }

    public String getNameUuid() {
        return this.nameUuid;
    }

    public DocumentObject nameUuid(String nameUuid) {
        this.setNameUuid(nameUuid);
        return this;
    }

    public void setNameUuid(String nameUuid) {
        this.nameUuid = nameUuid;
    }

    public String getMimeType() {
        return this.mimeType;
    }

    public DocumentObject mimeType(String mimeType) {
        this.setMimeType(mimeType);
        return this;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getObjectUrl() {
        return this.objectUrl;
    }

    public DocumentObject objectUrl(String objectUrl) {
        this.setObjectUrl(objectUrl);
        return this;
    }

    public void setObjectUrl(String objectUrl) {
        this.objectUrl = objectUrl;
    }

    public String getThumbnailUrl() {
        return this.thumbnailUrl;
    }

    public DocumentObject thumbnailUrl(String thumbnailUrl) {
        this.setThumbnailUrl(thumbnailUrl);
        return this;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public Long getByteSize() {
        return this.byteSize;
    }

    public DocumentObject byteSize(Long byteSize) {
        this.setByteSize(byteSize);
        return this;
    }

    public void setByteSize(Long byteSize) {
        this.byteSize = byteSize;
    }

    public Integer getNumberOfPages() {
        return this.numberOfPages;
    }

    public DocumentObject numberOfPages(Integer numberOfPages) {
        this.setNumberOfPages(numberOfPages);
        return this;
    }

    public void setNumberOfPages(Integer numberOfPages) {
        this.numberOfPages = numberOfPages;
    }

    public Instant getCreation() {
        return this.creation;
    }

    public DocumentObject creation(Instant creation) {
        this.setCreation(creation);
        return this;
    }

    public void setCreation(Instant creation) {
        this.creation = creation;
    }

    public Instant getLastContentModification() {
        return this.lastContentModification;
    }

    public DocumentObject lastContentModification(Instant lastContentModification) {
        this.setLastContentModification(lastContentModification);
        return this;
    }

    public void setLastContentModification(Instant lastContentModification) {
        this.lastContentModification = lastContentModification;
    }

    public DocumentPolicy getDocumentPolicy() {
        return this.documentPolicy;
    }

    public DocumentObject documentPolicy(DocumentPolicy documentPolicy) {
        this.setDocumentPolicy(documentPolicy);
        return this;
    }

    public void setDocumentPolicy(DocumentPolicy documentPolicy) {
        this.documentPolicy = documentPolicy;
    }

    public User getOwner() {
        return this.owner;
    }

    public void setOwner(User user) {
        this.owner = user;
    }

    public DocumentObject owner(User user) {
        this.setOwner(user);
        return this;
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
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
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
