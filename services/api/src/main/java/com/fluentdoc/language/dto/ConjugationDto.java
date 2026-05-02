package com.fluentdoc.language.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConjugationDto {

    @NotBlank(message = "Conjugation cannot be blank")
    public String conjugation;
}
