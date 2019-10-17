package com.giraone.oms.service.dto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.giraone.oms.domain.DocumentObject} entity.
 */
@ApiModel(description = "A document entity.")
public class DocumentObjectDTO implements Serializable {

    private Long id;

    /**
     * A string with slashes for creating a primary folder structure
     */
    @NotNull
    @ApiModelProperty(value = "A string with slashes for creating a primary folder structure", required = true)
    private String path;

    /**
     * The name of the document, used by the author
     */
    @NotNull
    @ApiModelProperty(value = "The name of the document, used by the author", required = true)
    private String name;

    /**
     * The MIME type of the document
     */
    @ApiModelProperty(value = "The MIME type of the document")
    private String mimeType;

    /**
     * The URL of the document
     */
    @ApiModelProperty(value = "The URL of the document")
    private String objectUrl;

    /**
     * The URL to access a thumbnail of the document
     */
    @ApiModelProperty(value = "The URL to access a thumbnail of the document")
    private String thumbnailUrl;

    /**
     * Size in bytes of the document
     */
    @ApiModelProperty(value = "Size in bytes of the document")
    private Integer byteSize;

    /**
     * Number of pages of the document (if e.g. PDF). If not given, the document is not page oriented
     */
    @ApiModelProperty(value = "Number of pages of the document (if e.g. PDF). If not given, the document is not page oriented")
    private Integer numberOfPages;


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

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public Integer getByteSize() {
        return byteSize;
    }

    public void setByteSize(Integer byteSize) {
        this.byteSize = byteSize;
    }

    public Integer getNumberOfPages() {
        return numberOfPages;
    }

    public void setNumberOfPages(Integer numberOfPages) {
        this.numberOfPages = numberOfPages;
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
        return "DocumentObjectDTO{" +
            "id=" + getId() +
            ", path='" + getPath() + "'" +
            ", name='" + getName() + "'" +
            ", mimeType='" + getMimeType() + "'" +
            ", objectUrl='" + getObjectUrl() + "'" +
            ", thumbnailUrl='" + getThumbnailUrl() + "'" +
            ", byteSize=" + getByteSize() +
            ", numberOfPages=" + getNumberOfPages() +
            ", owner=" + getOwnerId() +
            "}";
    }
}
