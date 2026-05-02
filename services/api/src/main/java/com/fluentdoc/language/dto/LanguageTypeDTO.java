package com.fluentdoc.language.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public class LanguageTypeDTO {
    private String name;
    private String description;
}
