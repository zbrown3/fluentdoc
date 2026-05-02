package com.fluentdoc.language.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CollaboratorDto {

    @NotBlank(message = "Collaborator cannot be blank")
    private String name;
    @NotBlank(message = "Action cannot be blank")
    @Pattern(regexp = "^($|add|delete|Add|Delete)$", message = "Action is invalid")
    private String action;
}
