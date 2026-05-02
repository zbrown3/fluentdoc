package com.fluentdoc.export.service;

import com.fluentdoc.common.service.CommonUtilsService;
import com.fluentdoc.export.request.DocumentExportRequest;
import com.fluentdoc.export.util.ExportedDocument;
import com.fluentdoc.language.model.Language;
import com.fluentdoc.user.model.User;
import java.util.List;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


@Service
@Slf4j
public class DocumentExportService {

    private final TableBuilder tableBuilder;
    private final CommonUtilsService commonUtilsService;

    public DocumentExportService(TableBuilder tableBuilder, CommonUtilsService commonUtilsService) {
        this.tableBuilder = tableBuilder;
        this.commonUtilsService = commonUtilsService;
    }


    // FONT SETTINGS
    private static final Font HEADER_34_BOLD;
    static {
        try {
            HEADER_34_BOLD = new Font(BaseFont.createFont("CharisSIL-Bold.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED), 34, Font.BOLD);
        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static final Font HEADER_FONT;
    static {
        try {
            HEADER_FONT = new Font(BaseFont.createFont("CharisSIL-Bold.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED), 16);
        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static final Font SUB_HEADER_FONT;
    static {
        try {
            SUB_HEADER_FONT = new Font(BaseFont.createFont("CharisSIL-Bold.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED), 14);
        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static final Font INFO_TEXT;
    static {
        try {
            INFO_TEXT = new Font(BaseFont.createFont("CharisSIL-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED), 14);
        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static final Font PARAGRAPH_TEXT;
    static {
        try {
            PARAGRAPH_TEXT = new Font(BaseFont.createFont("CharisSIL-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED), 12);
        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static final Font ITALIC_PARAGRAPH_TEXT;
    static {
        try {
            ITALIC_PARAGRAPH_TEXT = new Font(BaseFont.createFont("CharisSIL-Italic.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED), 12);
        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }
    private static final Chunk BULLET = new Chunk("•", PARAGRAPH_TEXT);


    // PDF Language Headers
    Paragraph introHeader = createHeaderParagraph(new Paragraph(new Phrase("Introduction", HEADER_FONT)));
    Paragraph phonologyHeader = createHeaderParagraph(new Paragraph(new Phrase("Phonology", HEADER_FONT)));
    Paragraph syntaxHeader = createHeaderParagraph(new Paragraph(new Phrase("Syntax", HEADER_FONT)));
    Paragraph wordsAndPhrasesHeader = createHeaderParagraph(new Paragraph(new Phrase("Words & Phrases", HEADER_FONT)));
    Paragraph miscHeader = createHeaderParagraph(new Paragraph(new Phrase("Miscellaneous", HEADER_FONT)));


    // PDF Language Sub-headers
    Paragraph consonantsSubHeader = createSubHeaderParagraph(new Paragraph(new Phrase("Consonants", SUB_HEADER_FONT)));
    Paragraph vowelsSubHeader = createSubHeaderParagraph(new Paragraph(new Phrase("Vowels", SUB_HEADER_FONT)));
    Paragraph diphthongsSubHeader = createSubHeaderParagraph(new Paragraph(new Phrase("Diphthongs", SUB_HEADER_FONT)));
    Paragraph alphabetSubHeader = createSubHeaderParagraph(new Paragraph(new Phrase("Alphabet", SUB_HEADER_FONT)));
    Paragraph stressSubheader = createSubHeaderParagraph(new Paragraph(new Phrase("Stress", SUB_HEADER_FONT)));
    Paragraph phonologicalConstraintsSubheader = createSubHeaderParagraph(new Paragraph(new Phrase("Phonological Constraints", SUB_HEADER_FONT)));
    Paragraph vowelHarmonySubheader = createSubHeaderParagraph(new Paragraph(new Phrase("Vowel Harmony", SUB_HEADER_FONT)));

    Paragraph honorificsSubheader = createSubHeaderParagraph(new Paragraph(new Phrase("Honorifics", SUB_HEADER_FONT)));
    Paragraph verbsSubheader = createSubHeaderParagraph(new Paragraph(new Phrase("Verbs (Conjugation)", SUB_HEADER_FONT)));
    Paragraph sentenceStructureSubheader = createSubHeaderParagraph(new Paragraph(new Phrase("Sentence Structure (Syntax)", SUB_HEADER_FONT)));
    Paragraph negationSubheader = createSubHeaderParagraph(new Paragraph(new Phrase("Negation", SUB_HEADER_FONT)));
    Paragraph questionFormingSubheader = createSubHeaderParagraph(new Paragraph(new Phrase("Question Forming", SUB_HEADER_FONT)));

    Paragraph vocabularySubheader = createSubHeaderParagraph(new Paragraph(new Phrase("Vocabulary", SUB_HEADER_FONT)));
    Paragraph commonPhrasesSubheader = createSubHeaderParagraph(new Paragraph(new Phrase("Common Phrases", SUB_HEADER_FONT)));
    Paragraph numeralSystemSubheader = createSubHeaderParagraph(new Paragraph(new Phrase("the Numeral System", SUB_HEADER_FONT)));

    // Supplemental PDFs (Dictionary & Phrase Book)
    Paragraph dictionarySubheader = createSubHeaderParagraph(new Paragraph(new Phrase("Dictionary", SUB_HEADER_FONT)));


    /**
     * Export documents based on DocumentExportRequest
     */
    public boolean exportDocuments(User user, Language language, HttpServletResponse res, DocumentExportRequest request) {
        log.info("Exporting document process started");

        List<ExportedDocument> documents = new ArrayList<>();

        try {
            // Language Guide
            if (request.isIncludeLanguageGuide()) {
                ByteArrayOutputStream guideStream = generateLanguageGuidePDF(user, language,
                        request.isIncludeDictionaryInGuide(), request.isIncludePhraseBookInGuide());
                documents.add(new ExportedDocument("LanguageGuide.pdf", guideStream));
            }

            // Dictionary
            if (request.getStandaloneDictionary().isInclude()) {
                ByteArrayOutputStream dictStream = generateDictionaryPDF(user, language);
                documents.add(new ExportedDocument("Dictionary.pdf", dictStream));
            }

            // Phrase Book
            if (request.getStandalonePhraseBook().isInclude()) {
                ByteArrayOutputStream phraseStream = generatePhraseBookPDF(user, language);
                documents.add(new ExportedDocument("PhraseBook.pdf", phraseStream));
            }

            if (documents.isEmpty()) {
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return false;
            }

            // set response headers
            res.setHeader("Expires", "0");
            res.setHeader("Cache-Control", "must-revalidate, post-check=0, pre-check=0");
            res.setHeader("Pragma", "public");

            if (documents.size() == 1) {
                // Return the single file directly
                ExportedDocument doc = documents.get(0);
                res.setContentType("application/pdf");
                res.setHeader("Content-Disposition", "attachment; filename=" + doc.fileName());
                res.getOutputStream().write(doc.content().toByteArray());
            } else {
                // Create a ZIP with all PDFs
                res.setContentType("application/zip");
                res.setHeader("Content-Disposition", "attachment; filename=" + language.getName() + "_Export.zip");
                ZipOutputStream zipOut = new ZipOutputStream(res.getOutputStream());

                for (ExportedDocument doc : documents) {
                    zipOut.putNextEntry(new ZipEntry(doc.fileName()));
                    zipOut.write(doc.content().toByteArray());
                    zipOut.closeEntry();
                }

                zipOut.finish();
                zipOut.close();
            }

            return true;

        } catch (Exception e) {
            log.error("Error exporting documents", e);
            return false;
        }
    }



    /**
     * Generate Language PDF
     */
    public ByteArrayOutputStream generateLanguageGuidePDF(User user, Language language, boolean includeDictionary, boolean includePhraseBook) {
        log.info("Generating Language PDF to stream...");

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            XMLWorkerHelper worker = XMLWorkerHelper.getInstance();

            document.addAuthor(user.getUsername());
            document.addCreationDate();
            document.addCreator("FluentDoc Application");
            document.addTitle("FluentDoc - " + language.getName());
            document.addSubject("This PDF was generated by FluentDoc for the " + language.getName() + " language");

            // TITLE
            Paragraph title = new Paragraph(new Phrase(language.getName(), HEADER_34_BOLD));
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(5);
            document.add(title);

            // Description
            Paragraph description = new Paragraph(new Phrase(language.getDescription(), INFO_TEXT));
            description.setAlignment(Element.ALIGN_CENTER);
            description.setSpacingAfter(10);
            document.add(description);

            // Flag Image
            if (language.getFlagUrl() != null) {
                Image img = Image.getInstance(language.getFlagUrl());
                img.scaleAbsoluteWidth(525);
                img.scaleAbsoluteHeight(295);
                img.setSpacingAfter(5);
                document.add(img);
            }

            // Collaborators
            if (!language.getCollaborators().isEmpty()) {
                Paragraph p = new Paragraph("The following individuals made meaningful contributions: \n", PARAGRAPH_TEXT);
                for (String item : language.getCollaborators()) {
                    p.add(BULLET);
                    p.add(new Phrase("\u00a0" + item.replace(' ', '\u00a0') + " \n", PARAGRAPH_TEXT));
                }
                p.setAlignment(Element.ALIGN_CENTER);
                document.add(p);
            }

            // Footer
            PdfContentByte cb = writer.getDirectContent();
            Phrase guideFooter = new Phrase("A comprehensive guide to the " + language.getName() + " language", ITALIC_PARAGRAPH_TEXT);
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                    guideFooter,
                    (document.right() - document.left()) / 2 + document.leftMargin(),
                    document.bottom() + 8, 0);

            Phrase poweredByFluentDoc = new Phrase("Powered by FluentDoc", ITALIC_PARAGRAPH_TEXT);
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                    poweredByFluentDoc,
                    (document.right() - document.left()) / 2 + document.leftMargin(),
                    document.bottom() - 10, 0);

            // Intro
            document.newPage();
            if (language.getIntroduction() != null) {
                document.add(introHeader);
                worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getIntroduction())));
                document.newPage();
            }

            // Sections
            buildPhonologySection(document, language, worker, writer);
            buildSyntaxSection(document, language, worker, writer);
            buildMiscellaneousSection(document, language, worker, writer);

            // Optional sections

            // dictionary
            if (includeDictionary && language.getVocab() != null && !language.getVocab().isEmpty()) {
                // New page for dictionary
                document.newPage();

                // Subheader
                document.add(dictionarySubheader);
                addSectionDescription(language, document, "words (sorted alphabetically)");
                document.add(tableBuilder.createVocabSection(language));
            }

            // phrase book
            if (includePhraseBook && language.getPhrases() != null && !language.getPhrases().isEmpty()) {
                // New page for phrase book
                document.newPage();

                // Subheader
                document.add(commonPhrasesSubheader);
                addSectionDescription(language, document, "common phrases");
                document.add(tableBuilder.createCommonPhrasesSection(language));
            }

            document.close();
            writer.close();

        } catch (Exception e) {
            log.error("Error generating Language PDF", e);
            return null;
        }

        log.info("Language PDF successfully generated to ByteArrayOutputStream");
        return out;
    }



    /**
     * Generate Dictionary PDF for language
     */
    public ByteArrayOutputStream generateDictionaryPDF(User user, Language language) {
        log.info("Generating Dictionary PDF to stream...");

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Set metadata
            document.addAuthor(user.getUsername());
            document.addCreationDate();
            document.addCreator("FluentDoc Application");
            document.addTitle("FluentDoc - " + language.getName() + " Dictionary");
            document.addSubject("This PDF was generated by FluentDoc for the " + language.getName() + " language");

            // Title
            Paragraph title = new Paragraph(new Phrase(language.getName() + " Dictionary", HEADER_34_BOLD));
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(5);
            document.add(title);

            // Description
            Paragraph description = new Paragraph(new Phrase("Learn more about the words that make " + language.getName() + " so unique.", INFO_TEXT));
            description.setAlignment(Element.ALIGN_CENTER);
            description.setSpacingAfter(10);
            document.add(description);

            // Footer
            PdfContentByte cb = writer.getDirectContent();
            Phrase guideFooter = new Phrase("A comprehensive dictionary for the " + language.getName() + " language", ITALIC_PARAGRAPH_TEXT);
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                    guideFooter,
                    (document.right() - document.left()) / 2 + document.leftMargin(),
                    document.bottom() + 8, 0);

            Phrase poweredByFluentDoc = new Phrase("Powered by FluentDoc", ITALIC_PARAGRAPH_TEXT);
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                    poweredByFluentDoc,
                    (document.right() - document.left()) / 2 + document.leftMargin(),
                    document.bottom() - 10, 0);

            // New page for dictionary
            document.newPage();

            // Subheader and optional description
            document.add(dictionarySubheader);
            addSectionDescription(language, document, "words (sorted alphabetically)");

            // Dictionary content
            if (language.getVocab() == null || language.getVocab().isEmpty()) {
                Paragraph noVocabSection = new Paragraph(new Phrase("No vocabulary has been added to " + language.getName() + " yet.", PARAGRAPH_TEXT));
                noVocabSection.setSpacingAfter(10);
                document.add(noVocabSection);
            } else {
                document.add(tableBuilder.createVocabSection(language));
            }

            document.close();
            writer.close();

        } catch (Exception e) {
            log.error("Error generating Dictionary PDF", e);
            return null;
        }

        log.info("Dictionary PDF successfully generated to ByteArrayOutputStream");
        return out;
    }



    /**
     * Generate Phrase book PDF for language
     */
    public ByteArrayOutputStream generatePhraseBookPDF(User user, Language language){
        log.info("Generating Phrase Book Pdf process started");

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        try
        {
            /********************************
             ****** START OF FIRST PAGE  ****
             ********************************/

            // get OutputStream so we can get location for user's download file
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Set XML worker to parse HTML
            XMLWorkerHelper worker = XMLWorkerHelper.getInstance();

            //Set attributes here
            document.addAuthor(user.getUsername());
            document.addCreationDate();
            document.addCreator("FluentDoc Application");
            document.addTitle("FluentDoc - " + language.getName() + " Phrase Book");
            document.addSubject("This PDF was generated by FluentDoc for the " + language.getName() + " language");


            /**
             * TITLE
             */
            Paragraph title = new Paragraph(new Phrase(language.getName() + " Phrase Book", HEADER_34_BOLD));
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(5);
            document.add(title);

            // Add Dictionary Description
            Paragraph description = new Paragraph(new Phrase("Learn how to say common phrases in " + language.getName(), INFO_TEXT));
            description.setAlignment(Element.ALIGN_CENTER);
            description.setSpacingAfter(10);
            document.add(description);

            // SET FLUENTDOC FOOTER
            PdfContentByte cb = writer.getDirectContent();

            // a comprehensive guide footer text
            Phrase guideFooter = new Phrase("A comprehensive phrase book for the " + language.getName() + " language", ITALIC_PARAGRAPH_TEXT);
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                    guideFooter,
                    (document.right() - document.left()) / 2 + document.leftMargin(),
                    document.bottom() + 8, 0);

            // powered by FluentDoc footer text
            Phrase poweredByFluentDoc = new Phrase("Powered by FluentDoc", ITALIC_PARAGRAPH_TEXT);
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                    poweredByFluentDoc,
                    (document.right() - document.left()) / 2 + document.leftMargin(),
                    document.bottom() - 10, 0);


            // Move to next page
            document.newPage();

            /********************************
             ******  END OF FIRST PAGE  *****
             ********************************/


            /**
             * COMMON PHRASES
             */
            document.add(commonPhrasesSubheader);
            addSectionDescription(language, document, "common phrases");

            // if phrases is empty, add no vocab message, otherwise build vocab table
            if (language.getPhrases() == null || language.getPhrases().isEmpty()) {
                Paragraph noCommonPhraseSection = new Paragraph(new Phrase("No common phrase data has been added to " + language.getName() + " yet.", PARAGRAPH_TEXT));
                noCommonPhraseSection.setSpacingAfter(10);
                document.add(noCommonPhraseSection);
            } else {
                document.add(tableBuilder.createCommonPhrasesSection(language));
            }



            document.close();
            writer.close();
        } catch (Exception e) {
            log.error("Error generating Phrase Book PDF", e);
            return null;
        }

        log.info("Phrase Book PDF successfully generated to ByteArrayOutputStream");
        return out;
    }


    /**
     *  Build Phonology sections
     * @param document
     * @throws DocumentException
     */
    public void buildPhonologySection(Document document, Language language, XMLWorkerHelper worker, PdfWriter writer) throws Exception {
        // only show header if any of the sections below are not null
        if ((language.getConsonants() == null || language.getConsonants().isEmpty()) &&
                (language.getVowels() == null || language.getVocab().isEmpty()) &&
                (language.getDiphthongs() == null || language.getDiphthongs().isEmpty()) &&
                (language.getAlphabet() == null || language.getAlphabet().isEmpty()) &&
                (language.getStress() == null || language.getStress().isEmpty()) &&
                (language.getPhonologicalConstraints() == null || language.getPhonologicalConstraints().isEmpty()) &&
                (language.getVowelHarmony() == null || language.getVowelHarmony().isEmpty())) {
            return;
        }

        document.add(phonologyHeader);

        /**
         * CONSONANTS
         */
        if (language.getConsonants() != null && !language.getConsonants().isEmpty()) {
            // Header
            document.add(consonantsSubHeader);

            // description
            if (language.getConsonantsDescription() != null) {
                // Description
                addSectionDescription(language, document, "consonants");
                worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getConsonantsDescription())));
                addChunkSpacing(document);
            }

            // Table
            document.add(tableBuilder.createConsonantTable(language));

            // check for nonpulmonic consonants and add table if they exist
            if (commonUtilsService.hasNonPulmonicSymbols(language.getConsonants())) {
                document.add(tableBuilder.createNonPulmonicSymbolTable(language));
            }

            // decide here if two tables should be displayed or just one based on affricates, etc
            // Just other symbols
            if (commonUtilsService.hasOtherConsonantSymbols(language.getConsonants()) && !commonUtilsService.hasAffricateSymbols(language.getConsonants())){
                document.add(tableBuilder.createOtherSymbolTable(language));
            }
            // just affricates
            if (!commonUtilsService.hasOtherConsonantSymbols(language.getConsonants()) && commonUtilsService.hasAffricateSymbols(language.getConsonants())) {
                document.add(tableBuilder.createAffricateSymbolTable(language));
            }
            // BOTH other symbols and affricates
            if (commonUtilsService.hasOtherConsonantSymbols(language.getConsonants()) && commonUtilsService.hasAffricateSymbols(language.getConsonants())) {

                // Create outer table to house nested tables
                PdfPTable tableWrapper = new PdfPTable(2);

                // add each table to a cell
                tableWrapper.addCell(tableBuilder.createOtherSymbolTable(language));
                tableWrapper.addCell(tableBuilder.createAffricateSymbolTable(language));

                document.add(tableWrapper);
            }
        }

        /**
         * VOWELS
         */
        if (language.getVowels() != null && !language.getVowels().isEmpty()) {
            // Header
            document.add(vowelsSubHeader);

            // if there is a description for vowels, add it here
            if (language.getVowelsDescription() != null) {
                addSectionDescription(language, document, "vowels");
                worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getVowelsDescription())));
                addChunkSpacing(document);
            }

            // Table
            document.add(tableBuilder.createVowelTable(language));
        }

        /**
         * DIPHTHONGS
         */
        if (language.getDiphthongs() != null && !language.getDiphthongs().isEmpty()) {
            // Header
            document.add(diphthongsSubHeader);
            addSectionDescription(language, document, "diphthongs");

            worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getDiphthongs())));
            addChunkSpacing(document);
        }

        /**
         * ALPHABET
         */
        if (language.getAlphabet() != null && !language.getAlphabet().isEmpty()) {
            // Header
            document.add(alphabetSubHeader);
            addSectionDescription(language, document, "alphabet");

            // ADD NOTE
            BaseFont bf = BaseFont.createFont("CharisSIL-Bold.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Phrase alphabetNote = new Phrase("Note: The phonetic sound that a symbol represents will be above the symbol itself.", new Font(bf, 10));
            Paragraph alphabetNoteDescription = new Paragraph(new Phrase(alphabetNote));
            alphabetNoteDescription.setSpacingAfter(10);
            document.add(alphabetNoteDescription);

            // Table
            document.add(TableBuilder.createAlphabetTable(language));
        }

        /**
         * STRESS
         */
        if (language.getStress() != null && !language.getStress().isEmpty()) {
            // Header
            document.add(stressSubheader);
            addSectionDescription(language, document, "stress");

            // Description
            worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getStress())));
            addChunkSpacing(document);
        }


        /**
         * PHONOLOGICAL CONSTRAINTS
         */
        if (language.getPhonologicalConstraints() != null && !language.getPhonologicalConstraints().isEmpty()) {
            // Header
            document.add(phonologicalConstraintsSubheader);
            addSectionDescription(language, document, "phonological constraints");

            // Description
            worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getPhonologicalConstraints())));
            addChunkSpacing(document);
        }


        /**
         * VOWEL HARMONY
         */
        if (language.getVowelHarmony() != null && !language.getVowelHarmony().isEmpty()) {
            // Header
            document.add(vowelHarmonySubheader);
            addSectionDescription(language, document, "vowel harmony");

            // Description
            worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getVowelHarmony())));
            addChunkSpacing(document);
        }
    }

    /**
     * Build Syntax Section
     * @param document
     * @param language
     * @throws DocumentException
     */
    public void buildSyntaxSection(Document document, Language language, XMLWorkerHelper worker, PdfWriter writer) throws DocumentException, IOException {
        // only show header if any of the sections below are not null
        if ((language.getHonorifics() == null || language.getHonorifics().isEmpty()) &&
                (language.getConjugation() == null || language.getConjugation().isEmpty()) &&
                (language.getSyntax() == null || language.getSyntax().isEmpty()) &&
                (language.getNegation() == null || language.getNegation().isEmpty()) &&
                (language.getQuestionFormingInfo() == null || language.getQuestionFormingInfo().isEmpty())) {
            return;
        }
        document.add(syntaxHeader);

        /**
         * HONORIFICS
         */
        if (language.getHonorifics() != null) {
            // Header
            document.add(honorificsSubheader);
            addSectionDescription(language, document, "honorifics");

            // check if the user explicitly selected "NO"
            if (language.getHonorifics().equals("NoHonorificsData")) {
                Paragraph honorificsSection = new Paragraph(new Phrase(language.getName() + " does not have an honorifics system.", PARAGRAPH_TEXT));
                honorificsSection.setSpacingAfter(10);
                document.add(honorificsSection);
            } else {
                worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getHonorifics())));
                addChunkSpacing(document);
            }

        }

        /**
         * VERBS
         */
        if (language.getConjugation() != null) {
            // Header
            document.add(verbsSubheader);
            addSectionDescription(language, document, "verbs (conjugation)");
            worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getConjugation())));
            addChunkSpacing(document);
        }

        /**
         * SENTENCE STRUCTURE
         */
        if (language.getSyntax() != null ) {
            // Header
            document.add(sentenceStructureSubheader);
            addSectionDescription(language, document, "sentence structure");
            // Add word order info
            Paragraph wordOrderData = new Paragraph("Word order: " + language.getWordOrder(), ITALIC_PARAGRAPH_TEXT);
            wordOrderData.setSpacingAfter(10);
            document.add(wordOrderData);
            // Add Syntax description
            worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getSyntax())));
            addChunkSpacing(document);
        }

        /**
         * NEGATION
         */
        if (language.getNegation() != null) {
            // Header
            document.add(negationSubheader);
            addSectionDescription(language, document, "negation");
            worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getNegation())));
            addChunkSpacing(document);
        }


        /**
         * QUESTION FORMING
         */
        if (language.getQuestionFormingInfo() != null) {
            // Header
            document.add(questionFormingSubheader);
            addSectionDescription(language, document, "question forming");
            worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getQuestionFormingInfo())));
            addChunkSpacing(document);
        }
    }


    /**
     * Build Words & Phrases Section
     * @param document
     * @param language
     * @throws DocumentException
     */
    public void buildWordsAndPhrasesSection(Document document, Language language) throws DocumentException, IOException {
        // only show header if any of the sections below are not null
        if ((language.getVocab() == null || language.getVocab().isEmpty()) &&
                (language.getPhrases() == null || language.getPhrases().isEmpty())) {
            return;
        }

        // Set vocab and phrases on new page
        document.newPage();
        document.add(wordsAndPhrasesHeader);

        /**
         * VOCAB
         */
        if (language.getVocab() != null) {
            // Header
            document.add(vocabularySubheader);
            addSectionDescription(language, document, "vocabulary (sorted alphabetically)");

            // dictionary
            document.add(tableBuilder.createVocabSection(language));
        }


        /**
         * COMMON PHRASES
         */
        if (language.getPhrases() != null) {
            // Header
            document.add(commonPhrasesSubheader);
            addSectionDescription(language, document, "common phrases");

            // words and phrases section
            document.add(tableBuilder.createCommonPhrasesSection(language));
        }
    }


    /**
     * Build out miscellaneous section of language
     * @param document
     * @param language
     * @throws DocumentException
     * @throws IOException
     */
    public void buildMiscellaneousSection(Document document, Language language, XMLWorkerHelper worker, PdfWriter writer) throws DocumentException, IOException {


        /**
         * NUMERAL SYSTEM
         */
        // check to see if user has numeral system data
        // If any of the language data exists, build out numeral system section

        // add header if any of the fields exist
        if ((language.getNumeralDescription() != null && !language.getNumeralDescription().isEmpty()) ||
                (language.getBaseNumber() != null && !language.getNumerals().isEmpty()) ||
                (language.getNumerals() != null && !language.getNumerals().isEmpty())) {
            // TODO: MOVE THIS UP OUTSIDE OF IF STATEMENT ONCE SECTIONS GET ADDED
            // add Numeral System Header
            document.add(miscHeader);

            document.add(numeralSystemSubheader);
            addSectionDescription(language, document, "numeral system");
        }


        // numeral description
        if (language.getNumeralDescription() != null && !language.getNumeralDescription().isEmpty()) {
            worker.parseXHtml(writer, document, new StringReader(commonUtilsService.formatXML(language.getNumeralDescription())));
            addChunkSpacing(document);
        }

        // base number
        if (language.getBaseNumber() != null && !language.getBaseNumber().isEmpty()) {
            Paragraph baseNumberSection = new Paragraph(new Phrase("Base Number: " + language.getBaseNumber(), PARAGRAPH_TEXT));
            baseNumberSection.setSpacingAfter(5);
            document.add(baseNumberSection);
        }

        // numerals
        if (language.getNumerals() != null && !language.getNumerals().isEmpty()) {
            document.add(tableBuilder.createNumeralsTable(language));
        }

    }

    /**
     * Create header paragraph
     * :: Store header paragraph options in here
     * @param p
     * @return
     */
    public Paragraph createHeaderParagraph(Paragraph p){
        p.setAlignment(Element.ALIGN_CENTER);
        p.setSpacingAfter(5);
        return p;
    }

    /**
     * Create Sub header paragraph
     * :: Store sub header paragraph options in here
     * @param p
     * @return
     */
    public Paragraph createSubHeaderParagraph(Paragraph p){
        p.setAlignment(Element.ALIGN_LEFT);
        p.setSpacingAfter(3);
        return p;
    }

    /**
     * Method to Add Description for section
     * @param language
     * @param document
     * @param section
     * @throws DocumentException
     */
    public void addSectionDescription(Language language, Document document, String section) throws DocumentException, IOException {
        BaseFont bf = BaseFont.createFont("CharisSIL-Bold.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        Phrase sectionPhrase = new Phrase("Below is a description of " + section + " in " + language.getName() + ".", new Font(bf, 10));
        Paragraph sectionDescription = new Paragraph(new Phrase(sectionPhrase));
        sectionDescription.setSpacingAfter(10);
        document.add(sectionDescription);
    }

    /**
     * Method to add double-spacing
     */
    public void addChunkSpacing(Document document) throws DocumentException {
        document.add(Chunk.NEWLINE);
        document.add(Chunk.NEWLINE);
    }
}
