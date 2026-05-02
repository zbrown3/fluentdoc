package com.fluentdoc.fileImport.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DictionaryEntry {
    private String word;
    private String pronunciation;
    private String meaning;
    private String pos;
    private String notes;
}
