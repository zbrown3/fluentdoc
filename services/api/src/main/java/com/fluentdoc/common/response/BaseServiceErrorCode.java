package com.fluentdoc.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum BaseServiceErrorCode {
    // AUTH ERRORS
    INVALID_CREDENTIALS_ERROR("auth-001", "Invalid credentials."),
    EMAIL_ALREADY_EXISTS("auth-003", "Account with that email already exists."),

    // API ERRORS
    NO_RESOURCE_FOUND_ERROR("api-001", "No resource found."),
    ACCESS_DENIED_ERROR("api-002", "Access Denied."),

    // INPUT VALIDATION ERRORS
    INVALID_DATE_FORMAT_ERROR("inp-001", "Invalid Date format. Must be 'MM/DD/YYY' (i.e. 01/01/2018)"),
    EMAIL_VALIDATION_ERROR("inp-002", "Email failed validation."),
    EMAIL_EXISTS_ERROR("inp-003", "There is an account already associated with this email."),

//
//    // CREDENTIAL VALIDATION ERRORS
//    EMAIL_VALIDATION_ERROR("CVERR001", "Email failed validation."),
//    EMAIL_EXISTS_ERROR("CVERR002", "There is an account already associated with this email."),
//    PASSWORD_VALIDATION_ERROR("CVERR003", "Password failed validation."),
//    PASSWORD_MATCHING_ERROR("CVERR004", "Passwords must match."),
//    PASSWORD_REQUIREMENT_ERROR("CVERR005", "Password does not meet requirements."),
//

//    INVALID_DATE_FORMAT_ERROR("IVERR001", "Invalid Date format. Must be 'MM/DD/YYY' (i.e. 01/01/2018)"),
//    INVALID_FORMAT_ERROR("IVERR002", "Invalid Format"),
//
//    // MAIL SEND ERRORS
//    MAIL_INVALID_EMAIL_ERROR("MSERR001", "Email not sent. Invalid Email."),
//    INVALID_EMAIL_FORMAT_ERROR("MSERR002", "Invalid Email Format. Email Not Sent"),

    // UPDATE ERROR
    UPDATE_USER_INFO_ERROR("upe-001", "User update failed."),
    USERNAME_EXISTS_ERROR("upe-002", "Username already exists."),
//    UPDATE_USER_INFO_ERROR("UEERR001", "User update failed."),
//    UPDATE_PRACTICE_INFO_ERROR("PEERR001", "Practice update failed."),
//
//
//    // RESET PASSWORD ERROR
//    INVALID_KEY_ERROR("RPERR000", "Invalid security key."),

    // FILE UPLOAD ERROR
    FILE_UPLOAD_ERROR("file-001", "File upload failed."),
    FILE_EMPTY_ERROR("file-002", "File is empty."),
    FILE_PROCESSING_ERROR("file-003", "File processing failed."),

    // EMAIL ERROR
    EMAIL_SEND_ERROR("email-001", "Email not sent."),

    // PDF ERROR
    PDF_GENERATION_ERROR("pdf-001", "PDF Generation failed."),

    // ADMIN ERROR
    IS_ADMIN_ERROR("admin-001", "Admin account already associated with this email."),

    // FILE STORAGE ERRORS
    FILE_STORAGE_ERROR("stor-001", "File storage error."),

    // DATABASE SPECIFIC ERRORS
    DATABASE_ERROR("db-001", "Database Error. Please Try again later."),
    USER_NOT_FOUND("db-002", "User not found" ),

    // STORY SPECIFIC ERRORS
    STORY_NOT_FOUND("st-001", "Story not found" ),

    // Generic Errors
    GENERIC_ERROR("gen-001", "An error occurred. Please try again later."),

    // HTTP errors
    MISSING_REQUEST_PARAMETER_ERROR("http-001","Missing request parameter" ),
    HTTP_MESSAGE_NOT_READABLE_ERROR("http-002","Http message not readable" ),
    BAD_REQUEST_ERROR("http-003","Bad request" ),

    // Validation/Request Errors
    VALIDATION_ERROR("val-001", "Validation Error"),
//    CREATE_ADMIN_ERROR("val-002", "Error creating admin user." ),
//    VERIFY_ADMIN_ERROR("val-003", "Error verifying admin." ),
//    DELETE_ADMIN_ERROR("ADERR001", "Error deleting admin." ),
//    RESET_PASSWORD_ERROR("RPERR001", "An error occurred resetting password. Password not reset. Please try again later." ),
    PASSWORD_VALIDATION_ERROR("val-006", "Password validation error"),
    PASSWORD_MATCHING_ERROR("val-007", "Passwords must match"),
    PASSWORD_REQUIREMENT_ERROR("val-008", "Password does not meet requirements");

    private final String code;
    private final String message;
}
