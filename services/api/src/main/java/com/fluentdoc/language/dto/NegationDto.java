package com.fluentdoc.language.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NegationDto {

    @NotBlank(message = "Negation cannot be blank")
    private String negation;

}
