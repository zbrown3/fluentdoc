package com.fluentdoc.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fluentdoc.user.enums.Experience;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;

import static com.fluentdoc.common.util.Constants.DATE_FORMAT;

@Data
public class LanguageCreatorDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String id;
    private String username;
    private String displayName;
    private String profileImageUrl;
    private String bio;
    private Experience experience;
    @JsonFormat(pattern=DATE_FORMAT)
    private LocalDateTime dateCreated;
    @JsonFormat(pattern=DATE_FORMAT)
    private LocalDateTime lastLogin;
    private Map<String, String> avatarProps;

}
