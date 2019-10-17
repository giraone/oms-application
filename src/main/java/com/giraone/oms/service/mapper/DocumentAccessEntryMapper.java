package com.giraone.oms.service.mapper;

import com.giraone.oms.domain.*;
import com.giraone.oms.service.dto.DocumentAccessEntryDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link DocumentAccessEntry} and its DTO {@link DocumentAccessEntryDTO}.
 */
@Mapper(componentModel = "spring", uses = {DocumentObjectMapper.class, UserMapper.class})
public interface DocumentAccessEntryMapper extends EntityMapper<DocumentAccessEntryDTO, DocumentAccessEntry> {

    @Mapping(source = "document.id", target = "documentId")
    @Mapping(source = "grantee.id", target = "granteeId")
    DocumentAccessEntryDTO toDto(DocumentAccessEntry documentAccessEntry);

    @Mapping(source = "documentId", target = "document")
    @Mapping(source = "granteeId", target = "grantee")
    DocumentAccessEntry toEntity(DocumentAccessEntryDTO documentAccessEntryDTO);

    default DocumentAccessEntry fromId(Long id) {
        if (id == null) {
            return null;
        }
        DocumentAccessEntry documentAccessEntry = new DocumentAccessEntry();
        documentAccessEntry.setId(id);
        return documentAccessEntry;
    }
}
