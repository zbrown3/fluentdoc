package com.fluentdoc.user.controller;


import com.fluentdoc.common.security.PasswordMatcher;
import com.fluentdoc.common.factory.MapperFactory;
import com.fluentdoc.common.response.BaseResponse;
import com.fluentdoc.common.response.BaseResponseBuilder;
import com.fluentdoc.common.response.BaseServiceErrorCode;
import com.fluentdoc.language.service.LanguageProgressService;
import com.fluentdoc.user.dto.UserAccountDetailsDTO;
import com.fluentdoc.user.dto.UserDTO;
import com.fluentdoc.user.dto.UserProfileDTO;
import com.fluentdoc.user.model.User;
import com.fluentdoc.user.request.*;
import com.fluentdoc.user.response.DashboardViewResponse;
import com.fluentdoc.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "User", description = "Endpoints for user operations")
@RestController
@RequestMapping("/users")
@Slf4j
public class UserController {

    private final UserService userService;
    private final MapperFactory mapperFactory;
    private final PasswordMatcher passwordMatcher;
    private final LanguageProgressService languageProgressService;

    public UserController(UserService userService,
                          MapperFactory mapperFactory,
                          PasswordMatcher passwordMatcher,
                          LanguageProgressService languageProgressService) {
        this.userService = userService;
        this.mapperFactory = mapperFactory;
        this.passwordMatcher = passwordMatcher;
        this.languageProgressService = languageProgressService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse> getAllUsers() {
        try {
            List<UserDTO> users = mapperFactory.map(userService.getAllUsers(), UserDTO.class);
            return BaseResponseBuilder.buildSuccessResponse(users);
        } catch (Exception e) {
            log.error("Error: {}", e.getMessage());
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.GENERIC_ERROR);
        }
    }

    @GetMapping("/{id:.+}")
    public ResponseEntity<BaseResponse> getUser(@PathVariable String id) {
        try {
            User user = userService.getUser(id);

            UserDTO userDTO = mapperFactory.map(user, UserDTO.class);
            return BaseResponseBuilder.buildSuccessResponse(userDTO);
        } catch (Exception e) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.GENERIC_ERROR);
        }
    }

    @GetMapping(value = "/{id:.+}/profile")
    public ResponseEntity<BaseResponse> getUserProfileInfo(@PathVariable String id) {
        log.info("profile info requested for user with id: {}", id);

        // Get user object from Database
        UserProfileDTO user = userService.getUserProfileById(id);

        // for each language, set the language progress percentage
        user.getLanguages().forEach(language -> {
            int progress = languageProgressService.getLanguageProgressPercentage(language.getId());
            language.setProgressPercentage(progress);
        });
        user.setLanguages(user.getLanguages());

        log.info("Profile info for user with Id: {} returned", id);
        return BaseResponseBuilder.buildSuccessResponse(user);
    }

    @GetMapping(value = "/{id:.+}/dashboard")
    public ResponseEntity<BaseResponse> getUserDashboard(@PathVariable String id) {
        log.info("Dashboard info requested for user with id: {}", id);

        // Get user object from Database
        UserProfileDTO user = userService.getUserProfileWithStats(id);

        Map<String, Object> limits = dashboardLimitsUnlimited();

        DashboardViewResponse dashboardViewResponse = new DashboardViewResponse();
        dashboardViewResponse.setUser(user);
        dashboardViewResponse.setLimits(limits);

        // for each language, set the language progress percentage
        user.getLanguages().forEach(language -> {
            int progress = languageProgressService.getLanguageProgressPercentage(language.getId());
            language.setProgressPercentage(progress);
        });
        user.setLanguages(user.getLanguages());

        log.info("Dashboard info for user with Id: {} returned", id);
        return BaseResponseBuilder.buildSuccessResponse(dashboardViewResponse);
    }

    @PutMapping(value = "/{id:.+}/account-setup")
    public ResponseEntity<BaseResponse> setWelcomeInfo(@PathVariable String id, @RequestBody @Valid AccountSetupRequest request) {
        log.info("account setup info update requested for user with id: {}", id);

        User user = userService.getUser(id);

        // If user doesn't exist in database, return error
        if (user == null) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }
        userService.updateAccountSetupInfo(user, request);

        return BaseResponseBuilder.buildSuccessResponse(new HashMap<>());
    }

    /**
     * Get user accountDetails
     */
    @GetMapping(value = "/{id:.+}/account-details")
    public ResponseEntity<BaseResponse> getAccountDetails(@PathVariable String id) {
        log.info("Account details request sent for user with id: {}", id);
        User user = userService.getUser(id);

        // If user doesn't exist in database, return error
        if (user == null) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        // build response
        UserAccountDetailsDTO accountDetailsDTO = mapperFactory.map(user, UserAccountDetailsDTO.class);

        return BaseResponseBuilder.buildSuccessResponse(accountDetailsDTO);
    }


    /**
     * Endpoint to update a users profile information
     */
    @PutMapping(value = "/{id:.+}/profile")
    public ResponseEntity<BaseResponse> updateUserProfile(@PathVariable String id, @RequestBody @Valid UserProfileRequest updateProfileUser) {
        log.info("Profile Update request for user with id: {}", id);

        // Get user object from Database
        User user = userService.getUser(id);

        // If user doesn't exist in database, return error
        if (id == null || user == null) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        User updatedUser = userService.updateUserProfileInformation(user, updateProfileUser);

        UserProfileDTO profileDTO = mapperFactory.map(updatedUser, UserProfileDTO.class);
        profileDTO = userService.getUserProfileWithStats(profileDTO.getId());


        return BaseResponseBuilder.buildSuccessResponse(profileDTO);
    }

    /**
     * Endpoint to update a users email
     */
    @PutMapping(value = "/{id:.+}/email")
    public ResponseEntity<BaseResponse> updateUserEmail(@PathVariable String id, @RequestBody @Valid UserEmailRequest emailRequest) {
        log.info("Email update request sent for user with id: {}", id);
        Map<String, Object> response = new HashMap<>();

        // Get user object from Database
        User user = userService.getUser(id);

        // If user doesn't exist in database, return error
        if (user == null) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        // check if email already exists in the system
        if (userService.emailAlreadyExists(emailRequest.getEmail())) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.EMAIL_EXISTS_ERROR);
        }

        // Validate email and update
        if (!userService.updateUserEmail(user, emailRequest.getEmail())) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.EMAIL_VALIDATION_ERROR);
        }

        UserProfileDTO profileDTO = mapperFactory.map(user, UserProfileDTO.class);

        return BaseResponseBuilder.buildSuccessResponse(profileDTO);
    }

    /**
     * Endpoint to update a users password
     */
    @PutMapping(value = "/{id:.+}/password")
    public ResponseEntity<BaseResponse> updateUserProfile(@PathVariable String id, @RequestBody @Valid UserPasswordRequest passwordObject) {
        log.info("Password update request sent for user with id: {}", id);
        Map<String, Object> response = new HashMap<>();

        String currentPassword = passwordObject.getCurrentPassword();
        String newPassword = passwordObject.getNewPassword();

        // Get user object from Database
        User user = userService.getUser(id);

        // If user doesn't exist in database, return error
        if (user == null) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        // TODO: Change error to be success response with error message
        // check if current password matches
        // if password does not match, return error
        if (!passwordMatcher.matchPassword(currentPassword, user.getPassword())) {
            log.info("Error: current password does not match.");
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.PASSWORD_VALIDATION_ERROR);
        } else {
            // update user password
            User updatedUser = userService.updatePassword(user, newPassword);

            UserProfileDTO profileDTO = mapperFactory.map(updatedUser, UserProfileDTO.class);

            // send password reset email
            // TODO: SEND EMAIL WHEN PASSWORD WAS CHANGED
//            emailSender.sendTslEmail(user.getEmail(), EmailTemplate.PASSWORD_RESET_EMAIL, user.getFirstName().trim());

            log.info("password successfully updated.");
            return BaseResponseBuilder.buildSuccessResponse(profileDTO);
        }
    }

    @DeleteMapping(value = "/{id:.+}")
    public ResponseEntity<BaseResponse> deleteUser(@PathVariable String id) {
        log.info("Delete request for user with id: {}", id);
        Map<String, Object> response = new HashMap<>();

        // Get user object from Database
        User user = userService.getUser(id);

        // If user doesn't exist in database, return error
        if (id == null || user == null) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        } else {
            userService.deleteUser(user);
            log.info("User with Id: {} deleted.", id);

            response.put("message", "User deleted successfully.");
            return BaseResponseBuilder.buildSuccessResponse(response);
        }
    }

    /**
     * Get user notification settings
     */
    @GetMapping(value = "/{id:.+}/notification-settings")
    public ResponseEntity<BaseResponse> getNotifications(@PathVariable String id) {
        log.info("Notification setting request sent for user with id: {}", id);
        Map<String, Object> response = new HashMap<>();

        User user = userService.getUser(id);

        // If user doesn't exist in database, return error
        if (user == null) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        response.put("emailSettings", user.getEmailNotifications());

        return BaseResponseBuilder.buildSuccessResponse(response);
    }

    @PutMapping(value = "/{id:.+}/notification-settings")
    public ResponseEntity<BaseResponse> updateEmailNotifications(@PathVariable String id, @RequestBody @Valid NotificationSettingsRequest settingsRequest) {
        log.info("Email Notifications update request sent for user with email: {}", id);
        Map<String, Object> response = new HashMap<>();


        User user = userService.getUser(id);

        // If user doesn't exist in database, return error
        if (user == null) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        userService.setEmailNotifications(user, settingsRequest.getNotifications());

        response.put("emailSettings", user.getEmailNotifications());

        return BaseResponseBuilder.buildSuccessResponse(response);
    }

    /**
     * Endpoint to get user avatar properties
     */
    @GetMapping(value = "/{id:.+}/avatar")
    public ResponseEntity<BaseResponse> getUserAvatar(@PathVariable String id) {
        log.info("Avatar request sent for user with id: {}", id);
        Map<String, Object> response = new HashMap<>();

        // Get user object from Database
        User user = userService.getUser(id);

        // If a user doesn't exist in database, return error
        if (user == null) {
            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
        }

        response.put("user", user);

        return BaseResponseBuilder.buildSuccessResponse(response);
    }

    private static Map<String, Object> dashboardLimitsUnlimited() {
        Map<String, Object> limits = new HashMap<>();
        limits.put("languages", -1);
        limits.put("words", -1);
        limits.put("phrases", -1);
        return limits;
    }

}
