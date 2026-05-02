package com.fluentdoc.language.request;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class NumeralSystemRequest {

    // make sure only one of three handlers can be passed in
    @Pattern(regexp = "^(description|base|numerals)$")
    private String handler;
    private String numeralDescription;
    private String baseNumber;
    private List<Map<String, String>> numerals;
}
