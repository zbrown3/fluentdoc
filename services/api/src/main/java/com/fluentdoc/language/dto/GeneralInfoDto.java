package com.fluentdoc.language.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;


@Data
public class GeneralInfoDto {

    @NotBlank(message = "Language Name cannot be blank")
    private String name;

    @NotBlank(message = "Language Description cannot be blank")
    private String description;

    @NotEmpty(message = "Language Type cannot be blank")
    private List<String> types;

    @NotEmpty(message = "Language Reasons cannot be blank")
    private List<String> reasons;
}
