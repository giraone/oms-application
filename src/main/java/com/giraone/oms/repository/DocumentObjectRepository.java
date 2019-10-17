package com.giraone.oms.repository;
import com.giraone.oms.domain.DocumentObject;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the DocumentObject entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DocumentObjectRepository extends JpaRepository<DocumentObject, Long> {

    @Query("select documentObject from DocumentObject documentObject where documentObject.owner.login = ?#{principal.username}")
    List<DocumentObject> findByOwnerIsCurrentUser();

}
