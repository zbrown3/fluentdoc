package com.fluentdoc.language.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DiphthongsDto {

    @NotBlank(message = "Diphthongs cannot be blank")
    public String Diphthongs;
}
