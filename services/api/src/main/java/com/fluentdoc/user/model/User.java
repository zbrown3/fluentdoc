package com.fluentdoc.user.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fluentdoc.common.util.RoleDeserializer;
import com.fluentdoc.user.LocalUserIds;
import com.fluentdoc.language.model.Language;
import com.fluentdoc.user.enums.Experience;
import com.fluentdoc.user.enums.Reason;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.fluentdoc.common.util.Constants.DATE_FORMAT;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    private String id;

    private LocalDateTime lastUpdated;
    private String lastUpdatedBy;

    @Email(message = "Invalid Email.")
    @NotBlank(message = "Email cannot be blank.")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Password cannot be blank.")
    private String password;

    @Column(unique = true)
    private String username;
    private String displayName;

    private String securityQuestion;
    private String securityAnswer;

    private String profileImageUrl;

    private String name;

    private String bio;

    @JsonFormat(pattern=DATE_FORMAT)
    private LocalDateTime dateCreated;

    @JsonFormat(pattern=DATE_FORMAT)
    private LocalDateTime lastLogin;

    @JdbcTypeCode(SqlTypes.JSON)
    @JsonDeserialize(using = RoleDeserializer.class)
    private List<String> roles;

    @ManyToMany
    @JoinTable(
            name = "user_languages",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "language_id")
    )
    private List<Language> languages;

    @Enumerated(EnumType.STRING)
    private Experience experience;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<Reason> reasons;

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Boolean> emailNotifications = Map.of();

    private String socialLogin;

    @JdbcTypeCode(SqlTypes.JSON)
    private HashMap<String, Object> tags = new HashMap<>();

    public User() {}

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
