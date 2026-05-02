package com.fluentdoc.user.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserPasswordRequest {

    // TODO: add password regex for validation
    @NotBlank(message = "Current Password cannot be blank")
    private String currentPassword;

    @NotBlank(message = "New Password cannot be blank")
    private String newPassword;
}

