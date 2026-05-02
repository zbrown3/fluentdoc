package com.fluentdoc.user.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class NotificationSettingsRequest {
    @NotBlank(message = "userId cannot be blank")
    private String userId;

    @NotNull(message = "notifications cannot be null")
    private Map<String, Boolean> notifications;
}
