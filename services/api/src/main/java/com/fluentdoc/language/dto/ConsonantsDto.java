package com.fluentdoc.language.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Map;

@Data
public class ConsonantsDto {

    @NotEmpty(message = "Consonants cannot be blank")
    private Map<String, Boolean> consonants;

    private String description;
}
