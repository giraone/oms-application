package com.giraone.oms.repository;
import com.giraone.oms.domain.DocumentObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the DocumentObject entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DocumentObjectRepository extends JpaRepository<DocumentObject, Long> {

    @Query("select documentObject from DocumentObject documentObject where documentObject.owner.login = ?#{principal.username}")
    List<DocumentObject> findByOwnerIsCurrentUser();

    @Query("select documentObject from DocumentObject documentObject where documentObject.owner.id = ?1 or documentObject.documentPolicy = 'PUBLIC'")
    Page<DocumentObject> findByAllowedAccess(long userId, Pageable pageable);

    @Query("select documentObject from DocumentObject documentObject where documentObject.pathUuid = ?1 and documentObject.nameUuid = ?2")
    Optional<DocumentObject> findByPathUuidAndNameUuid(String pathUuid, String nameUuid);
}
