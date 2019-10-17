package com.giraone.oms.repository;
import com.giraone.oms.domain.DocumentAccessEntry;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the DocumentAccessEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DocumentAccessEntryRepository extends JpaRepository<DocumentAccessEntry, Long> {

    @Query("select documentAccessEntry from DocumentAccessEntry documentAccessEntry where documentAccessEntry.grantee.login = ?#{principal.username}")
    List<DocumentAccessEntry> findByGranteeIsCurrentUser();

}
