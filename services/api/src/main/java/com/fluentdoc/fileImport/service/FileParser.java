package com.fluentdoc.fileImport.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fluentdoc.fileImport.model.DictionaryEntry;
import com.fluentdoc.fileImport.model.PhraseEntry;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class FileParser {

    // Mapping of column names to model fields
    private static final Map<String, String> DICTIONARY_COLUMN_MAPPING = new HashMap<>();

    // CODE HIGHLIGHT: Static block to initialize the dictionary column mapping
    // this helps us to map the column names to the model fields that users can use in their files
    static {
        // Word Variations
        DICTIONARY_COLUMN_MAPPING.put("word", "word");
        DICTIONARY_COLUMN_MAPPING.put("term", "word");
        DICTIONARY_COLUMN_MAPPING.put("lexeme", "word");

        // Pronunciation Variations
        DICTIONARY_COLUMN_MAPPING.put("pronunciation", "pronunciation");
        DICTIONARY_COLUMN_MAPPING.put("phonetic transcription", "pronunciation");
        DICTIONARY_COLUMN_MAPPING.put("transcription", "pronunciation");
        DICTIONARY_COLUMN_MAPPING.put("ipa", "pronunciation");
        DICTIONARY_COLUMN_MAPPING.put("phonetic", "pronunciation");
        DICTIONARY_COLUMN_MAPPING.put("phonemic", "pronunciation");
        DICTIONARY_COLUMN_MAPPING.put("phonetic spelling", "pronunciation");

        // Part of Speech Variations
        DICTIONARY_COLUMN_MAPPING.put("pos", "pos");
        DICTIONARY_COLUMN_MAPPING.put("part of speech", "pos");
        DICTIONARY_COLUMN_MAPPING.put("word type", "pos");
        DICTIONARY_COLUMN_MAPPING.put("category", "pos");
        DICTIONARY_COLUMN_MAPPING.put("grammar category", "pos");

        // Meaning Variations
        DICTIONARY_COLUMN_MAPPING.put("meaning", "meaning");
        DICTIONARY_COLUMN_MAPPING.put("definition", "meaning");
        DICTIONARY_COLUMN_MAPPING.put("gloss", "meaning");
        DICTIONARY_COLUMN_MAPPING.put("meaning in english", "meaning");
        DICTIONARY_COLUMN_MAPPING.put("translation", "meaning");
        DICTIONARY_COLUMN_MAPPING.put("explanation", "meaning");

        // Notes Variations
        DICTIONARY_COLUMN_MAPPING.put("notes", "notes");
        DICTIONARY_COLUMN_MAPPING.put("comments", "notes");
        DICTIONARY_COLUMN_MAPPING.put("remarks", "notes");
        DICTIONARY_COLUMN_MAPPING.put("extra info", "notes");
        DICTIONARY_COLUMN_MAPPING.put("annotations", "notes");
    }

    public static List<DictionaryEntry> parseDictionaryFile(MultipartFile file) throws Exception {
        String filename = file.getOriginalFilename();
        if (filename == null) throw new IllegalArgumentException("Invalid file name.");

        if (filename.endsWith(".csv") || filename.endsWith(".tsv")) {
            return parseDictionaryCSV(file, filename.endsWith(".tsv"));
        } else if (filename.endsWith(".json")) {
            return parseDictionaryJSON(file);
        } else {
            throw new IllegalArgumentException("Unsupported file type.");
        }
    }

    private static List<DictionaryEntry> parseDictionaryCSV(MultipartFile file, boolean isTSV) throws Exception {
        List<DictionaryEntry> entries = new ArrayList<>();
        CSVFormat format = isTSV ? CSVFormat.TDF : CSVFormat.DEFAULT;

        try (CSVParser parser = new CSVParser(new InputStreamReader(file.getInputStream()), format.withFirstRecordAsHeader())) {
            Map<String, String> normalizedHeaders = new HashMap<>();

            // Normalize headers (case-insensitive + mapped names)
            for (String header : parser.getHeaderMap().keySet()) {
                String normalized = DICTIONARY_COLUMN_MAPPING.getOrDefault(header.toLowerCase().trim(), null);
                if (normalized != null) {
                    normalizedHeaders.put(normalized, header);
                }
            }

            // Ensure required fields exist
            if (!normalizedHeaders.containsKey("word") || !normalizedHeaders.containsKey("meaning") || !normalizedHeaders.containsKey("pos")) {
                log.info("CSV is missing required headers: 'word', 'meaning', or 'pos'. Please check the format.");
                throw new Exception("CSV is missing required headers: 'word', 'meaning', or 'pos'. Please check the format.");
            }

            // Process CSV rows
            for (CSVRecord record : parser) {
                DictionaryEntry entry = new DictionaryEntry(
                        record.get(normalizedHeaders.get("word")),
                        normalizedHeaders.containsKey("pronunciation") && record.isSet(normalizedHeaders.get("pronunciation")) ? record.get(normalizedHeaders.get("pronunciation")) : "",
                        record.get(normalizedHeaders.get("meaning")),
                        record.get(normalizedHeaders.get("pos")),
                        normalizedHeaders.containsKey("notes") && record.isSet(normalizedHeaders.get("notes")) ? record.get(normalizedHeaders.get("notes")) : ""
                );
                entries.add(entry);
            }
        } catch (Exception e) {
            log.info("Error parsing CSV file: {}", e.getMessage());
            throw new Exception("Error parsing CSV file: " + e.getMessage());
        }
        return entries;
    }

    private static List<DictionaryEntry> parseDictionaryJSON(MultipartFile file) throws Exception {
        List<DictionaryEntry> entries = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode rootNode = objectMapper.readTree(file.getInputStream());
            if (!rootNode.isArray()) {
                throw new Exception("Invalid JSON format: Root element must be an array.");
            }

            for (JsonNode node : rootNode) {
                String word = getDictionaryJsonValue(node, "word", true);
                String pronunciation = getDictionaryJsonValue(node, "pronunciation", false);
                String meaning = getDictionaryJsonValue(node, "meaning", true);
                String pos = getDictionaryJsonValue(node, "pos", true);
                String notes = getDictionaryJsonValue(node, "notes", false);

                DictionaryEntry entry = new DictionaryEntry(word, pronunciation, meaning, pos, notes);
                entries.add(entry);
            }
        } catch (Exception e) {
            throw new Exception("Error parsing JSON file: The format is invalid. Please check for errors and ensure the structure matches the required format before trying again.");
        }

        return entries;
    }

    // Helper method to get JSON value by key
    // The values in the json object are mapped to the keys in the DICTIONARY_COLUMN_MAPPING
    private static String getDictionaryJsonValue(JsonNode node, String key, boolean required) throws Exception {
        for (String possibleKey : DICTIONARY_COLUMN_MAPPING.keySet()) {
            if (DICTIONARY_COLUMN_MAPPING.get(possibleKey).equals(key)) {
                if (node.has(possibleKey) && !node.get(possibleKey).isNull()) {
                    return node.get(possibleKey).asText();
                }
            }
        }
        if (required) {
            throw new Exception("Missing required field: " + key);
        }
        return "";
    }

    public static List<PhraseEntry> parsePhrasesFile(MultipartFile file) throws Exception {
        String filename = file.getOriginalFilename();
        if (filename == null) throw new IllegalArgumentException("Invalid file name.");

        if (filename.endsWith(".csv") || filename.endsWith(".tsv")) {
            return parsePhraseCSV(file, filename.endsWith(".tsv"));
        } else if (filename.endsWith(".json")) {
            return parsePhraseJSON(file);
        } else {
            throw new IllegalArgumentException("Unsupported file type.");
        }

    }

    private static List<PhraseEntry> parsePhraseCSV(MultipartFile file, boolean isTSV) throws Exception {
        List<PhraseEntry> entries = new ArrayList<>();
        CSVFormat format = isTSV ? CSVFormat.TDF : CSVFormat.DEFAULT;
        try (CSVParser parser = new CSVParser(new InputStreamReader(file.getInputStream()), format.withFirstRecordAsHeader())) {
            for (CSVRecord record : parser) {
                PhraseEntry entry = new PhraseEntry(
                        record.get("phrase"),
                        record.get("pronunciation"),
                        record.get("meaning"),
                        record.get("notes")
                );
                entries.add(entry);
            }
        } catch (Exception e) {
            throw new Exception("Error parsing CSV file: " + e.getMessage());
        }
        return entries;
    }


    private static List<PhraseEntry> parsePhraseJSON(MultipartFile file) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            return objectMapper.readValue(file.getInputStream(),
                    new TypeReference<>() {});
        } catch (Exception e) {
            throw new Exception("Error parsing JSON file: The format is invalid. Please check for errors and ensure the structure matches the required format before trying again.");
        }
    }
}
