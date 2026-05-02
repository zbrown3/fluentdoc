package com.fluentdoc.checklistProgress.domain;

import com.fluentdoc.checklistProgress.enums.ChecklistType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Data
@Entity
@Table(name = "checklist_progress")
public class ChecklistProgress {
    @Id
    private String id;

    private String userId;
    @Enumerated(EnumType.STRING)
    private ChecklistType type;

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Boolean> steps; // e.g. { "createLanguage": true, "addPhonology": false }

    private boolean isComplete;

    public ChecklistProgress() {
    }

    public ChecklistProgress(String userId, ChecklistType type, Map<String, Boolean> steps) {
        this.userId = userId;
        this.type = type;
        this.steps = steps;
        this.isComplete = false;
    }

    @PrePersist
    public void ensureId() {
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
    }
}
