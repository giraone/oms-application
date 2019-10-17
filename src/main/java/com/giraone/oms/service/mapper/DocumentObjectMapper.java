package com.giraone.oms.service.mapper;

import com.giraone.oms.domain.*;
import com.giraone.oms.service.dto.DocumentObjectDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link DocumentObject} and its DTO {@link DocumentObjectDTO}.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface DocumentObjectMapper extends EntityMapper<DocumentObjectDTO, DocumentObject> {

    @Mapping(source = "owner.id", target = "ownerId")
    DocumentObjectDTO toDto(DocumentObject documentObject);

    @Mapping(source = "ownerId", target = "owner")
    DocumentObject toEntity(DocumentObjectDTO documentObjectDTO);

    default DocumentObject fromId(Long id) {
        if (id == null) {
            return null;
        }
        DocumentObject documentObject = new DocumentObject();
        documentObject.setId(id);
        return documentObject;
    }
}
