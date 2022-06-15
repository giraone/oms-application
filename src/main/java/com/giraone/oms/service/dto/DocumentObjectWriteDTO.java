package com.giraone.oms.service.dto;

import com.giraone.oms.domain.enumeration.DocumentPolicy;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import javax.validation.constraints.NotNull;

/**
 * A DTO for the creating/updating a {@link com.giraone.oms.domain.DocumentObject} entity.
 */
@Schema(description = "A document entity.")
public class DocumentObjectWriteDTO implements Serializable {

    private Long id;

    /**
     * The human readable name of the document
     */
    @NotNull
    @Schema(description = "The human readable name of the document", required = true)
    private String name;

    /**
     * The folder structure of the object using human readable path components
     */
    @NotNull
    @Schema(description = "The folder structure of the object using human readable path components. Default = /.")
    private String path = "/";

    /**
     * Simple policy to show attribute based access control
     */
    @Schema(description = "Simple policy to show attribute based access control")
    private DocumentPolicy documentPolicy;

    //------------------------------------------------------------------------------------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public DocumentPolicy getDocumentPolicy() {
        return documentPolicy;
    }

    public void setDocumentPolicy(DocumentPolicy documentPolicy) {
        this.documentPolicy = documentPolicy;
    }

    @Override
    public String toString() {
        return (
            "DocumentObjectWriteDTO{" +
            "id=" +
            id +
            ", name='" +
            name +
            '\'' +
            ", path='" +
            path +
            '\'' +
            ", documentPolicy=" +
            documentPolicy +
            '}'
        );
    }
}
