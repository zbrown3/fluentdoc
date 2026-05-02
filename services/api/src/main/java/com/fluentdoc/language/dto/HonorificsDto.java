package com.fluentdoc.language.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HonorificsDto {

    @NotBlank(message = "Honorifics cannot be blank")
    public String honorifics;
}
