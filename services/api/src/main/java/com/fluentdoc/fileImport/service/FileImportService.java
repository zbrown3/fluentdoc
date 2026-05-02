package com.fluentdoc.fileImport.service;

import com.fluentdoc.fileImport.model.DictionaryEntry;
import com.fluentdoc.fileImport.model.PhraseEntry;
import com.fluentdoc.language.model.Language;
import com.fluentdoc.language.service.LanguageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
@Slf4j
public class FileImportService {

    private final LanguageService languageService;

    public FileImportService(LanguageService languageService) {
        this.languageService = languageService;
    }

    /**
     * Processes the upload file asynchronously
     */
    public HashMap<String, Object> processDictionaryUpload(MultipartFile file, String languageId) {
        log.info("Processing dictionary upload file");

        long startTime = System.currentTimeMillis();

        HashMap<String, Object> response = new HashMap<>();

        try {
            List<DictionaryEntry> entries = FileParser.parseDictionaryFile(file);

            List<Map<String, String>> vocabEntries = new ArrayList<>();
            for (DictionaryEntry entry : entries) {
                vocabEntries.add(Map.of(
                        "word", entry.getWord() != null ? entry.getWord() : "",
                        "pronunciation", entry.getPronunciation() != null ? entry.getPronunciation() : "",
                        "meaning", entry.getMeaning() != null ? entry.getMeaning() : "",
                        "pos", entry.getPos() != null ? entry.getPos() : "",
                        "notes", entry.getNotes() != null ? entry.getNotes() : ""
                ));
            }

            Language updatedLanguage = languageService.addEntriesToLanguage(languageId, vocabEntries);
            log.info("Completed processing dictionary upload file");

            long endTime = System.currentTimeMillis();
            log.info("Time taken to process file with {} words: {}ms", vocabEntries.size(), endTime - startTime);

            response.put("language", updatedLanguage);
            response.put("entries", vocabEntries.size());
            return response;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public HashMap<String, Object> processPhrasesUpload(MultipartFile file, String languageId) {
        log.info("Processing phrases upload file");

        long startTime = System.currentTimeMillis();

        HashMap<String, Object> response = new HashMap<>();

        try {
            List<PhraseEntry> entries = FileParser.parsePhrasesFile(file);

            List<Map<String, String>> phraseEntries = new ArrayList<>();
            for (PhraseEntry entry : entries) {
                phraseEntries.add(Map.of(
                        "phrase", entry.getPhrase() != null ? entry.getPhrase() : "",
                        "meaning", entry.getMeaning() != null ? entry.getMeaning() : "",
                        "pronunciation", entry.getPronunciation() != null ? entry.getPronunciation() : "",
                        "notes", entry.getNotes() != null ? entry.getNotes() : ""
                ));
            }

            Language updatedLanguage = languageService.addPhrasesToLanguage(languageId, phraseEntries);
            log.info("Completed processing phrases upload file");

            long endTime = System.currentTimeMillis();
            log.info("Time taken to process file with {} phrases: {}ms", phraseEntries.size(), endTime - startTime);

            response.put("language", updatedLanguage);
            response.put("entries", phraseEntries.size());
            return response;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
