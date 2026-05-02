package com.fluentdoc.language.response;

import com.fluentdoc.language.model.Language;
import lombok.Data;

import java.util.Map;

@Data
public class LanguageViewResponse {
    private Language language;
    private Map<String, Object> limits;
    private Map<String, Object> usage;
}