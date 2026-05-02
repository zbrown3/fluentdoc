package com.fluentdoc.fileImport.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PhraseEntry {
    private String phrase;
    private String pronunciation;
    private String meaning;
    private String notes;
}
