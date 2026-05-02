package com.fluentdoc.task.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    private String id;
    private String creatorId;
    private String task;
    private String dateCreated;
    private boolean completed;

    @PrePersist
    public void ensureId() {
        if (id == null || id.isBlank()) {
            id = java.util.UUID.randomUUID().toString();
        }
    }
}
