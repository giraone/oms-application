package com.giraone.oms.service.mapper;

import com.giraone.oms.domain.DocumentAccessEntry;
import com.giraone.oms.domain.DocumentObject;
import com.giraone.oms.domain.User;
import com.giraone.oms.service.dto.DocumentAccessEntryDTO;
import com.giraone.oms.service.dto.DocumentObjectDTO;
import com.giraone.oms.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link DocumentAccessEntry} and its DTO {@link DocumentAccessEntryDTO}.
 */
@Mapper(componentModel = "spring")
public interface DocumentAccessEntryMapper extends EntityMapper<DocumentAccessEntryDTO, DocumentAccessEntry> {
    @Mapping(target = "document", source = "document", qualifiedByName = "documentObjectId")
    @Mapping(target = "grantee", source = "grantee", qualifiedByName = "userId")
    DocumentAccessEntryDTO toDto(DocumentAccessEntry s);

    @Named("documentObjectId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    DocumentObjectDTO toDtoDocumentObjectId(DocumentObject documentObject);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);
}
