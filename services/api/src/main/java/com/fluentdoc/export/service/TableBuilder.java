package com.fluentdoc.export.service;

import com.fluentdoc.common.service.CommonUtilsService;
import com.fluentdoc.language.model.Language;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.*;
import java.util.List;

@Service
@Slf4j
public class TableBuilder {

    private final CommonUtilsService commonUtilsService;

    public TableBuilder(CommonUtilsService commonUtilsService) {
        this.commonUtilsService = commonUtilsService;
    }

    private static final Font HEADER_TEXT;
    static {
        try {
            HEADER_TEXT = new Font(BaseFont.createFont("CharisSIL-Bold.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED), 10);
        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static final Font VALUE_TEXT;
    static {
        try {
            VALUE_TEXT = new Font(BaseFont.createFont("CharisSIL-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED), 10);
        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }



    /*************************
     *************************
     *        CONSONANT      *
     *************************
     *************************/


    /**
     * Create Consonant Table
     * @param language
     * @return
     * @throws DocumentException
     * @throws DocumentException
     */
    public PdfPTable createConsonantTable(Language language) throws DocumentException, IOException {


        // create 9 column table
        PdfPTable table = new PdfPTable(12);

        // set the width of the table to 100% of page
        table.setWidthPercentage(110);

        // set relative columns width
        table.setWidths(new float[]{0.5f, 0.5f, 0.6f, 0.5f, 0.5f, 0.6f, 0.5f, 0.5f, 0.5f, 0.5f, 0.6f, 0.5f});

        // ----------------Table Header "Title"----------------
        // create header cell
        PdfPCell cell = new PdfPCell(new Phrase(language.getName() + " Consonant Chart", HEADER_TEXT));
        // set Column span "1 cell = 6 cells width"
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setColspan(12);
        // set style
        Style.headerCellStyle(cell);
        table.addCell(cell);

        // only build table if table has consonants
        // set consonants for language
        Map<String, Boolean> consonants = language.getConsonants();

        if (consonants == null){
            for (int i=0; i < 16; i++){
                table.addCell(createValueCell(""));
            }
            return table;
        }

        //-----------------Table Cells Label/Value------------------


        // 1st Row
        table.addCell(createLabelCell(""));
        table.addCell(createLabelCell("Bilabial"));
        table.addCell(createLabelCell("Labiodental"));
        table.addCell(createLabelCell("Dental"));
        table.addCell(createLabelCell("Alveolar"));
        table.addCell(createLabelCell("Alveopalatal"));
        table.addCell(createLabelCell("Retroflex"));
        table.addCell(createLabelCell("Palatal"));
        table.addCell(createLabelCell("Velar"));
        table.addCell(createLabelCell("Uvular"));
        table.addCell(createLabelCell("Pharyngeal"));
        table.addCell(createLabelCell("Glottal"));

        // 2nd Row (Stop)
        table.addCell(createLabelCell("Stop"));
        table.addCell(createValueCell(getConsonantStringSet(language, "p", "b")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "t", "d")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "tretro", "dretro")));
        table.addCell(createValueCell(getConsonantStringSet(language, "c", "fpal")));
        table.addCell(createValueCell(getConsonantStringSet(language, "k", "g")));
        table.addCell(createValueCell(getConsonantStringSet(language, "q", "G")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "glottal", "")));

        // 3rd Row (Nasal)
        table.addCell(createLabelCell("Nasal"));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "m")));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "mtail")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "n")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "nretro")));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "npal")));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "N")));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "Nuv")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));

        // 4th Row (Trill)
        table.addCell(createLabelCell("Trill"));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "B")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "r")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "R")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));

        // 5th Row (Affricate)
        table.addCell(createLabelCell("Affricate"));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "tS", "dZ")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));

        // 6th Row (Tap or Flap)
        table.addCell(createLabelCell("Tap/Flap"));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "V")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "rR")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "Rr")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));

        //7th Row (Fricative)
        table.addCell(createLabelCell("Fricative"));
        table.addCell(createValueCell(getConsonantStringSet(language, "BlVl", "BlVd")));
        table.addCell(createValueCell(getConsonantStringSet(language, "f", "v")));
        table.addCell(createValueCell(getConsonantStringSet(language, "th", "TH")));
        table.addCell(createValueCell(getConsonantStringSet(language, "s", "z")));
        table.addCell(createValueCell(getConsonantStringSet(language, "S", "Z")));
        table.addCell(createValueCell(getConsonantStringSet(language, "sretro", "zretro")));
        table.addCell(createValueCell(getConsonantStringSet(language, "cpal", "jpal")));
        table.addCell(createValueCell(getConsonantStringSet(language, "x", "yvel")));
        table.addCell(createValueCell(getConsonantStringSet(language, "xuv", "downR")));
        table.addCell(createValueCell(getConsonantStringSet(language, "hpha", "gpha")));
        table.addCell(createValueCell(getConsonantStringSet(language, "h", "hcurve")));



        // 8th Row (Lateral fricative)
        table.addCell(createLabelCell("Lateral fricative"));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "latfone", "latftwo")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));

        // 9th Row (Approximant)
        table.addCell(createLabelCell("Approximant"));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "vapprox")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "downr")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "downrretro")));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "j")));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "wvel")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));


        // 9th Row (Lateral Approximant)
        table.addCell(createLabelCell("Lateral Approximant"));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "l")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "lretro")));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "ypal")));
        table.addCell(createValueCell(getConsonantStringSet(language, "", "L")));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));
        table.addCell(createValueCell(""));


        table.setSpacingAfter(10);

        return table;
    }



    /******************************
     ******************************
     *   OTHER CONSONANT SYMBOLS  *
     ******************************
     ******************************/

    public PdfPTable createOtherSymbolTable(Language language) throws DocumentException, IOException {

        // create 1 column table
        PdfPTable table = new PdfPTable(1);

        // set the width of the table to 25% of page
        table.setWidthPercentage(50);

        table.setHorizontalAlignment(Element.ALIGN_LEFT);

        // ----------------Table Header "Title"----------------
        // create header cell
        PdfPCell cell = new PdfPCell(new Phrase("Other Consonants", HEADER_TEXT));
        // set Column span "1 cell = 6 cells width"
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setColspan(1);
        // set style
        Style.headerCellStyle(cell);
        table.addCell(cell);



        //-----------------Table Cells Label/Value------------------

        //row
        for (Map.Entry<String, String> entry : commonUtilsService.otherSymbolMap.entrySet()) {
            String k = entry.getKey();
            if (language.getConsonants().containsKey(k) && language.getConsonants().get(k)) {
                PdfPCell newCell = createValueCell(getOtherConsonantSymbolSet(language, k));
                newCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(newCell);
            }
        }


        return table;
    }


    /******************************
     ******************************
     *   AFFRICATE SYMBOLS  *
     ******************************
     ******************************/

    public PdfPTable createAffricateSymbolTable(Language language) throws DocumentException, IOException {

        // create 1 column table
        PdfPTable table = new PdfPTable(1);

        // set the width of the table to 50% of page
        table.setWidthPercentage(50);

        table.setHorizontalAlignment(Element.ALIGN_LEFT);

        // ----------------Table Header "Title"----------------
        // create header cell
        PdfPCell cell = new PdfPCell(new Phrase("Affricates", HEADER_TEXT));
        // set Column span "1 cell = 6 cells width"
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setColspan(1);
        // set style
        Style.headerCellStyle(cell);
        table.addCell(cell);



        //-----------------Table Cells Label/Value------------------

        //row
        for (Map.Entry<String, String> entry : commonUtilsService.affricateSymbolMap.entrySet()) {
            String k = entry.getKey();
            if (language.getConsonants().containsKey(k) && language.getConsonants().get(k)) {
                PdfPCell newCell = createValueCell(getAffricateSymbolSet(language, k));
                newCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(newCell);
            }
        }


        return table;
    }

    /******************************
     ******************************
     *     NONPULMONIC SYMBOLS    *
     ******************************
     ******************************/

    public PdfPTable createNonPulmonicSymbolTable(Language language) throws DocumentException, IOException {

        // create 1 column table
        PdfPTable table = new PdfPTable(3);

        // set the width of the table to 50% of page
        table.setWidthPercentage(80);

        table.setHorizontalAlignment(Element.ALIGN_CENTER);

        // ----------------Table Header "Title"----------------
        // create header cell
        PdfPCell cell = new PdfPCell(new Phrase("Non-Pulmonic Consonants", HEADER_TEXT));
        // set Column span "1 cell = 6 cells width"
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setColspan(3);
        // set style
        Style.headerCellStyle(cell);
        table.addCell(cell);



        //-----------------Table Cells Label/Value------------------

        // 1st Row (Labels)
        table.addCell(createLabelCell("Clicks"));
        table.addCell(createLabelCell("Voiced Implosives"));
        table.addCell(createLabelCell("Ejectives"));

        // 2nd Row (Labels)
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npcbl")));
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npvib")));
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npeb")));

        // 3rd Row (Labels)
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npcd")));
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npvida")));
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npeda")));

        // 4th Row (Labels)
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npcpa")));
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npvip")));
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npev")));

        // 5th Row (Labels)
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npcpl")));
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npviv")));
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npeaf")));

        // 6th Row (Labels)
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npcal")));
        table.addCell(createCenteredValueCell(getNonPulmonicSymbolSet(language, "npviu")));
        PdfPCell greyCell = new PdfPCell();
        greyCell.setBackgroundColor(BaseColor.DARK_GRAY);
        table.addCell(greyCell);




        return table;
    }



    /*************************
     *************************
     *     VOWEL TABLE    *
     *************************
     *************************/

    /**
     * Create Vowel Table
     * @param language
     * @return
     * @throws DocumentException
     */
    public PdfPTable createVowelTable(Language language) throws Exception {
        // 4 columns: Row label | Front | Central | Back
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(50);
        table.setWidths(new float[]{0.9f, 1f, 1f, 1f}); // label a bit narrower

        // ----- Title row -----
        PdfPCell h = new PdfPCell(new Phrase(language.getName() + " Vowel Chart", HEADER_TEXT));
        h.setHorizontalAlignment(Element.ALIGN_CENTER);
        h.setColspan(4);
        Style.headerCellStyle(h);
        table.addCell(h);

        // Short-circuit: show empty grid if no vowels map
        Map<String, Boolean> v = language.getVowels();
        if (v == null || v.isEmpty()) {
            addHeaderRow(table);
            // 5 body rows (Close, Near-close, Close-mid, Mid, Open-mid, Near-open, Open)
            for (int i = 0; i < 7; i++) addEmptyRow(table);
            table.setSpacingAfter(10);
            return table;
        }

        // ----- Column headers -----
        addHeaderRow(table);

        // ----- Close -----
        addRow(table, "Close",
                pair(language, "i", "y"),           // Front
                pair(language, "ibar", "ubar"),     // Central
                pair(language, "vowelw", "u")       // Back
        );

        // ----- Near-close -----
        addRow(table, "Near-close",
                pair(language, "ii", "upperY"),     // Front
                single(language, ""),               // Central (no standard symbol)
                pair(language, "nearu", "")         // Back (ʊ only)
        );

        // ----- Close-mid -----
        addRow(table, "Close Mid",
                pair(language, "e", "oslant"),      // Front (e, ø)
                pair(language, "backelow", "obar"),    // Central (ɘ, ɵ)
                pair(language, "voweltwist", "o")   // Back (ɤ, o)
        );

        // ----- Mid (Central only) -----
        addRow(table, "Mid",
                single(language, ""),               // Front
                pair(language, "ee", "er"),         // Central (ə, ɝ)
                single(language, "")                // Back
        );

        // ----- Open-mid -----
        addRow(table, "Open Mid",
                pair(language, "eh", "oe"),         // Front (ɛ, œ)
                pair(language, "backE", "roundb"),  // Central (ɜ, ɞ)
                pair(language, "uu", "backc")       // Back (ʌ, ɔ)
        );

        // ----- Near-open -----
        addRow(table, "Near-open",
                pair(language, "ae", ""),           // Front (æ)
                pair(language, "downa", ""),        // Central (ɐ)
                single(language, "")                // Back
        );

        // ----- Open -----
        addRow(table, "Open",
                pair(language, "ah", "ce"),         // Front (a, ɶ)
                single(language, ""),               // Central
                pair(language, "a", "backa")        // Back (ɑ, ɒ)
        );

        table.setSpacingAfter(10);
        return table;
    }

    // Column headers row
    private void addHeaderRow(PdfPTable t) {
        t.addCell(createLabelCell(""));         // row label header blank
        t.addCell(createLabelCell("Front"));
        t.addCell(createLabelCell("Central"));
        t.addCell(createLabelCell("Back"));
    }

    // Add a row: label + 3 value cells
    private void addRow(PdfPTable t, String label, PdfPCell front, PdfPCell central, PdfPCell back) {
        t.addCell(createLabelCell(label));
        t.addCell(front);
        t.addCell(central);
        t.addCell(back);
    }

    private void addEmptyRow(PdfPTable t) throws DocumentException, IOException {
        addRow(t, "", createValueCell(""), createValueCell(""), createValueCell(""));
    }

    /** Build a cell for a pair (unrounded, rounded). Empty strings are ignored. */
    private PdfPCell pair(Language lang, String leftKey, String rightKey) throws DocumentException, IOException {
        String s = joinNonEmpty(
                symbolIfSelected(lang, leftKey),
                symbolIfSelected(lang, rightKey)
        );
        return createValueCell(s);
    }

    /** Build a cell for a single symbol (or blank). */
    private PdfPCell single(Language lang, String key) throws DocumentException, IOException {
        return createValueCell(symbolIfSelected(lang, key));
    }

    /** Returns the IPA symbol for key if selected in language.vowels; else "" */
    private String symbolIfSelected(Language lang, String key) {
        if (key == null || key.isEmpty()) return "";
        Map<String, Boolean> v = lang.getVowels();
        Boolean on = (v != null) ? v.get(key) : null;
        if (on == null || !on) return "";
        // Map key -> symbol (must match your front-end map)
        return IPA_MAP.getOrDefault(key, "");
    }

    /** Join two symbols with a thin space between (pair) */
    private String joinNonEmpty(String a, String b) {
        if (a.isEmpty() && b.isEmpty()) return "";
        if (a.isEmpty()) return b;
        if (b.isEmpty()) return a;
        return a + "\u2009" + b; // thin space between pair
    }

    private static final Map<String, String> IPA_MAP = new LinkedHashMap<>();
    static {
        IPA_MAP.put("i", "i");
        IPA_MAP.put("y", "y");
        IPA_MAP.put("ibar", "ɨ");
        IPA_MAP.put("ubar", "ʉ");
        IPA_MAP.put("vowelw", "ɯ");
        IPA_MAP.put("u", "u");

        IPA_MAP.put("ii", "ɪ");
        IPA_MAP.put("upperY", "ʏ");
        IPA_MAP.put("nearu", "ʊ");

        IPA_MAP.put("e", "e");
        IPA_MAP.put("oslant", "ø");
        IPA_MAP.put("backelow", "ɘ");
        IPA_MAP.put("obar", "ɵ");
        IPA_MAP.put("voweltwist", "ɤ");
        IPA_MAP.put("o", "o");

        IPA_MAP.put("ee", "ə");
        IPA_MAP.put("er", "ɝ");

        IPA_MAP.put("eh", "ɛ");
        IPA_MAP.put("oe", "œ");
        IPA_MAP.put("backE", "ɜ");
        IPA_MAP.put("roundb", "ɞ");
        IPA_MAP.put("uu", "ʌ");
        IPA_MAP.put("backc", "ɔ");

        IPA_MAP.put("ae", "æ");
        IPA_MAP.put("downa", "ɐ");

        IPA_MAP.put("ah", "a");
        IPA_MAP.put("ce", "ɶ");
        IPA_MAP.put("a", "ɑ");
        IPA_MAP.put("backa", "ɒ");
    }




    /*************************
     *************************
     *     VOCAB TABLE    *
     *************************
     *************************/

    /**
     * Create Dictionary-Style Vocabulary Section
     * @param language
     * @return
     * @throws DocumentException
     */
    public PdfPTable createVocabSection(Language language) throws DocumentException, IOException {
        // Load fonts
        BaseFont baseFontBold = BaseFont.createFont("CharisSIL-Bold.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        BaseFont baseFontRegular = BaseFont.createFont("CharisSIL-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);

        // Define fonts
        Font headerFont = new Font(baseFontBold, 10, Font.BOLD, BaseColor.BLACK);
        Font dividerFont = new Font(baseFontBold, 12, Font.BOLD, BaseColor.DARK_GRAY);
        Font wordFont = new Font(baseFontBold, 10, Font.BOLD);
        Font italicFont = new Font(baseFontRegular, 9, Font.ITALIC);
        Font regularFont = new Font(baseFontRegular, 9);
        Font noteFont = new Font(baseFontRegular, 8, Font.ITALIC, BaseColor.GRAY);

        // Create 2-column table
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingAfter(10);
        table.setWidths(new float[]{1f, 1f});

        // Sort vocab and group by first letter
        List<Map<String, String>> vocab = language.getVocab();
        Collections.sort(vocab, mapComparator);
        Map<Character, List<Map<String, String>>> grouped = new TreeMap<>();
        for (Map<String, String> entry : vocab) {
            String word = entry.getOrDefault("word", "");
            if (word.isEmpty()) continue;
            char firstLetter = Character.toUpperCase(word.charAt(0));
            grouped.computeIfAbsent(firstLetter, k -> new ArrayList<>()).add(entry);
        }

        // Loop through each letter group
        for (Map.Entry<Character, List<Map<String, String>>> group : grouped.entrySet()) {
            char letter = group.getKey();
            List<Map<String, String>> entries = group.getValue();

            // Divider row
            PdfPCell dividerCell = new PdfPCell(new Phrase(String.valueOf(letter), dividerFont));
            dividerCell.setColspan(2);
            dividerCell.setBorder(Rectangle.BOTTOM);
            dividerCell.setPaddingTop(10);
            dividerCell.setPaddingBottom(5);
            table.addCell(dividerCell);

            // Split top-down into 2 columns
            int total = entries.size();
            int mid = (int) Math.ceil(total / 2.0);
            List<Map<String, String>> left = entries.subList(0, mid);
            List<Map<String, String>> right = entries.subList(mid, total);

            for (int i = 0; i < mid; i++) {
                PdfPCell leftCell = createEntryCell(left.get(i), wordFont, italicFont, regularFont, noteFont);
                table.addCell(leftCell);

                if (i < right.size()) {
                    PdfPCell rightCell = createEntryCell(right.get(i), wordFont, italicFont, regularFont, noteFont);
                    table.addCell(rightCell);
                } else {
                    PdfPCell emptyCell = new PdfPCell();
                    emptyCell.setBorder(Rectangle.NO_BORDER);
                    table.addCell(emptyCell);
                }
            }
        }

        return table;
    }

    private PdfPCell createEntryCell(Map<String, String> wordEntry, Font wordFont, Font italicFont, Font regularFont, Font noteFont) {
        String word = wordEntry.getOrDefault("word", "");
        String pronunciation = wordEntry.getOrDefault("pronunciation", "");
        String meaning = wordEntry.getOrDefault("meaning", "");
        String pos = wordEntry.getOrDefault("pos", "");
        String notes = wordEntry.getOrDefault("notes", "");

        Paragraph p = new Paragraph();

        // Word line
        p.add(new Chunk(word + ", ", wordFont));
        if (!pronunciation.trim().isEmpty()) p.add(new Chunk("/" + pronunciation + "/", regularFont));
        if (!pos.trim().isEmpty()) p.add(new Chunk(", " + pos, italicFont));
        p.add(Chunk.NEWLINE);

        // Meaning
        p.add(new Chunk(meaning, regularFont));
        p.add(Chunk.NEWLINE);

        // Notes
        if (notes != null && !notes.trim().isEmpty()) {
            p.add(new Chunk("Note: ", noteFont));
            p.add(new Chunk(notes, italicFont));
            p.add(Chunk.NEWLINE);
        }

        p.add(Chunk.NEWLINE);

        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.addElement(p);
        return cell;
    }

    /*******************************
     *******************************
     *     COMMON PHRASES TABLE    *
     *******************************
     *******************************/

    public PdfPTable createCommonPhrasesSection(Language language) throws DocumentException, IOException {
        // Load Charis SIL fonts
        BaseFont baseFontBold = BaseFont.createFont("CharisSIL-Bold.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        BaseFont baseFontRegular = BaseFont.createFont("CharisSIL-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);

        // Define fonts
        Font headerFont = new Font(baseFontBold, 10, Font.BOLD, BaseColor.BLACK);
        Font dividerFont = new Font(baseFontBold, 12, Font.BOLD, BaseColor.DARK_GRAY);
        Font phraseFont = new Font(baseFontBold, 10);
        Font ipaFont = new Font(baseFontRegular, 9, Font.ITALIC);
        Font meaningFont = new Font(baseFontRegular, 9);

        // Create 2-column layout
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingAfter(10);
        table.setWidths(new float[]{1f, 1f});

        // Get and sort phrases
        List<Map<String, String>> phrases = language.getPhrases();
        phrases.sort(Comparator.comparing(p -> p.getOrDefault("phrase", "")));

        // Group by first letter of phrase
        Map<Character, List<Map<String, String>>> grouped = new TreeMap<>();
        for (Map<String, String> phrase : phrases) {
            String key = phrase.getOrDefault("phrase", "");
            if (key.isEmpty()) continue;
            char letter = Character.toUpperCase(key.charAt(0));
            grouped.computeIfAbsent(letter, k -> new ArrayList<>()).add(phrase);
        }

        // Loop through groups
        for (Map.Entry<Character, List<Map<String, String>>> group : grouped.entrySet()) {
            char letter = group.getKey();
            List<Map<String, String>> groupPhrases = group.getValue();

            // Divider Row
            PdfPCell dividerCell = new PdfPCell(new Phrase(String.valueOf(letter), dividerFont));
            dividerCell.setColspan(2);
            dividerCell.setBorder(Rectangle.BOTTOM);
            dividerCell.setPaddingTop(10);
            dividerCell.setPaddingBottom(5);
            table.addCell(dividerCell);

            // Split into two vertical columns
            int total = groupPhrases.size();
            int mid = (int) Math.ceil(total / 2.0);
            List<Map<String, String>> left = groupPhrases.subList(0, mid);
            List<Map<String, String>> right = groupPhrases.subList(mid, total);

            for (int i = 0; i < mid; i++) {
                PdfPCell leftCell = createPhraseCell(left.get(i), phraseFont, ipaFont, meaningFont);
                table.addCell(leftCell);

                if (i < right.size()) {
                    PdfPCell rightCell = createPhraseCell(right.get(i), phraseFont, ipaFont, meaningFont);
                    table.addCell(rightCell);
                } else {
                    PdfPCell emptyCell = new PdfPCell();
                    emptyCell.setBorder(Rectangle.NO_BORDER);
                    table.addCell(emptyCell);
                }
            }
        }

        return table;
    }

    private PdfPCell createPhraseCell(Map<String, String> phraseData, Font phraseFont, Font ipaFont, Font meaningFont) {
        String phrase = phraseData.getOrDefault("phrase", "");
        String pronunciation = phraseData.getOrDefault("pronunciation", "");
        String meaning = phraseData.getOrDefault("meaning", "");

        Paragraph p = new Paragraph();

        // Phrase line
        p.add(new Chunk(phrase, phraseFont));
        if (!pronunciation.trim().isEmpty()) {
            p.add(new Chunk(pronunciation, ipaFont));
        }
        p.add(Chunk.NEWLINE);

        // Meaning
        p.add(new Chunk(meaning, meaningFont));
        p.add(Chunk.NEWLINE);
        p.add(Chunk.NEWLINE);

        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.addElement(p);
        return cell;
    }




    /*************************
     *************************
     *     ALPHABET TABLE    *
     *************************
     *************************/
    public static PdfPTable createAlphabetTable(Language language) throws DocumentException, IOException {

        // create 9 column table
        PdfPTable table = new PdfPTable(10);

        // set the width of the table to 100% of page
        table.setWidthPercentage(100);

        // set relative columns width
        table.setWidths(new float[]{0.5f, 0.5f, 0.5f, 0.5f, 0.5f, 0.5f, 0.5f, 0.5f, 0.5f, 0.5f});


        // ----------------Table Header "Title"----------------
        // create header cell
        PdfPCell cell = new PdfPCell(new Phrase(language.getName() + " Alphabet", HEADER_TEXT));
        // set Column span "1 cell = 6 cells width"
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setColspan(10);
        // set style
        Style.headerCellStyle(cell);
        table.addCell(cell);

        // set phrases for language
        Map<String, String> alphabet = language.getAlphabet();


        // Set counter for new
        // Note: The table will only display a row if
        // if it has 10 columns minimum per row (or allotted
        // column num defined above) to complete the row
        // we need a way to programmatically fill in spaces
        int rowCounter = 0;



        //-----------------Table Cells Label/Value------------------

        // Iterate through map and assign values to rows
        Iterator it = alphabet.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();

            // if there is a value for user language,
            // add that value and corresponding translation to table
            if (!StringUtils.isEmpty(pair.getValue().toString())){
                // Create row
                table.addCell(createAlphabetCell(pair.getKey().toString() + "\n\n" + pair.getValue().toString()));
                // Increment row counter
                rowCounter += 1;
            }

            it.remove(); // avoids a ConcurrentModificationException
        }


        // If rowCounter isn't divisible by 10
        // or: columns aren't in 10s
        // add rows until it is so rows display
        while (rowCounter % table.getNumberOfColumns() != 0) {
            table.addCell("");
            rowCounter += 1;
        }


        return table;
    }

    /*******************************
     *******************************
     *     NUMERALS  TABLE    *
     *******************************
     *******************************/

    public PdfPTable createNumeralsTable(Language language) throws DocumentException, IOException {

        // create 3 column table
        PdfPTable table = new PdfPTable(3);

        // set the width of the table to 50% of page
        table.setWidthPercentage(100);


        // ----------------Table Header "Title"----------------
        // create header cell
        PdfPCell cell = new PdfPCell(new Phrase(language.getName() + " Numerals", HEADER_TEXT));
        // set Column span "1 cell = 6 cells width"
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setColspan(3);
        // set style
        Style.headerCellStyle(cell);
        table.addCell(cell);

        // set phrases for language
        List<Map<String, String>>  numerals = language.getNumerals();

        //-----------------Table Cells Label/Value------------------

        // 1st Row
        table.addCell(createLabelCell("Numeral"));
        table.addCell(createLabelCell("Phonetic Transcription"));
        table.addCell(createLabelCell("Spelling"));


        // subsequent rows
        for (Map<String, String> numeral : numerals){
            table.addCell(createValueCell(numeral.get("numeral")));
            table.addCell(createValueCell(numeral.get("pronunciation")));
            table.addCell(createValueCell(numeral.get("spelling")));
        }


        table.setSpacingAfter(10);
        return table;
    }



    /*************************
     *************************
     *     HELPER METHODS    *
     *************************
     *************************/


    public static Comparator<Map<String, String>> mapComparator = Comparator.comparing(m -> m.get("word").toUpperCase());


    // create cells
    private static PdfPCell createLabelCell(String text){
        // create cell
        PdfPCell cell = new PdfPCell(new Phrase(text, HEADER_TEXT));

        // set style
        Style.labelCellStyle(cell);
        return cell;
    }

    // create cells
    private static PdfPCell createValueCell(String text) throws IOException, DocumentException {

        // create cell
        PdfPCell cell = new PdfPCell(new Phrase(text, VALUE_TEXT));

        // set style
        Style.valueCellStyle(cell);
        return cell;
    }

    // create centered cells
    private static PdfPCell createCenteredValueCell(String text) throws IOException, DocumentException {

        // create cell
        PdfPCell cell = new PdfPCell(new Phrase(text, VALUE_TEXT));

        // set style
        Style.valueCellStyle(cell);

        // center cell
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        return cell;
    }

    // create alphabet cell
    // create cells
    private static PdfPCell createAlphabetCell(String text) throws IOException, DocumentException {

        // create cell
        PdfPCell cell = new PdfPCell(new Phrase(text, VALUE_TEXT));

        // set style
        Style.valueCellStyle(cell);

        //horizontally align cell
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        return cell;
    }


    // return consonant StringSet
    private String getConsonantStringSet(Language language, String st1, String st2){
        Map<String, Boolean> consonantMap = language.getConsonants();



        if (containsPhoneme(consonantMap, st1) && containsPhoneme(consonantMap, st2)){
            return "   " + commonUtilsService.decodeIpa(st1) + "   " + commonUtilsService.decodeIpa(st2);
        }
        else if (containsPhoneme(consonantMap, st1) && !containsPhoneme(consonantMap, st2)){
            return "   " + commonUtilsService.decodeIpa(st1);
        }
        else if (!containsPhoneme(consonantMap, st1) && containsPhoneme(consonantMap, st2)) {
            return "   " +  "     " + commonUtilsService.decodeIpa(st2);
        }
        else {
            return "";
        }
    }

    // return other symbols StringSet
    private String getOtherConsonantSymbolSet(Language language, String st1){
        Map<String, Boolean> consonantMap = language.getConsonants();

        if (containsPhoneme(consonantMap, st1)){
            return commonUtilsService.otherSymbolMap.get(st1);
        }
        else {
            return "";
        }
    }

    // return affricate StringSet
    private String getAffricateSymbolSet(Language language, String st1){
        Map<String, Boolean> consonantMap = language.getConsonants();

        if (containsPhoneme(consonantMap, st1)){
            return commonUtilsService.affricateSymbolMap.get(st1);
        }
        else {
            return "";
        }
    }

    // return affricate StringSet
    private String getNonPulmonicSymbolSet(Language language, String st1){
        Map<String, Boolean> consonantMap = language.getConsonants();

        if (containsPhoneme(consonantMap, st1)){
            return commonUtilsService.nonPulmonicSymbolMap.get(st1);
        }
        else {
            return "";
        }
    }

    // return vowel stringSet
    private  String getVowelStringSet(Language language, String st1, String st2){
        Map<String, Boolean> vowelMap = language.getVowels();

        if (containsPhoneme(vowelMap, st1) && containsPhoneme(vowelMap, st2)){
            return "   " + commonUtilsService.decodeIpa(st1) + "       " + commonUtilsService.decodeIpa(st2);
        }
        else if (containsPhoneme(vowelMap, st1) && !containsPhoneme(vowelMap, st2)){
            return "   " + commonUtilsService.decodeIpa(st1);
        }
        else if (!containsPhoneme(vowelMap, st1) && containsPhoneme(vowelMap, st2)) {
            return "   " + commonUtilsService.decodeIpa(st2);
        }
        else {
            return "";
        }
    }

    // create vowel interVowel 1 row
    // 	ɪ 	ʏ   ʊ
    private String getVowelIntervalOneStringSet(Language language, String st1, String st2, String st3) {
        Map<String, Boolean> vowelMap = language.getVowels();

        if (containsPhoneme(vowelMap, st1) && containsPhoneme(vowelMap, st2) && containsPhoneme(vowelMap, st3)){
            return "                " + commonUtilsService.decodeIpa(st1) + "      " + commonUtilsService.decodeIpa(st2)
                    + "                  " + commonUtilsService.decodeIpa(st3);
        }
        else if (containsPhoneme(vowelMap, st1) && containsPhoneme(vowelMap, st2) && !containsPhoneme(vowelMap, st3)) {
            return "                " + commonUtilsService.decodeIpa(st1) + "      " + commonUtilsService.decodeIpa(st2);
        }
        else if (containsPhoneme(vowelMap, st1) && !containsPhoneme(vowelMap, st2) && !containsPhoneme(vowelMap, st3)) {
            return "                " + commonUtilsService.decodeIpa(st1);
        }
        else if (!containsPhoneme(vowelMap, st1) && containsPhoneme(vowelMap, st2) && !containsPhoneme(vowelMap, st3)) {
            return "                       " + commonUtilsService.decodeIpa(st2);
        }
        else if (!containsPhoneme(vowelMap, st1) && containsPhoneme(vowelMap, st2) && containsPhoneme(vowelMap, st3)) {
            return "                       " + commonUtilsService.decodeIpa(st2) + "                  " + commonUtilsService.decodeIpa(st3);
        }
        else if (!containsPhoneme(vowelMap, st1) && !containsPhoneme(vowelMap, st2) && containsPhoneme(vowelMap, st3)) {
            return "                                          " + commonUtilsService.decodeIpa(st3);
        }
        else if (containsPhoneme(vowelMap, st1) && !containsPhoneme(vowelMap, st2) && containsPhoneme(vowelMap, st3)) {
            return "                " + commonUtilsService.decodeIpa(st1) + "                         " + commonUtilsService.decodeIpa(st3);
        }
        else return "";
    }

    // create vowel interVowel 3 row
    // 	æ ɐ
    private String getVowelIntervalThreeStringSet(Language language, String st1, String st2) {
        Map<String, Boolean> vowelMap = language.getVowels();

        if (containsPhoneme(vowelMap, st1) && containsPhoneme(vowelMap, st2)){
            return "            " + commonUtilsService.decodeIpa(st1) + "               " + commonUtilsService.decodeIpa(st2);
        }
        else if (!containsPhoneme(vowelMap, st1) && containsPhoneme(vowelMap, st2)){
            return "                              " + commonUtilsService.decodeIpa(st2);
        }
        else if (containsPhoneme(vowelMap, st1) && !containsPhoneme(vowelMap, st2)){
            return "            " + commonUtilsService.decodeIpa(st1);
        }
        else return "";
    }

    // return true or false for phoneme value
    private boolean containsPhoneme(Map<String, Boolean> phonemeMap, String value) {
        return phonemeMap.containsKey(value) && (phonemeMap.get(value) == true);
    }

    public static String convertCommonPhraseToString(String commonPhrase) {

        String result = null;

        switch (commonPhrase) {
            case "hi":
                result = "Hi";
                break;
            case "howAreYou":
                result = "How are you?";
                break;
            case "sorry":
                result = "Sorry";
                break;
            case "whatIsThis":
                result = "What is this?";
                break;
            case "whatIsYourName":
                result = "What is your name?";
                break;
            case "myNameIs":
                result = "My name is?";
                break;
            case "whereAreYouFrom":
                result = "Where are you from?";
                break;
            case "iAm":
                result = "I am ___";
                break;
            case "thankYou":
                result = "Thank You";
                break;
            case "youreWelcome":
                result = "You're Welcome";
                break;
        }

        return result;
    }


}
