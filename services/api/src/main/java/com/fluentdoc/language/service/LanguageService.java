package com.fluentdoc.language.service;

import com.fluentdoc.common.factory.MapperFactory;
import com.fluentdoc.common.service.CommonUtilsService;
import com.fluentdoc.common.service.FileStorageService;
import com.fluentdoc.language.dto.*;
import com.fluentdoc.language.enums.LanguageType;
import com.fluentdoc.language.enums.PrivacyLevel;
import com.fluentdoc.language.model.Language;
import com.fluentdoc.language.model.ViewSettings;
import com.fluentdoc.language.repository.LanguageRepository;
import com.fluentdoc.language.request.CreateLanguageRequest;
import com.fluentdoc.language.request.LanguageSettingsRequest;
import com.fluentdoc.language.request.NumeralSystemRequest;
import com.fluentdoc.language.request.PinnedSectionsRequest;
import com.fluentdoc.story.model.Story;
import com.fluentdoc.story.service.StoryService;
import com.fluentdoc.user.enums.Reason;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.Instant;
import java.time.ZoneId;
import java.util.*;

import static com.fluentdoc.common.util.Constants.TIME_ZONE_ID;

@Service
@Slf4j
public class LanguageService {

    private final LanguageRepository repository;
    private final CommonUtilsService commonUtilsService;
    private final StoryService storyService;
    private final MapperFactory mapperFactory;
    private final FileStorageService fileStorageService;

    public LanguageService(LanguageRepository repository, CommonUtilsService commonUtilsService, StoryService storyService, MapperFactory mapperFactory, FileStorageService fileStorageService) {
        this.repository = repository;
        this.commonUtilsService = commonUtilsService;
        this.storyService = storyService;
        this.mapperFactory = mapperFactory;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Add a new language to the database
     */
    public Language addLanguage(Language newLanguage){
        // add date created to language
        newLanguage.setDateCreated(Instant.now().atZone(ZoneId.of(TIME_ZONE_ID)).toLocalDateTime());
        return repository.save(newLanguage);
    }

    /**
     * Delete a single language from database by id
     */
    public void deleteLanguage(Language language){
        // delete story associated with language
        if (language.getStory() != null) {
            Story story = language.getStory();
            storyService.deleteStory(story);
        }
        repository.delete(language);
    }

    /**
     * Return a single language from database by id
     */
    public Language getLanguageById(String id){
        return repository.findOneById(id);
    }


    /*********************
     ****** UPDATES  *****
     *********************/

    /**
     * Update general info
     * @param id
     * @param generalInfoDto
     */
    public Language updateLanguageGeneralInfo(String id, GeneralInfoDto generalInfoDto){
        Language language = repository.findOneById(id);

        // Set general info for language
        language.setName(generalInfoDto.getName());
        language.setDescription(generalInfoDto.getDescription());
        // set types for language from list of strings
        List<LanguageType> types = new ArrayList<>();
        for (String type : generalInfoDto.getTypes()) {
            types.add(LanguageType.valueOf(type));
        }
        language.setTypes(types);

        // set reasons for language from list of strings
        List<Reason> reasons = new ArrayList<>();
        for (String reason : generalInfoDto.getReasons()) {
            reasons.add(Reason.valueOf(reason));
        }
        language.setReasons(reasons);

        return repository.save(language);
    }

    /**
     * Update Introduction
     * @param id
     * @param introductionDto
     */
    public Language updateLanguageIntroduction(String id, IntroductionDto introductionDto){
        Language language = repository.findOneById(id);

        // Set intro for language
        language.setIntroduction(introductionDto.getIntroduction());

        return repository.save(language);
    }

    /**
     * Update Collaborator
     * @param id
     * @param collaboratorDto
     */
    public Language updateCollaborator(String id, CollaboratorDto collaboratorDto){
        Language language = repository.findOneById(id);

        if (collaboratorDto.getAction().equalsIgnoreCase("add")){
            if (language.getCollaborators() != null){
                List<String> collaboratorList = language.getCollaborators();
                collaboratorList.add(collaboratorDto.getName());
                language.setCollaborators(collaboratorList);
            } else {
                List<String> newCollaborator = new ArrayList<>();
                newCollaborator.add(collaboratorDto.getName());
                language.setCollaborators(newCollaborator);
            }
        } else {
            System.out.println("delete collaborator!");
            if (language.getCollaborators() != null) {
                System.out.println("Its not empty!!");
                List<String> collaboratorList = language.getCollaborators();
                collaboratorList.remove(collaboratorDto.getName());
                language.setCollaborators(collaboratorList);
            }
        }

        return repository.save(language);
    }

    /**
     * Update Consonants
     * @param id
     * @param consonantsDto
     */
    public Language updateConsonants(String id, ConsonantsDto consonantsDto){
        Language language = repository.findOneById(id);

        language.setConsonants(consonantsDto.getConsonants());
        language.setConsonantsDescription(consonantsDto.getDescription());

        return repository.save(language);
    }

    /**
     * Update Vowels
     * @param id
     * @param vowelsDto
     */
    public Language updateVowels(String id, VowelsDto vowelsDto){
        Language language = repository.findOneById(id);

        language.setVowels(vowelsDto.getVowels());
        language.setVowelsDescription(vowelsDto.getDescription());

        return repository.save(language);
    }

    /**
     * Update Vowels
     * @param id
     * @param alphabetDto
     */
    public Language updateAlphabet(String id, AlphabetDto alphabetDto){
        Language language = repository.findOneById(id);

        language.setAlphabet(alphabetDto.getAlphabet());

        return repository.save(language);
    }

    /**
     * Update diphthongs
     * @param id
     * @param diphthongsDto
     */
    public Language updateDiphthongs(String id, DiphthongsDto diphthongsDto){
        Language language = repository.findOneById(id);

        language.setDiphthongs(diphthongsDto.getDiphthongs());

        return repository.save(language);
    }



    /**
     * Update Stress
     * @param id
     * @param stressDto
     */
    public Language updateStress(String id, StressDto stressDto){
        Language language = repository.findOneById(id);

        language.setStress(stressDto.getStress());

        return repository.save(language);
    }

    /**
     * Update Constraints
     * @param id
     * @param constraintsDto
     */
    public Language updateConstraints(String id, PhonologicalConstraintsDto constraintsDto){
        Language language = repository.findOneById(id);

        language.setPhonologicalConstraints(constraintsDto.getConstraints());

        return repository.save(language);
    }

    /**
     * Update Constraints
     *
     * @param id
     * @param vowelHarmonyDto
     * @return
     */
    public Language updateVowelHarmony(String id, VowelHarmonyDto vowelHarmonyDto){
        Language language = repository.findOneById(id);

        language.setVowelHarmony(vowelHarmonyDto.getVowelHarmony());

        return repository.save(language);
    }

    /**
     * Update Conjugation
     * @param id
     * @param conjugationDto
     */
    public Language updateConjugation(String id, ConjugationDto conjugationDto){
        Language language = repository.findOneById(id);

        language.setConjugation(conjugationDto.getConjugation());

        return repository.save(language);
    }


    /**
     * Update Honorifics
     * @param id
     * @param honorificsDto
     */
    public Language updateHonorifics(String id, HonorificsDto honorificsDto){
        Language language = repository.findOneById(id);

        language.setHonorifics(honorificsDto.getHonorifics());

        return repository.save(language);
    }

    /**
     * Update Syntax
     * @param id
     * @param syntaxDto
     */
    public Language updateSyntax(String id, SyntaxDto syntaxDto){
        Language language = repository.findOneById(id);

        language.setWordOrder(syntaxDto.getWordOrder());
        language.setSyntax(syntaxDto.getSyntax());

        return repository.save(language);
    }

    /**
     * Update Negation
     * @param id
     * @param negationDto
     */
    public Language updateNegation(String id, NegationDto negationDto){
        Language language = repository.findOneById(id);

        language.setNegation(negationDto.getNegation());

        return repository.save(language);
    }


    /**
     * Update Question Forming
     * @param id
     * @param questionFormingDto
     */
    public Language updateQuestionForming(String id, QuestionFormingDto questionFormingDto){
        Language language = repository.findOneById(id);

        language.setQuestionFormingInfo(questionFormingDto.getQuestionFormingInfo());

        repository.save(language);

        return repository.save(language);
    }

    /**
     * Update Vocab
     * @param id
     * @param vocabDto
     */
    public Language updateVocab(String id, VocabDto vocabDto){
        Language language = repository.findOneById(id);

        language.setVocab(vocabDto.getVocab());

        return repository.save(language);
    }

    /**
     * Update Phrases
     * @param id
     * @param phrasesDto
     */
    public Language updatePhrases(String id, PhrasesDto phrasesDto){
        Language language = repository.findOneById(id);

        language.setPhrases(phrasesDto.getPhrases());

        return repository.save(language);
    }

    public Language updateNumeralSystem(String id, NumeralSystemRequest request) {
        Language language = repository.findOneById(id);

        // update language based on handler
        if (request.getHandler().equals("description")) {
            language.setNumeralDescription(request.getNumeralDescription());
        } else if (request.getHandler().equals("base")) {
            language.setBaseNumber(request.getBaseNumber());
        } else if (request.getHandler().equals("numerals")) {
            language.setNumerals(request.getNumerals());
        }

        return repository.save(language);
    }


    /*************************
     ****** END UPDATES  *****
     *************************/
    public boolean languageNameExists(String languageName) {
        Language language = repository.findOneByName(languageName);
        return language != null;
    }

    /**
     * Method to generate random language name
     * @return
     */
    public String generateRandomLanguageName() throws IOException {

        // Get a list of natural languages from text file (7053 total)
        // List of natural languages used from source: http://www.muturzikin.com/languages.htm
        // processed to include uncommon items (i.e. South, Southern, Southwester, Creole, etc)
        // 7053 total modified languages
        InputStream is = null;
        BufferedReader br = null;
        List<String> languages = new ArrayList<>();

        try {
            // new input stream created
            is = this.getClass().getClassLoader()
                    .getResourceAsStream("language_names.txt");

            br = new BufferedReader(new InputStreamReader(is));

            String line;

            while ((line = br.readLine()) != null) {
                languages.add(line.substring(0, line.length() -1));
            }

        } catch(Exception e) {
            // if any I/O error occurs
            e.printStackTrace();
        } finally {
            // releases system resources associated with this stream
            if(is!=null)
                is.close();
            if (br != null)
                br.close();
        }

        // select random language from list of languages
        Random rand = new Random();
        String randomLanguage = languages.get(rand.nextInt(languages.size()));

        // Modify randomLanguage by swapping out vowels
        String modifiedLanguage = commonUtilsService.modifyTargetWord(randomLanguage);

        // if language has not been modified from original OR language exists in database,
        // repeat modification with new language name
        while (randomLanguage.equalsIgnoreCase(modifiedLanguage) || repository.findOneByName(modifiedLanguage) != null) {
            randomLanguage = languages.get(rand.nextInt(languages.size()));
            modifiedLanguage = commonUtilsService.modifyTargetWord(randomLanguage);
        }

        // capitalize first letter of language
        modifiedLanguage = StringUtils.capitalize(modifiedLanguage);

        return modifiedLanguage;
    }



    public List<String> getRandomWords(Language language, int count, String targetLanguage) throws IOException {

        // Get a list of words from file depending on target language
        InputStream is = null;
        BufferedReader br = null;
        List<String> wordList = new ArrayList<>();

        try {
            // new input stream created with target language
            is = this.getClass().getClassLoader()
                    .getResourceAsStream("data/" + targetLanguage + ".txt");

            br = new BufferedReader(new InputStreamReader(is));

            String line;

            // iterate through lines and add words to wordList
            while ((line = br.readLine()) != null) {
                String[] words = line.split(" ");
                wordList.addAll(Arrays.asList(words));
            }
        } catch(Exception e) {
            // if any I/O error occurs
            e.printStackTrace();
        } finally {
            // releases system resources associated with this stream
            if(is!=null)
                is.close();
            if (br != null)
                br.close();
        }

        // iterate through list and return 5 words
        List<String> generatedWords = new ArrayList<>();

        // create holder to track random words to process.
        // Note: iterate depending on passed in parameter COUNT
        List<String> wordHolder = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            // get word from wordList
            Random random = new Random();
            String wordToProcess = wordList.get(random.nextInt(wordList.size()));

            //add word to wordHolder
            wordHolder.add(wordToProcess);

            // replace vowels in word
            wordToProcess = commonUtilsService.modifyTargetWord(wordToProcess, language);

            // if the word is already in holder, get a new word
            while (wordHolder.contains(wordToProcess)) {
                wordToProcess = commonUtilsService.modifyTargetWord(wordToProcess, language);
            }

            // ensure that the word isn't an original word in the data list
            while (wordList.contains(wordToProcess)) {
                wordToProcess = commonUtilsService.modifyTargetWord(wordToProcess, language);
            }

            generatedWords.add(wordToProcess);
        }

        return generatedWords;
    }


    public boolean updateLanguageFlag(Language language, MultipartFile file) throws IOException {
        if (language == null || file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Language and file are required");
        }

        String langName = Objects.requireNonNull(language.getName(), "Language name is required");
        String original = Objects.requireNonNull(file.getOriginalFilename(), "Original filename is required");
        int dot = original.lastIndexOf('.');
        String ext = (dot >= 0) ? original.substring(dot) : "";

        String key = "languages/" + language.getId() + "/" +
                langName.toLowerCase().replace(" ", "_") + "_flag_" + java.util.UUID.randomUUID() + ext;

        if (language.getFlagUrl() != null && !language.getFlagUrl().isBlank()) {
            String existingFileName = language.getFlagUrl().substring(language.getFlagUrl().lastIndexOf('/') + 1);
            String existingKey = "languages/" + language.getId() + "/" + existingFileName;
            if (!existingKey.equals(key)) {
                fileStorageService.delete(existingKey);
            }
        }

        String url = fileStorageService.upload(key, file.getBytes(), file.getContentType());
        language.setFlagUrl(url);
        repository.save(language);

        log.info("Flag uploaded successfully: {}", url);
        return true;
    }


    public boolean deleteLanguageFlag(Language language) {
        if (language == null || language.getFlagUrl() == null || language.getFlagUrl().isBlank()) {
            log.info("No flag URL to delete for language id={}", language != null ? language.getId() : "null");
            return true;
        }

        try {
            String url = language.getFlagUrl();
            int q = url.indexOf('?');
            if (q >= 0) url = url.substring(0, q);
            int hash = url.indexOf('#');
            if (hash >= 0) url = url.substring(0, hash);

            String fileName = url.substring(url.lastIndexOf('/') + 1);
            String key = "languages/" + language.getId() + "/" + fileName;

            fileStorageService.delete(key);

            language.setFlagUrl(null);
            repository.save(language);

            log.info("Flag deleted. key={}", key);
            return true;
        } catch (Exception e) {
            log.error("Unexpected error deleting flag: {}", e.getMessage());
            return false;
        }
    }



    public Language createLanguage(CreateLanguageRequest createLanguageRequest, String id) {
        Language newLanguage = mapperFactory.map(createLanguageRequest, Language.class);
        newLanguage.setCreatorId(id);

        // add date created to language
        newLanguage.setDateCreated(Instant.now().atZone(ZoneId.of(TIME_ZONE_ID)).toLocalDateTime());

        // Add story to language if boolean exists
        if (createLanguageRequest.isIncludeStory()) {
            // add story to language
            Story story = new Story();
            newLanguage.setStory(storyService.addStory(story));
        }
        return repository.save(newLanguage);
    }

    public Language updateLanguageSettings(String id, LanguageSettingsRequest languageSettingsRequest) {
        Language language = repository.findOneById(id);

        language.setPrivacyLevel(languageSettingsRequest.getPrivacyLevel());

        return repository.save(language);
    }

    public Language updatePinnedSections(String id, PinnedSectionsRequest pinnedSectionsRequest) {
        Language language = repository.findOneById(id);

        language.setPinnedSections(pinnedSectionsRequest.getPinnedSections());

        return repository.save(language);
    }

    public Language addEntriesToLanguage(String languageId, List<Map<String, String>> entries) {
        Language language = repository.findOneById(languageId);

        if (language == null) {
            log.error("Language not found with ID: {}", languageId);
            throw new RuntimeException("Language not found");
        }

        // Ensure vocab is mutable
        List<Map<String, String>> updatedVocab =
                (language.getVocab() != null) ? new ArrayList<>(language.getVocab()) : new ArrayList<>();


        // Convert all entries to mutable HashMaps before adding
        List<Map<String, String>> mutableEntries = new ArrayList<>();
        for (Map<String, String> entry : entries) {
            mutableEntries.add(new HashMap<>(entry));
        }

        updatedVocab.addAll(mutableEntries);
        language.setVocab(updatedVocab);

        return repository.save(language);
    }

    public Language addPhrasesToLanguage(String languageId, List<Map<String, String>> entries) {
        Language language = repository.findOneById(languageId);

        if (language == null) {
            log.error("Language not found with ID: {}", languageId);
            throw new RuntimeException("Language not found");
        }

        // Ensure vocab is mutable
        List<Map<String, String>> updatedPhrases =
                (language.getPhrases() != null) ? new ArrayList<>(language.getPhrases()) : new ArrayList<>();


        // Convert all entries to mutable HashMaps before adding
        List<Map<String, String>> mutableEntries = new ArrayList<>();
        for (Map<String, String> entry : entries) {
            mutableEntries.add(new HashMap<>(entry));
        }

        updatedPhrases.addAll(mutableEntries);
        language.setPhrases(updatedPhrases);

        return repository.save(language);
    }

    public Boolean userHasLanguages(String userId) {
        List<Language> languages = repository.findAllByCreatorId(userId);
        return languages != null && !languages.isEmpty();
    }

    public Boolean userHasPhonology(String userId) {
        List<Language> languages = repository.findAllByCreatorId(userId);
        if (languages == null || languages.isEmpty()) {
            return false;
        }
        for (Language language : languages) {
            if (language.getConsonants() != null || language.getVowels() != null || language.getAlphabet() != null ||
                    language.getDiphthongs() != null || language.getStress() != null || language.getPhonologicalConstraints() != null ||
                    language.getVowelHarmony() != null) {
                return true;
            }
        }
        return false;
    }

    public Boolean userHasVocabulary(String userId) {
        List<Language> languages = repository.findAllByCreatorId(userId);
        if (languages == null || languages.isEmpty()) {
            return false;
        }
        for (Language language : languages) {
            if (language.getVocab() != null && !language.getVocab().isEmpty()) {
                return true;
            }
        }
        return false;
    }

    public Boolean userHasPhrases(String userId) {
        List<Language> languages = repository.findAllByCreatorId(userId);
        if (languages == null || languages.isEmpty()) {
            return false;
        }
        for (Language language : languages) {
            if (language.getPhrases() != null && !language.getPhrases().isEmpty()) {
                return true;
            }
        }
        return false;
    }

    public Language updateViewSettings(String id, ViewSettings newSettings) {
        Language language = repository.findOneById(id);
        if (language == null) {
            throw new RuntimeException("Language not found with ID: " + id);
        }

        ViewSettings existingSettings = language.getViewSettings();
        if (existingSettings == null) {
            existingSettings = new ViewSettings();
        }

        // Update fields
        existingSettings.setIncludeLanguageFlag(newSettings.isIncludeLanguageFlag());
        existingSettings.setUseFlagColors(newSettings.isUseFlagColors());
        existingSettings.setColors(newSettings.getColors());
        existingSettings.setHiddenSections(newSettings.getHiddenSections());

        language.setViewSettings(existingSettings);
        return repository.save(language);
    }
}
