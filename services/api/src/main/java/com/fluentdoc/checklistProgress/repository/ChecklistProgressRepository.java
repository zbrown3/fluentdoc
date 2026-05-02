package com.fluentdoc.checklistProgress.repository;

import com.fluentdoc.checklistProgress.domain.ChecklistProgress;
import com.fluentdoc.checklistProgress.enums.ChecklistType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChecklistProgressRepository extends JpaRepository<ChecklistProgress, String> {

    Optional<ChecklistProgress> findByUserIdAndType(String userId, ChecklistType type);
}
