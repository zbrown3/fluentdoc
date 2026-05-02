package com.fluentdoc.language.model;

import com.fluentdoc.user.LocalUserIds;
import com.fluentdoc.common.service.EncryptionUtil;
import com.fluentdoc.language.dto.PinnedSectionDTO;
import com.fluentdoc.language.enums.LanguageType;
import com.fluentdoc.language.enums.PrivacyLevel;
import com.fluentdoc.story.model.Story;
import com.fluentdoc.user.enums.Reason;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@Entity
@Table(name = "languages")
public class Language {

    @Id
    private String id;

    private LocalDateTime lastUpdated;
    private String lastUpdatedBy;
    private String creatorId;
    private LocalDateTime dateCreated;
    
    @NotBlank(message = "Language Name cannot be blank")
    @Size(min = 2, max = 75, message = "Language Name must be between 2 and 75 characters")
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String name;
    
    @NotBlank(message = "Language Description cannot be blank")
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String description;
    
    @JdbcTypeCode(SqlTypes.JSON)
    private List<Reason> reasons;
    @JdbcTypeCode(SqlTypes.JSON)
    private List<LanguageType> types;
    @JdbcTypeCode(SqlTypes.JSON)
    private List<PinnedSectionDTO> pinnedSections = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    private PrivacyLevel privacyLevel = PrivacyLevel.PRIVATE;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String introduction;
    
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> collaborators = new ArrayList<>();

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String consonantsDescription;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Boolean> consonants;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String vowelsDescription;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Boolean> vowels;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String diphthongs;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, String> alphabet;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String stress;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String phonologicalConstraints;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String vowelHarmony;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String honorifics;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String conjugation;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String syntax;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String wordOrder;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String negation;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String questionFormingInfo;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @JdbcTypeCode(SqlTypes.JSON)
    private List<Map<String, String>> vocab;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @JdbcTypeCode(SqlTypes.JSON)
    private List<Map<String, String>> phrases;
    
    private String flagUrl;
    // number system vars
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String numeralDescription;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private String baseNumber;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @JdbcTypeCode(SqlTypes.JSON)
    private List<Map<String, String>> numerals;

    @JdbcTypeCode(SqlTypes.JSON)
    private ViewSettings viewSettings;

    @OneToOne(cascade = CascadeType.ALL)
    private Story story;

    // Encrypt field for name
    public String getName() {
        if (this.name == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.name);
    }
    
    public void setName(String name) {
        this.name = EncryptionUtil.encrypt(name);
    }
    
    // Encrypt field for description
    public String getDescription() {
        if (this.description == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.description);
    }
    
    public void setDescription(String description) {
        this.description = EncryptionUtil.encrypt(description);
    }
    
    // Encrypt field for introduction
    public String getIntroduction() {
        if (this.introduction == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.introduction);
    }
    
    public void setIntroduction(String introduction) {
        this.introduction = EncryptionUtil.encrypt(introduction);
    }
    
    // Encrypt field for consonantsDescription
    public String getConsonantsDescription() {
        if (this.consonantsDescription == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.consonantsDescription);
    }
    
    public void setConsonantsDescription(String consonantsDescription) {
        this.consonantsDescription = EncryptionUtil.encrypt(consonantsDescription);
    }
    
    // Encrypt field for vowelsDescription
    public String getVowelsDescription() {
        if (this.vowelsDescription == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.vowelsDescription);
    }
    
    public void setVowelsDescription(String vowelsDescription) {
        this.vowelsDescription = EncryptionUtil.encrypt(vowelsDescription);
    }
    
    // Encrypt field for diphthongs
    public String getDiphthongs() {
        if (this.diphthongs == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.diphthongs);
    }
    
    public void setDiphthongs(String diphthongs) {
        this.diphthongs = EncryptionUtil.encrypt(diphthongs);
    }
    
    // Encrypt field for numeralDescription
    public String getNumeralDescription() {
        if (this.numeralDescription == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.numeralDescription);
    }
    
    public void setNumeralDescription(String numeralDescription) {
        this.numeralDescription = EncryptionUtil.encrypt(numeralDescription);
    }
    
    // Encrypt field for baseNumber
    public String getBaseNumber() {
        if (this.baseNumber == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.baseNumber);
    }
    
    public void setBaseNumber(String baseNumber) {
        this.baseNumber = EncryptionUtil.encrypt(baseNumber);
    }
    
    // Encrypt field for stress
    public String getStress() {
        if (this.stress == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.stress);
    }
    
    public void setStress(String stress) {
        this.stress = EncryptionUtil.encrypt(stress);
    }
    
    // Encrypt field for phonologicalConstraints
    public String getPhonologicalConstraints() {
        if (this.phonologicalConstraints == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.phonologicalConstraints);
    }
    
    public void setPhonologicalConstraints(String phonologicalConstraints) {
        this.phonologicalConstraints = EncryptionUtil.encrypt(phonologicalConstraints);
    }
    
    // Encrypt field for vowelHarmony
    public String getVowelHarmony() {
        if (this.vowelHarmony == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.vowelHarmony);
    }
    
    public void setVowelHarmony(String vowelHarmony) {
        this.vowelHarmony = EncryptionUtil.encrypt(vowelHarmony);
    }
    
    // Encrypt field for honorifics
    public String getHonorifics() {
        if (this.honorifics == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.honorifics);
    }
    
    public void setHonorifics(String honorifics) {
        this.honorifics = EncryptionUtil.encrypt(honorifics);
    }
    
    // Encrypt field for conjugation
    public String getConjugation() {
        if (this.conjugation == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.conjugation);
    }
    
    public void setConjugation(String conjugation) {
        this.conjugation = EncryptionUtil.encrypt(conjugation);
    }
    
    // Encrypt field for syntax
    public String getSyntax() {
        if (this.syntax == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.syntax);
    }
    
    public void setSyntax(String syntax) {
        this.syntax = EncryptionUtil.encrypt(syntax);
    }
    
    // Encrypt field for wordOrder
    public String getWordOrder() {
        if (this.wordOrder == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.wordOrder);
    }
    
    public void setWordOrder(String wordOrder) {
        this.wordOrder = EncryptionUtil.encrypt(wordOrder);
    }
    
    // Encrypt field for negation
    public String getNegation() {
        if (this.negation == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.negation);
    }
    
    public void setNegation(String negation) {
        this.negation = EncryptionUtil.encrypt(negation);
    }
    
    // Encrypt field for questionFormingInfo
    public String getQuestionFormingInfo() {
        if (this.questionFormingInfo == null) {
            return null;
        }
        return EncryptionUtil.decrypt(this.questionFormingInfo);
    }
    
    public void setQuestionFormingInfo(String questionFormingInfo) {
        this.questionFormingInfo = EncryptionUtil.encrypt(questionFormingInfo);
    }
    
    // Encrypt field for vocab
    public List<Map<String, String>> getVocab() {
        if (this.vocab == null) {
            return null;
        }
        return this.vocab;
    }

    public void setVocab(List<Map<String, String>> vocab) {
        this.vocab = vocab;
    }

    // Encrypt field for phrases
    public List<Map<String, String>> getPhrases() {
        if (this.phrases == null) {
            return null;
        }
        return this.phrases;
    }
    
    public void setPhrases(List<Map<String, String>> phrases) {
        this.phrases = phrases;
    }
    
    // Encrypt field for numerals
    public List<Map<String, String>> getNumerals() {
        if (this.numerals == null) {
            return null;
        }
        return this.numerals;
    }
    
    public void setNumerals(List<Map<String, String>> numerals) {
        this.numerals = numerals;
    }
    
    // Encrypt field for collaborators
    public List<String> getCollaborators() {
        if (this.collaborators == null) {
            return null;
        }
        return this.collaborators;
    }
    
    public void setCollaborators(List<String> collaborators) {
        this.collaborators = collaborators;
    }
    
    // Encrypt field for alphabet
    public Map<String, String> getAlphabet() {
        if (this.alphabet == null) {
            return null;
        }
        return this.alphabet;
    }
    
    public void setAlphabet(Map<String, String> alphabet) {
        this.alphabet = alphabet;
    }
    
    // Encrypt field for consonants
    public Map<String, Boolean> getConsonants() {
        if (this.consonants == null) {
            return null;
        }
        return this.consonants;
    }
    
    public void setConsonants(Map<String, Boolean> consonants) {
        this.consonants = consonants;
    }
    
    // Encrypt field for vowels
    public Map<String, Boolean> getVowels() {
        if (this.vowels == null) {
            return null;
        }
        return this.vowels;
    }
    
    public void setVowels(Map<String, Boolean> vowels) {
        this.vowels = vowels;
    }

    public int getWordCount() {
        if (this.vocab == null) {
            return 0;
        }
        return this.vocab.size();
    }

    public int getPhraseCount() {
        if (this.phrases == null) {
            return 0;
        }
        return this.phrases.size();
    }

    @PrePersist
    @PreUpdate
    public void beforeSave() {
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
        lastUpdated = LocalDateTime.now();
        if (dateCreated == null) {
            dateCreated = LocalDateTime.now();
        }
        lastUpdatedBy = LocalUserIds.DESKTOP_USER_ID;
    }
}
