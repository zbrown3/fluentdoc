package com.fluentdoc.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fluentdoc.common.util.RoleDeserializer;
import com.fluentdoc.language.dto.LanguageInfoDto;
import lombok.Data;
import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import static com.fluentdoc.common.util.Constants.DATE_FORMAT;

@Data
public class UserDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String id;
    private String name;
    private String email;
    @JsonFormat(pattern=DATE_FORMAT)
    private LocalDateTime dateCreated;
    @JsonFormat(pattern=DATE_FORMAT)
    private LocalDateTime lastLogin;
    @JsonDeserialize(using = RoleDeserializer.class)
    private List<String> roles;
    private List<LanguageInfoDto> languages;
}
