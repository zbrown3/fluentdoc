package com.fluentdoc.language.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StressDto {

    @NotBlank(message = "Stress cannot be blank")
    public String stress;

}
