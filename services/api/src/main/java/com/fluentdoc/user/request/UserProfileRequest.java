package com.fluentdoc.user.request;

import com.fluentdoc.user.enums.Experience;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserProfileRequest {
    @Size(min=3, max=16, message = "Username must be between 3 and 16 characters.")
    // regex to allow no spaces and only -, .,_ ' characters plus alphanumeric
    @Pattern(regexp = "^[a-zA-Z0-9-.,_']+$", message = "Username must contain only alphanumeric characters and -.,_'")
    private String username;

    @NotBlank(message = "Display name cannot be blank.")
    private String displayName;
    private Experience experience;

    @Size(max=250, message = "About me must be less than 250 characters")
    private String bio;

    private String profileImageUrl;
    private String location;
    private String website;
}
