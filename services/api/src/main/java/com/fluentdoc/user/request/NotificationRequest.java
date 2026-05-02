package com.fluentdoc.user.request;


import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class NotificationRequest {
    @NotEmpty(message = "notificationId cannot be blank.")
    private String notificationId;
}
