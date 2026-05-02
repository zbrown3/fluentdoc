package com.fluentdoc.language.controller;

import com.fluentdoc.common.factory.MapperFactory;
import com.fluentdoc.common.response.BaseResponse;
import com.fluentdoc.common.response.BaseResponseBuilder;
import com.fluentdoc.common.response.BaseServiceErrorCode;
import com.fluentdoc.language.dto.*;
import com.fluentdoc.language.model.Language;
import com.fluentdoc.language.model.ViewSettings;
import com.fluentdoc.language.request.*;
import com.fluentdoc.language.response.CreateLanguageResponse;
import com.fluentdoc.language.response.LanguageViewResponse;
import com.fluentdoc.language.service.LanguageProgressService;
import com.fluentdoc.language.service.LanguageService;
import com.fluentdoc.user.dto.LanguageCreatorDTO;
import com.fluentdoc.user.model.User;
import com.fluentdoc.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Collections.emptyList;

@Tag(name = "Language", description = "Endpoints for Language Operations")
@RestController
@RequestMapping("/languages")
@Slf4j
public class LanguageController {

    private final LanguageService languageService;
    private final UserService userService;
    private final MapperFactory mapperFactory;

    public LanguageController(LanguageService languageService,
                              UserService userService,
                              MapperFactory mapperFactory,
                              LanguageProgressService languageProgressService) {
        this.languageService = languageService;
        this.userService = userService;
        this.mapperFactory = mapperFactory;
    }

    /**
     * Endpoint to get language by Id
     */
    @GetMapping(value="/{id:.+}")
    public ResponseEntity<BaseResponse> getLanguageById(@PathVariable String id){
        log.info("Request sent for language with id: {}", id);

        Language language = languageService.getLanguageById(id);
        if (language == null){
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        User user = userService.getCurrentUser();

        Map<String, Object> limits = unlimitedLimits();
        Map<String, Object> usage = usageForUser(user);

        LanguageViewResponse response = new LanguageViewResponse();
        response.setLanguage(language);
        response.setLimits(limits);
        response.setUsage(usage);

        return BaseResponseBuilder.buildSuccessResponse(response);
    }

    /**
     * Endpoint to create a new language
     */
    @PostMapping
    public ResponseEntity<BaseResponse> createLanguage(@RequestBody @Valid CreateLanguageRequest createLanguageRequest) {
        log.info("Request sent to create a new language");

        String id = userService.getCurrentUser().getId();
        // Get user object from Database
        User user = userService.getUser(id);

        Language createdLanguage = languageService.createLanguage(createLanguageRequest, id);

        // add this language to a user document
        userService.addLanguageToUserDocument(user, createdLanguage);

        CreateLanguageResponse createLanguageResponse = new CreateLanguageResponse();
        createLanguageResponse.setLanguage(createdLanguage);
        createLanguageResponse.setFirstLanguage(user.getLanguages().size() == 1);

        return BaseResponseBuilder.buildSuccessResponse(createLanguageResponse);
    }

    /**
     * Endpoint to delete a language from database by Id
     * @param id
     * @return
     */
    @DeleteMapping(value="/{id:.+}")
    public ResponseEntity<BaseResponse> deleteLanguage(@PathVariable String id){
        log.info("Delete request for story with id: {}", id);
        Map<String, Object> response = new HashMap<>();

        Language language = languageService.getLanguageById(id);

        // If language doesn't exist in database, return error
        if (language == null){
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        else {
            userService.removeLanguageFromUserDocument(language);
            log.info("language with Id: " + id + " has been removed from associated user");
            languageService.deleteLanguage(language);
            log.info("language with Id: " + id + " deleted.");
            return BaseResponseBuilder.buildSuccessResponse(response);
        }
    }

    /**
     * Endpoint to update language general section
     * @param id
     * @param generalInfoDto
     * @return
     */
    @PutMapping(value="/{id:.+}/general-info")
    public ResponseEntity<BaseResponse> updateLanguageGeneralInfo(@PathVariable String id, @RequestBody @Valid GeneralInfoDto generalInfoDto){
        log.info("Update General Info Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateLanguageGeneralInfo(id, generalInfoDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language settings
     */
    @PutMapping(value="/{id:.+}/settings")
    public ResponseEntity<BaseResponse> updateLanguageSettings(@PathVariable String id, @RequestBody @Valid LanguageSettingsRequest languageSettingsRequest){
        log.info("Update Language Settings Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateLanguageSettings(id, languageSettingsRequest);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update pinned sections for language
     */
    @PutMapping(value="/{id:.+}/pinned-sections")
    public ResponseEntity<BaseResponse> updatePinnedSections(@PathVariable String id, @RequestBody @Valid PinnedSectionsRequest pinnedSectionsRequest){
        log.info("Update Pinned Sections Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updatePinnedSections(id, pinnedSectionsRequest);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language introduction section
     * @param id
     * @param introductionDto
     * @return
     */
    @PutMapping(value="/{id:.+}/introduction")
    public ResponseEntity<BaseResponse> updateIntroduction(@PathVariable String id, @RequestBody @Valid IntroductionDto introductionDto){
        log.info("Update Introduction Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateLanguageIntroduction(id, introductionDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language collaborators section
     * @param id
     * @param collaboratorDto
     * @return
     */
    @PutMapping(value="/{id:.+}/collaborator")
    public ResponseEntity<BaseResponse> updateCollaborator(@PathVariable String id, @RequestBody @Valid CollaboratorDto collaboratorDto){
        log.info("Update Collaborator Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateCollaborator(id, collaboratorDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language consonants section
     * @param id
     * @param consonantsDto
     * @return
     */
    @PutMapping(value="/{id:.+}/consonants")
    public ResponseEntity<BaseResponse> updateConsonants(@PathVariable String id, @RequestBody @Valid ConsonantsDto consonantsDto){
        log.info("Update Consonants Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateConsonants(id, consonantsDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language vowels section
     * @param id
     * @param vowelsDto
     * @return
     */
    @PutMapping(value="/{id:.+}/vowels")
    public ResponseEntity<BaseResponse> updateVowels(@PathVariable String id, @RequestBody @Valid VowelsDto vowelsDto){
        log.info("Update Vowels Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateVowels(id, vowelsDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language diphthongs section
     * @param id
     * @param diphthongsDto
     * @return
     */
    @PutMapping(value="/{id:.+}/diphthongs")
    public ResponseEntity<BaseResponse> updateDiphthongs(@PathVariable String id, @RequestBody @Valid DiphthongsDto diphthongsDto){
        log.info("Update Diphthongs Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateDiphthongs(id, diphthongsDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language alphabet section
     * @param id
     * @param alphabetDto
     * @return
     */
    @PutMapping(value="/{id:.+}/alphabet")
    public ResponseEntity<BaseResponse> updateAlphabet(@PathVariable String id, @RequestBody @Valid AlphabetDto alphabetDto){
        log.info("Update Alphabet Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateAlphabet(id, alphabetDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language stress section
     * @param id
     * @param stressDto
     * @return
     */
    @PutMapping(value="/{id:.+}/stress")
    public ResponseEntity<BaseResponse> updateStress(@PathVariable String id, @RequestBody @Valid StressDto stressDto){
        log.info("Update Stress Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateStress(id, stressDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language phonological constraints section
     * @param id
     * @param constraintsDto
     * @return
     */
    @PutMapping(value="/{id:.+}/constraints")
    public ResponseEntity<BaseResponse> updateConsonants(@PathVariable String id, @RequestBody @Valid PhonologicalConstraintsDto constraintsDto){
        log.info("Update Phonological Constraints Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateConstraints(id, constraintsDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language vowel harmony section
     * @param id
     * @param vowelHarmonyDto
     * @return
     */
    @PutMapping(value="/{id:.+}/vowelHarmony")
    public ResponseEntity<BaseResponse> updateVowelHarmony(@PathVariable String id, @RequestBody @Valid VowelHarmonyDto vowelHarmonyDto){
        log.info("Update Vowel Harmony Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateVowelHarmony(id, vowelHarmonyDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language honorifics section
     * @param id
     * @param honorificsDto
     * @return
     */
    @PutMapping(value="/{id:.+}/honorifics")
    public ResponseEntity<BaseResponse> updateHonorifics(@PathVariable String id, @RequestBody @Valid HonorificsDto honorificsDto){
        log.info("Update Honorifics Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateHonorifics(id, honorificsDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language conjugation section
     * @param id
     * @param conjugationDto
     * @return
     */
    @PutMapping(value="/{id:.+}/conjugation")
    public ResponseEntity<BaseResponse> updateConjugation(@PathVariable String id, @RequestBody @Valid ConjugationDto conjugationDto){
        log.info("Update Conjugation Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateConjugation(id, conjugationDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update syntax negation section
     * @param id
     * @param syntaxDto
     * @return
     */
    @PutMapping(value="/{id:.+}/syntax")
    public ResponseEntity<BaseResponse> updateSyntax(@PathVariable String id, @RequestBody @Valid SyntaxDto syntaxDto){
        log.info("Update Syntax Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateSyntax(id, syntaxDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language negation section
     * @param id
     * @param negationDto
     * @return
     */
    @PutMapping(value="/{id:.+}/negation")
    public ResponseEntity<BaseResponse> updateNegation(@PathVariable String id, @RequestBody @Valid NegationDto negationDto){
        log.info("Update Negation Request sent for language with id: " + id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateNegation(id, negationDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language question forming section
     * @param id
     * @param questionFormingDto
     * @return
     */
    @PutMapping(value="/{id:.+}/questionForming")
    public ResponseEntity<BaseResponse> updateQuestionForming(@PathVariable String id, @RequestBody @Valid QuestionFormingDto questionFormingDto){
        log.info("Update Question Forming Request sent for language with id: " + id);
        Map<String, Object> response = new HashMap<>();


        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateQuestionForming(id, questionFormingDto);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Endpoint to update language vocab section
     * @param id
     * @param vocabDto
     * @return
     */
    @PutMapping(value="/{id:.+}/vocab")
    public ResponseEntity<BaseResponse> updateVocab(@PathVariable String id, @RequestBody @Valid VocabDto vocabDto){
        log.info("Update Vocab Request sent for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language updatedLanguage = languageService.updateVocab(id, vocabDto);

        return BaseResponseBuilder.buildSuccessResponse(updatedLanguage);
    }

    /**
     * Endpoint to update language words and phrases section
     */
    @PutMapping(value="/{id:.+}/phrases")
    public ResponseEntity<BaseResponse> updatePhrases(@PathVariable String id, @RequestBody @Valid PhrasesDto phrasesDto){
        log.info("Update Phrases Request sent for language with id: {}", id);
        Map<String, Object> response = new HashMap<>();


        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language updatedLanguage = languageService.updatePhrases(id, phrasesDto);

        return BaseResponseBuilder.buildSuccessResponse(updatedLanguage);
    }
    

    /**
     * Update language flag
     */
    @PostMapping(value = "/{id:.+}/language-flag")
    public ResponseEntity<BaseResponse> updateLanguageFlag(@PathVariable String id, @RequestPart("file") MultipartFile file) throws IOException {
        log.info("Request sent to add language flag for language with id: {}", id);

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // Get Language Object from Database
        Language language = languageService.getLanguageById(id);

        if (!languageService.updateLanguageFlag(language, file)) {
            BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        return BaseResponseBuilder.buildSuccessResponse(new HashMap<>());
    }

    /**
     * Update language flag
     */
    @DeleteMapping(value = "/{id:.+}/language-flag")
    public ResponseEntity<BaseResponse> deleteLanguageFlag(@PathVariable String id) {
        log.info("Request sent to delete language flag");

        ResponseEntity<BaseResponse> validation = isValidLanguageAndUserError(id);
        if (validation != null) {
            return validation;
        }

        Language language = languageService.getLanguageById(id);

        if (!languageService.deleteLanguageFlag(language)) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.FILE_STORAGE_ERROR);
        }

        return BaseResponseBuilder.buildSuccessResponse(new HashMap<>());
    }


    /**
     * Update Language Number System Data
     */
    @PutMapping(value="/{id:.+}/numeralSystem")
    public ResponseEntity<BaseResponse> updateBaseNumberSystem(@PathVariable String id, @RequestBody @Valid NumeralSystemRequest numeralSystemRequest) {
        log.info("Update Number System Request sent for language with id: {}", id);
        Map<String, Object> response = new HashMap<>();

        if (isValidLanguageAndUserError(id) != null) {
            return isValidLanguageAndUserError(id);
        }

        // update existing language object in database
        Language language = languageService.updateNumeralSystem(id, numeralSystemRequest);

        return BaseResponseBuilder.buildSuccessResponse(language);
    }

    /**
     * Generate Random Language Name
     * @return
     * @throws IOException
     */
    @GetMapping(value = "/generate-name")
    public ResponseEntity<BaseResponse> getRandomLanguage() throws IOException {
        log.info("Request sent for random generated language name");
        Map<String, Object> response = new HashMap<>();

        String generatedLanguage = languageService.generateRandomLanguageName();

        response.put("randomLanguage", generatedLanguage);

        return BaseResponseBuilder.buildSuccessResponse(response);
    }

    @PostMapping(value = "/{id:.+}/randomWords")
    public ResponseEntity<BaseResponse> getRandomWords(@PathVariable String id, @RequestBody @Valid RandomWordRequest randomWordRequest) throws IOException {
        log.info("Request sent for random words for language with id: {}", id);
        Map<String, Object> response = new HashMap<>();

        // Get Language Object from Database
        Language language = languageService.getLanguageById(id);
        List<String> generatedWords = languageService.getRandomWords(language, randomWordRequest.getCount(), randomWordRequest.getTarget());
        response.put("words", generatedWords);


        return BaseResponseBuilder.buildSuccessResponse(response);
    }

    /**
     * Check if languageId passed in is Valid and that a valid user is still associated with the language
     * // TODO: Check if userId needs to be verified at all? No language should be able to exist in system without user
     */
    private ResponseEntity<BaseResponse> isValidLanguageAndUserError(String id) {

        ResponseEntity<BaseResponse> response = null;

        // Get Language Object from Database
        Language language = languageService.getLanguageById(id);

        // If language doesn't exist in database, return error
        if (language == null){
            response = BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        // get user associated with this language
        assert language != null;
        User user = userService.getUser(language.getCreatorId());

        // If user doesn't exist in database, return error
        if (user == null){
            response = BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        return response;
    }

    private static Map<String, Object> unlimitedLimits() {
        Map<String, Object> limits = new HashMap<>();
        limits.put("languages", -1);
        limits.put("words", -1);
        limits.put("phrases", -1);
        return limits;
    }

    private static Map<String, Object> usageForUser(User user) {
        Map<String, Object> usage = new HashMap<>();
        List<Language> langs = user.getLanguages() != null ? user.getLanguages() : emptyList();
        usage.put("languages", langs.size());
        usage.put("words", langs.stream().mapToInt(Language::getWordCount).sum());
        usage.put("phrases", langs.stream().mapToInt(Language::getPhraseCount).sum());
        return usage;
    }
}
