package com.fluentdoc.language.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PhonologicalConstraintsDto {

    @NotBlank(message = "Constraints cannot be blank")
    private String constraints;

}
