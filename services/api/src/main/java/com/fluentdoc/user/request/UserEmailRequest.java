package com.fluentdoc.user.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserEmailRequest {
    @Email(message = "Invalid Email")
    @NotBlank(message = "Email cannot be blank")
    private String email;
}
