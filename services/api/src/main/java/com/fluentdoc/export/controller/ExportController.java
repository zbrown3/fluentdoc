package com.fluentdoc.export.controller;

import com.fluentdoc.export.request.DocumentExportRequest;
import com.fluentdoc.language.model.Language;
import com.fluentdoc.language.service.LanguageService;
import com.fluentdoc.export.service.DocumentExportService;
import com.fluentdoc.user.model.User;
import com.fluentdoc.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/export")
@Slf4j
public class ExportController {

    private final LanguageService languageService;
    private final UserService userService;
    private final DocumentExportService documentExportService;

    public ExportController(LanguageService languageService, UserService userService, DocumentExportService documentExportService) {
        this.languageService = languageService;
        this.userService = userService;
        this.documentExportService = documentExportService;
    }

    /**
     * Endpoint to handle document export
     */
    @PostMapping(value="/{id:.+}", produces = MediaType.APPLICATION_PDF_VALUE)
    public void exportDocument(@PathVariable String id, @RequestBody DocumentExportRequest request, HttpServletResponse res){
        log.info("Document generation request sent for language with ID: {} ", id);

        // Get Language Object from Database
        Language language = languageService.getLanguageById(id);

        // If language doesn't exist in database, return error
        if (language == null){
            res.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        // get user associated with this language
        User user = userService.getUser(language.getCreatorId());

        // If user doesn't exist in database, return error
        if (user == null){
            res.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        // generate pdf
        boolean generated = documentExportService.exportDocuments(user, language, res, request);

        if (!generated) {
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
