package com.fluentdoc.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fluentdoc.common.util.RoleDeserializer;
import com.fluentdoc.language.dto.LanguageInfoDto;
import com.fluentdoc.user.enums.Experience;
import lombok.Data;
import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.fluentdoc.common.util.Constants.DATE_FORMAT;

@Data
public class UserProfileDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String id;
    private String email;
    private Experience experience;
    private String username;
    private String displayName;
    private String bio;
    private String website;
    private String location;
    private String profileImageUrl;
    private int numberOfLanguages;
    private int numberOfWords;
    private int numberOfPhrases;
    @JsonFormat(pattern=DATE_FORMAT)
    private LocalDateTime dateCreated;
    @JsonFormat(pattern=DATE_FORMAT)
    private LocalDateTime lastLogin;
    @JsonDeserialize(using = RoleDeserializer.class)
    private List<String> roles;
    private List<LanguageInfoDto> languages = new ArrayList<>();
}
