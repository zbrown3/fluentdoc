package com.fluentdoc.language.service;

import com.fluentdoc.language.model.Language;
import com.fluentdoc.language.repository.LanguageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

@Service
public class LanguageProgressService {

    private final LanguageRepository repository;

    public LanguageProgressService(LanguageRepository repository) {
        this.repository = repository;
    }

    public int getLanguageProgressPercentage(String languageId) {
        Language language = repository.findById(languageId)
                .orElseThrow(() -> new IllegalArgumentException("Language not found: " + languageId));

        List<Supplier<Boolean>> checks = List.of(
                () -> mainInfoComplete(language),
                () -> introComplete(language),
                () -> flagComplete(language),
                () -> consonantsComplete(language),
                () -> vowelsComplete(language),
                () -> diphthongsComplete(language),
                () -> alphabetComplete(language),
                () -> stressComplete(language),
                () -> vowelHarmonyComplete(language),
                () -> honorificsComplete(language),
                () -> verbsComplete(language),
                () -> sentenceStructureComplete(language),
                () -> negationComplete(language),
                () -> questionFormingComplete(language),
                () -> vocabComplete(language),
                () -> phrasesComplete(language)
        );

        long completed = checks.stream()
                .filter(Supplier::get)
                .count();

        return (int) Math.floor((completed * 100.0) / checks.size());
    }

    /* ------------ Individual checks (null-safe) ------------ */

    private boolean mainInfoComplete(Language l) {
        return isNotBlank(l.getName()) && isNotBlank(l.getDescription());
    }

    private boolean introComplete(Language l) {
        return isNotBlank(l.getIntroduction());
    }

    private boolean flagComplete(Language l) {
        return isNotBlank(l.getFlagUrl());
    }

    private boolean consonantsComplete(Language l) {
        Map<String, Boolean> map = l.getConsonants();
        return map != null && map.values().stream().anyMatch(Boolean.TRUE::equals);
    }

    private boolean vowelsComplete(Language l) {
        Map<String, Boolean> map = l.getVowels();
        return map != null && map.values().stream().anyMatch(Boolean.TRUE::equals);
    }

    private boolean diphthongsComplete(Language l) {
        return l.getDiphthongs() != null;
    }

    private boolean alphabetComplete(Language l) {
        Map<String, String> alphabet = l.getAlphabet();
        return alphabet != null && alphabet.values().stream().anyMatch(this::isNotBlank);
    }

    private boolean stressComplete(Language l) {
        return isNotBlank(l.getStress());
    }

    private boolean phonotacticsComplete(Language l) {
        return isNotBlank(l.getPhonologicalConstraints());
    }

    private boolean vowelHarmonyComplete(Language l) {
        return isNotBlank(l.getVowelHarmony());
    }

    private boolean honorificsComplete(Language l) {
        return l.getHonorifics() != null;
    }

    private boolean verbsComplete(Language l) {
        return l.getConjugation() != null;
    }

    private boolean sentenceStructureComplete(Language l) {
        return l.getSyntax() != null && l.getWordOrder() != null;
    }

    private boolean negationComplete(Language l) {
        return l.getNegation() != null;
    }

    private boolean questionFormingComplete(Language l) {
        return l.getQuestionFormingInfo() != null;
    }

    private boolean vocabComplete(Language l) {
        return l.getVocab() != null && !l.getVocab().isEmpty();
    }

    private boolean phrasesComplete(Language l) {
        return l.getPhrases() != null && !l.getPhrases().isEmpty();
    }

    /* -------- Number System (optional in progress) -------- */

    private boolean numeralSystemComplete(Language l) {
        return isNotBlank(l.getNumeralDescription())
                || l.getBaseNumber() != null
                || (l.getNumerals() != null && !l.getNumerals().isEmpty());
    }

    /* -------------------- Helpers -------------------- */

    private boolean isNotBlank(String s) {
        return s != null && !s.trim().isEmpty();
    }
}
