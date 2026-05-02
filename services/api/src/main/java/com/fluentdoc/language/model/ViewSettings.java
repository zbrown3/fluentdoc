package com.fluentdoc.language.model;

import lombok.Data;

import java.util.List;

@Data
public class ViewSettings {
    private boolean includeLanguageFlag;
    private boolean useFlagColors;

    private ColorSettings colors;
    private List<String> hiddenSections;
}

@Data
class ColorSettings {
    private String primary;
    private String secondary;
}


