package com.fluentdoc.language.dto;


import com.fluentdoc.common.util.CommonRegexPatterns;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SyntaxDto {

    @Pattern(regexp = CommonRegexPatterns.WORD_ORDER_REGEX, message = "Invalid word order")
    @NotBlank(message = "Language word order cannot be blank")
    private String wordOrder;
    private String syntax;
}
