package com.fluentdoc.story.model;

import com.fluentdoc.user.LocalUserIds;
import com.fluentdoc.common.service.EncryptionUtil;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "stories")
public class Story {
    @Id
    private String id;

    private LocalDateTime lastUpdated;
    private String lastUpdatedBy;
    private LocalDateTime dateCreated;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String title;
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String content;

    // Encrypt title field for story
    public String getTitle() {
        if (this.title == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.title);
    }

    public void setTitle(String title) {
        this.title = EncryptionUtil.encrypt(title);
    }


    // Encrypt content field for story
    public String getContent() {
        if (this.content == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.content);
    }

    public void setContent(String content) {
        this.content = EncryptionUtil.encrypt(content);
    }

    @PrePersist
    @PreUpdate
    public void beforeSave() {
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
        lastUpdated = LocalDateTime.now();
        if (dateCreated == null) {
            dateCreated = LocalDateTime.now();
        }
        lastUpdatedBy = LocalUserIds.DESKTOP_USER_ID;
    }

}

