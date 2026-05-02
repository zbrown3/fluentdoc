package com.fluentdoc.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

import static com.fluentdoc.common.util.Constants.DATE_FORMAT;

@Data
public class UserAccountDetailsDTO {
    private String id;
    private String name;
    private String email;
    private String password;
    private String socialLogin;
    private Map<String, Boolean> emailNotifications;
    @JsonFormat(pattern=DATE_FORMAT)
    private LocalDateTime dateCreated;
}
