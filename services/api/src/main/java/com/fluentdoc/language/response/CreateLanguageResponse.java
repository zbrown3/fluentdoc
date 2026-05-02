package com.fluentdoc.language.response;

import com.fluentdoc.language.model.Language;
import lombok.Data;

@Data
public class CreateLanguageResponse {
    private Language language;
    private boolean isFirstLanguage;
}
