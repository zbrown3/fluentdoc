package com.fluentdoc.language.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Map;

@Data
public class VowelsDto {

    @NotEmpty(message = "Vowels cannot be blank")
    private Map<String, Boolean> vowels;

    private String description;

}
