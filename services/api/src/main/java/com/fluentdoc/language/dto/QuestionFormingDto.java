package com.fluentdoc.language.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionFormingDto {

    @NotBlank(message = "Question Forming info cannot be blank")
    public String QuestionFormingInfo;
}
