package com.fluentdoc.language.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Map;

@Data
public class AlphabetDto {

    @NotEmpty(message = "Alphabet cannot be blank")
    private Map<String, String> alphabet;
}
