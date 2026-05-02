package com.fluentdoc.language.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class IntroductionDto {

    @NotEmpty(message = "Cannot save blank Introduction")
    private String introduction;
}
