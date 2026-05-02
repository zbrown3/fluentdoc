package com.fluentdoc.user.service;

import com.fluentdoc.user.LocalUserIds;
import com.fluentdoc.common.factory.MapperFactory;
import com.fluentdoc.common.response.BaseException;
import com.fluentdoc.common.response.BaseServiceErrorCode;
import com.fluentdoc.common.service.FileStorageService;
import com.fluentdoc.common.service.Hasher;
import com.fluentdoc.common.service.CommonUtilsService;
import com.fluentdoc.language.dto.LanguageInfoDto;
import com.fluentdoc.language.enums.PrivacyLevel;
import com.fluentdoc.language.model.Language;
import com.fluentdoc.language.repository.LanguageRepository;
import com.fluentdoc.story.service.StoryService;
import com.fluentdoc.user.dto.UserProfileDTO;
import com.fluentdoc.user.model.User;
import com.fluentdoc.user.repository.UserRepository;
import com.fluentdoc.user.request.AccountSetupRequest;
import com.fluentdoc.user.request.UserProfileRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

import static com.fluentdoc.common.util.Constants.TAG_COLLABORATIVE;
import static com.fluentdoc.common.util.Constants.TAG_SHARING;

@Service
@Slf4j
public class UserService {

    private final UserRepository repository;
    private final Hasher hasher;
    private final LanguageRepository languageRepository;
    private final StoryService storyService;
    private final MapperFactory mapperFactory;
    private final CommonUtilsService commonUtilsService;
    private final FileStorageService fileStorageService;

    public UserService(UserRepository repository,
                       Hasher hasher,
                       LanguageRepository languageRepository,
                       StoryService storyService,
                       MapperFactory mapperFactory,
                       CommonUtilsService commonUtilsService,
                       FileStorageService fileStorageService) {
        this.repository = repository;
        this.hasher = hasher;
        this.languageRepository = languageRepository;
        this.storyService = storyService;
        this.mapperFactory = mapperFactory;
        this.commonUtilsService = commonUtilsService;
        this.fileStorageService = fileStorageService;
    }

    public List<User> getAllUsers() {
        return repository.findAll();
    }

    // return whether user exists
    public boolean userExists(String email) {
        return repository.findOneByEmail(email) != null;
    }

    // create a new user
    public User createUser(User newUser) {
        String randomizedName = createRandomUsername();
        // set default username for user
        newUser.setUsername(randomizedName);
        // set default display name
        newUser.setDisplayName(randomizedName);
        // set created date for user
        newUser.setDateCreated(LocalDateTime.now());
        // set user role
        newUser.setRoles(List.of("ROLE_USER"));
        return repository.save(newUser);
    }

    // create random username with the format "p_" + random alphanumeric string of 7 characters
    // ensure the username is unique
    private String createRandomUsername() {
        String username = "p_" + UUID.randomUUID().toString().substring(0, 7);
        while (repository.findOneByUsername(username) != null) {
            username = "p_" + UUID.randomUUID().toString().substring(0, 7);
        }
        return username;
    }

    // get user by email
    public User getUserByEmail(String email) {
        return repository.findOneByEmail(email);
    }

    // update last login time for user
    public void updateLastLogin(User user) {
        user.setLastLogin(LocalDateTime.now());
        repository.save(user);
    }

    // get user by id
    public User getUser(String id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException(BaseServiceErrorCode.USER_NOT_FOUND.getMessage()));
    }

    // TODO: update this method to only return what's needed
    // get profile for user
    // this is an internal method
    public UserProfileDTO getUserProfileById(String id) {
        User user = getUser(id);
        UserProfileDTO profileDTO = mapperFactory.map(user, UserProfileDTO.class);

        profileDTO.setNumberOfLanguages(user.getLanguages().size());
        profileDTO.setNumberOfWords(user.getLanguages().stream().mapToInt(Language::getWordCount).sum());
        profileDTO.setNumberOfPhrases(user.getLanguages().stream().mapToInt(Language::getPhraseCount).sum());

        // filter out private languages
        List<LanguageInfoDto> publicLanguages = mapperFactory.map(
                user.getLanguages().stream().filter(language -> language.getPrivacyLevel().equals(PrivacyLevel.PUBLIC)).toList(), LanguageInfoDto.class);
        profileDTO.setLanguages(publicLanguages);

        return profileDTO;
    }

    // get stats for user
    public UserProfileDTO getUserProfileWithStats(String id) {
        User user = getUser(id);
        UserProfileDTO profileDTO = mapperFactory.map(user, UserProfileDTO.class);

        profileDTO.setNumberOfLanguages(user.getLanguages().size());
        profileDTO.setNumberOfWords(user.getLanguages().stream().mapToInt(Language::getWordCount).sum());
        profileDTO.setNumberOfPhrases(user.getLanguages().stream().mapToInt(Language::getPhraseCount).sum());

        return profileDTO;
    }

    // return whether user has language with id
    public boolean hasLanguage(String userId, String languageId) {
        User user = getUser(userId);
        return user.getLanguages().stream().anyMatch(language -> language.getId().equals(languageId));
    }

    /**
     * Update user password
     */
    public User updatePassword(User updateUser, String password) {

        // hash password
        String hashedPassword = hasher.hashValue(password);

        // get database user matching this users Id
        User user = getUser(updateUser.getId());

        user.setPassword(hashedPassword);

        // save user changes
        return repository.save(user);
    }

    /**
     * Add language to user document
     */
    public void addLanguageToUserDocument(User user, Language newLanguage) {
        log.info("Adding new language with the name: " + newLanguage.getName() + " for user with email: " + user.getEmail());
        user.getLanguages().add(newLanguage);
        repository.save(user);
    }

    /**
     * Edit language for user
     */
    public void saveLanguageToUserObject(Language updateLanguage) {
        User user = getUser(updateLanguage.getCreatorId());
        List<Language> userLanguages = user.getLanguages();

        int indexCounter = 0;
        for (Language language : userLanguages) {
            if (language.getId().equals(updateLanguage.getId())) {
                userLanguages.set(indexCounter, updateLanguage);
            }
            indexCounter++;
        }

        user.setLanguages(userLanguages);
        repository.save(user);
    }

    /**
     * Remove language from user Document
     */
    public void removeLanguageFromUserDocument(Language language) {
        // find user by language creator Id
        Optional<User> user = repository.findById(language.getCreatorId());
        if (user.isEmpty()) {
            throw new RuntimeException(BaseServiceErrorCode.USER_NOT_FOUND.getMessage());
        }
        // Iterate through languages and delete language
        List<Language> userLanguages = user.get().getLanguages();
        for (Language lang : userLanguages) {
            if (lang.getId().equals(language.getId())) {
                if (userLanguages.remove(lang)) {
                    break;
                }
            }
        }
        repository.save(user.get());
    }

    public boolean emailAlreadyExists(String email) {
        return repository.findOneByEmail(email) != null;
    }

    public void updateAccountSetupInfo(User user, AccountSetupRequest request) {
        user.setExperience(request.getExperience());
        // set sharing and collaborative to user tags
        user.getTags().put(TAG_SHARING, request.isShareLanguage());
        user.getTags().put(TAG_COLLABORATIVE, request.isCollaborative());
        repository.save(user);
    }

    /**
     * Update user information
     * Update name and about me sections
     */
    public User updateUserProfileInformation(User updateUser, UserProfileRequest userProfileRequest) {

        // get database user matching this users id
        User user = repository.findOneById(updateUser.getId());

        // verify if  username already exists
        if (!updateUser.getUsername().equals(userProfileRequest.getUsername()) && repository.findOneByUsername(userProfileRequest.getUsername()) != null) {
            throw new BaseException(BaseServiceErrorCode.USERNAME_EXISTS_ERROR.getCode() ,BaseServiceErrorCode.USERNAME_EXISTS_ERROR.getMessage(), HttpStatus.BAD_REQUEST);
        }

        // set  username
        user.setUsername(userProfileRequest.getUsername());

        // set display name
        user.setDisplayName(userProfileRequest.getDisplayName());

        // set bio
        user.setBio(userProfileRequest.getBio());

        // set profile image url
        user.setProfileImageUrl(userProfileRequest.getProfileImageUrl());

        // set experience level if it is in the request
        if (userProfileRequest.getExperience() != null) {
            user.setExperience(userProfileRequest.getExperience());
        }

        // save user changes
        return repository.save(user);
    }

    /**
     * Update user email
     */
    public boolean updateUserEmail(User updateUser, String email) {
        // if email already exists throw error
        if (emailAlreadyExists(email)) {
            throw new RuntimeException(BaseServiceErrorCode.EMAIL_EXISTS_ERROR.getMessage());
        }

        // get database user matching this users Id
        User user = repository.findOneById(updateUser.getId());

        user.setEmail(email);
        repository.save(user);
        return true;
    }

    /**
     * Delete a single user from database by id
     */
    public void deleteUser(User user) {

        // remove associated languages from user
        List<Language> userLanguages = user.getLanguages();
        // delete all stories associated with languages
        userLanguages.forEach(storyService::deleteStoriesByLanguage);

        languageRepository.deleteAll(userLanguages);

        repository.delete(user);
    }

    public void setEmailNotifications(User user, Map<String, Boolean> notifications) {
        user.setEmailNotifications(notifications);
        repository.save(user);
    }

    /**
     * Create a new admin
     */
    public void createAdmin(User admin) {
        admin.setRoles(Collections.singletonList("ROLE_ADMIN"));
        admin.setDateCreated(LocalDateTime.now());
        repository.save(admin);
    }

    public boolean isAdmin(User adminUser) {
        return adminUser.getRoles() != null && adminUser.getRoles().contains("ROLE_ADMIN");
    }

    public List<User> getNonAdminUsers() {
        return repository.findAllByRolesContaining("ROLE_USER");
    }

    public void updateUser(User dbUser) {
        repository.save(dbUser);
    }

    public User getCurrentUser() {
        return repository.findById(LocalUserIds.DESKTOP_USER_ID)
                .orElseThrow(() -> new RuntimeException(BaseServiceErrorCode.USER_NOT_FOUND.getMessage()));
    }

    public void saveUser(User user) {

    }

    /**
     * Ensures the fixed desktop local user exists. Uses one read-write transaction so JDBC
     * {@code setReadOnly} is not applied on a SQLite connection opened without that flag.
     */
    @Transactional
    public void ensureDesktopLocalUser() {
        String id = LocalUserIds.DESKTOP_USER_ID;
        User u = repository.findById(id).orElse(null);
        if (u == null) {
            u = new User();
            u.setId(id);
        }
        u.setEmail("desktop@local");
        u.setName("User");
        u.setUsername("User");
        u.setDisplayName("User");
        u.setPassword("desktop-no-login");
        if (u.getRoles() == null || u.getRoles().isEmpty()) {
            u.setRoles(List.of("ROLE_USER"));
        }
        repository.save(u);
    }
}

