package com.fluentdoc.export.request;

import lombok.Data;

@Data
public class DocumentExportRequest {
    private boolean includeLanguageGuide;
    private boolean includeDictionaryInGuide;
    private boolean includePhraseBookInGuide;
    private ExportSection standaloneDictionary;
    private ExportSection standalonePhraseBook;

    @Data
    public static class ExportSection {
        private boolean include;
        private String exportType; // PDF, CSV, etc.
    }
}
