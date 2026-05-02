package com.fluentdoc.fileImport.controller;

import com.fluentdoc.common.response.BaseResponse;
import com.fluentdoc.common.response.BaseResponseBuilder;
import com.fluentdoc.common.response.BaseServiceErrorCode;
import com.fluentdoc.fileImport.service.FileImportService;
import com.fluentdoc.language.model.Language;
import com.fluentdoc.language.service.LanguageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;

@Tag(name = "File Import", description = "Endpoints for file import")
@RestController
@RequestMapping("/import")
@Slf4j
public class FileImportController {

    private final FileImportService fileImportService;
    private final LanguageService languageService;

    public FileImportController(FileImportService fileImportService, LanguageService languageService) {
        this.fileImportService = fileImportService;
        this.languageService = languageService;
    }

    /**
     * Handles file upload for dictionary import.
     */
    @PostMapping(value = "/dictionary")
    public ResponseEntity<BaseResponse> uploadDictionary(@RequestPart("file") MultipartFile file,
                                                         @RequestParam("languageId") String languageId) {
        log.info("Request sent to upload dictionary for language with id: {} with file type: {}", languageId, file.getContentType());
        HashMap<String, Object> response = new HashMap<>();

        Language language = languageService.getLanguageById(languageId);

        // check if language is valid
        if (language == null){
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        try {
            // Validate file format
            if (file.isEmpty()) {
                return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.FILE_EMPTY_ERROR);
            }

            // Start processing
            HashMap<String, Object> processResponse = fileImportService.processDictionaryUpload(file, languageId);
            response.put("language", processResponse.get("language"));
            response.put("entries", processResponse.get("entries"));
            return BaseResponseBuilder.buildSuccessResponse(response);
        } catch (Exception e) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.FILE_PROCESSING_ERROR, e.getMessage());
        }
    }

    /**
     * Handles file upload for phrases import.
     */
    @PostMapping(value = "/phrases")
    public ResponseEntity<BaseResponse> uploadPhrases(@RequestPart("file") MultipartFile file,
                                                      @RequestParam("languageId") String languageId) {
        log.info("Request sent to upload phrases for language with id: {} with file type: {}", languageId, file.getContentType());
        HashMap<String, Object> response = new HashMap<>();

        Language language = languageService.getLanguageById(languageId);

        // check if language is valid
        if (language == null){
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        try {
            // Validate file format
            if (file.isEmpty()) {
                return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.FILE_EMPTY_ERROR);
            }

            // Start processing
            HashMap<String, Object> processResponse = fileImportService.processPhrasesUpload(file, languageId);
            response.put("language", processResponse.get("language"));
            response.put("entries", processResponse.get("entries"));
            return BaseResponseBuilder.buildSuccessResponse(response);
        } catch (Exception e) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.FILE_PROCESSING_ERROR, e.getMessage());
        }
    }
}
