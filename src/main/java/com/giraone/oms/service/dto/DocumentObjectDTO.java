package com.giraone.oms.service.dto;

import com.giraone.oms.domain.enumeration.DocumentPolicy;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * A DTO for the {@link com.giraone.oms.domain.DocumentObject} entity.
 */
@Schema(description = "A document entity.")
public class DocumentObjectDTO implements Serializable {

    private Long id;

    /**
     * The folder structure of the object using human readable path components
     */
    @NotNull
    @Schema(description = "The folder structure of the object using human readable path components", required = true)
    private String path;

    /**
     * The human readable name of the document
     */
    @NotNull
    @Schema(description = "The human readable name of the document", required = true)
    private String name;

    /**
     * The folder structure as an internal UUID
     */
    @Schema(description = "The folder structure as an internal UUID", required = true)
    private String pathUuid;

    /**
     * The name of the document as an internal UUID
     */
    @Schema(description = "The name of the document as an internal UUID", required = true)
    private String nameUuid;

    /**
     * The MIME type of the document
     */
    @Schema(description = "The MIME type of the document")
    private String mimeType;

    /**
     * The S3 object key to access the document (read access)
     */
    @Size(max = 1024)
    @Schema(description = "The S3 object key to access the document")
    private String objectUrl;

    /**
     * The S3 object key to create/update the document (write access)
     */
    @Size(max = 1024)
    @Schema(description = "The S3 object key to update the document")
    private String objectWriteUrl;

    /**
     * The S3 object key to access a thumbnail of the document
     */
    @Size(max = 1024)
    @Schema(description = "The S3 object key to access a thumbnail of the document")
    private String thumbnailUrl;

    /**
     * Size in bytes of the document
     */
    @Schema(description = "Size in bytes of the document")
    private Long byteSize;

    /**
     * Number of pages of the document (if e.g. PDF). If not given, the document is not page oriented
     */
    @Schema(description = "Number of pages of the document (if e.g. PDF). If not given, the document is not page oriented")
    private Integer numberOfPages;

    /**
     * Timestamp of creation
     */
    @Schema(description = "Timestamp of creation")
    private Instant creation;

    /**
     * Timestamp of last content modification
     */
    @Schema(description = "Timestamp of last content modification")
    private Instant lastContentModification;

    /**
     * Simple policy to show attribute based access control
     */
    @Schema(description = "Simple policy to show attribute based access control")
    private DocumentPolicy documentPolicy;

    private Long ownerId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPathUuid() {
        return pathUuid;
    }

    public void setPathUuid(String pathUuid) {
        this.pathUuid = pathUuid;
    }

    public String getNameUuid() {
        return nameUuid;
    }

    public void setNameUuid(String nameUuid) {
        this.nameUuid = nameUuid;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getObjectUrl() {
        return objectUrl;
    }

    public void setObjectUrl(String objectUrl) {
        this.objectUrl = objectUrl;
    }

    public String getObjectWriteUrl() {
        return objectWriteUrl;
    }

    public void setObjectWriteUrl(String objectWriteUrl) {
        this.objectWriteUrl = objectWriteUrl;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public Long getByteSize() {
        return byteSize;
    }

    public void setByteSize(Long byteSize) {
        this.byteSize = byteSize;
    }

    public Integer getNumberOfPages() {
        return numberOfPages;
    }

    public void setNumberOfPages(Integer numberOfPages) {
        this.numberOfPages = numberOfPages;
    }

    public Instant getCreation() {
        return creation;
    }

    public void setCreation(Instant creation) {
        this.creation = creation;
    }

    public Instant getLastContentModification() {
        return lastContentModification;
    }

    public void setLastContentModification(Instant lastContentModification) {
        this.lastContentModification = lastContentModification;
    }

    public DocumentPolicy getDocumentPolicy() {
        return documentPolicy;
    }

    public void setDocumentPolicy(DocumentPolicy documentPolicy) {
        this.documentPolicy = documentPolicy;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long userId) {
        this.ownerId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        DocumentObjectDTO documentObjectDTO = (DocumentObjectDTO) o;
        if (documentObjectDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), documentObjectDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return (
            "DocumentObjectDTO{" +
            "id=" +
            getId() +
            ", path='" +
            getPath() +
            "'" +
            ", name='" +
            getName() +
            "'" +
            ", pathUuid='" +
            getPathUuid() +
            "'" +
            ", nameUuid='" +
            getNameUuid() +
            "'" +
            ", mimeType='" +
            getMimeType() +
            "'" +
            ", objectUrl='" +
            getObjectUrl() +
            "'" +
            ", getObjectWriteUrl='" +
            getObjectWriteUrl() +
            "'" +
            ", thumbnailUrl='" +
            getThumbnailUrl() +
            "'" +
            ", byteSize=" +
            getByteSize() +
            ", numberOfPages=" +
            getNumberOfPages() +
            ", creation='" +
            getCreation() +
            "'" +
            ", lastContentModification='" +
            getLastContentModification() +
            "'" +
            ", owner=" +
            getOwnerId() +
            "}"
        );
    }

    //------------------------------------------------------------------------------------------------------------------

    public boolean hasObject() {
        return this.getNumberOfPages() > 0;
    }

    public boolean hasThumbnail() {
        return this.getThumbnailUrl() != null || this.getThumbnailUrl().trim().length() > 0;
    }

    public String getObjectKey() {
        return this.getPathUuid() + "/" + this.getNameUuid() + "/content";
    }

    public String getThumbnailKey() {
        return this.getPathUuid() + "/" + this.getNameUuid() + "/thumb-0001.jpg";
    }

    public void buildObjectUrl() {
        this.setObjectUrl(this.getObjectKey());
    }

    public void buildThumbnailUrl() {
        this.setThumbnailUrl(this.getThumbnailKey());
    }

    public String dump() {
        return (
            "{" +
            "id=" +
            getId() +
            ", path='" +
            getPath() +
            "'" +
            ", name='" +
            getName() +
            "'" +
            ", pathUuid='" +
            getPathUuid() +
            "'" +
            ", nameUuid='" +
            getNameUuid() +
            "'" +
            ", objectUrl='" +
            getObjectUrl() +
            "'" +
            ", thumbnailUrl='" +
            getThumbnailUrl() +
            "'" +
            ", owner=" +
            getOwnerId() +
            "}"
        );
    }
}
