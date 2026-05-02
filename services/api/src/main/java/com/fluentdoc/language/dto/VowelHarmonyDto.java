package com.fluentdoc.language.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VowelHarmonyDto {

    @NotBlank(message = "vowel harmony cannot be blank")
    private String vowelHarmony;

}
