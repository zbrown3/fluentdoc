package com.fluentdoc.language.request;

import com.fluentdoc.language.enums.PrivacyLevel;
import lombok.Data;

@Data
public class LanguageSettingsRequest {
    private PrivacyLevel privacyLevel;
}
