package com.fluentdoc.common.validation;

import com.fluentdoc.common.response.BaseServiceErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class CommonPasswordValidator {


    /**
     Validation rules:<br>
     1) Eight to Twenty-four (8 - 24) characters in length<br>
     2) No more than 2 characters repeated (eg. 'pizzza' is not allowed)<br>
     3) At least one uppercase and lowercase character
     4) At least one number (0-9)
     5) At least one special character (~`!@#$%^&*()+=_-{}[]\|:;”’?/<>,.)
     **/
    public BaseServiceErrorCode validate(String newPass){

        if(newPass == null){
            log.info("Error: Password is null"); // not null
            return BaseServiceErrorCode.PASSWORD_VALIDATION_ERROR;
        } else if(newPass.length() < 8 || newPass.length() > 24){ // char limit
            log.info("Error: Password length is invalid.");
            return BaseServiceErrorCode.PASSWORD_VALIDATION_ERROR;
        } else if (hasRepetition(newPass)){ // repeated chars
            log.info("Error: Password contains too many repeated characters.");
            return BaseServiceErrorCode.PASSWORD_VALIDATION_ERROR;
        } else if (!hasBothUpperAndLowercase(newPass)) {
            log.info("Error: Password doesn't contain both upper and lowercase characters.");
            return BaseServiceErrorCode.PASSWORD_VALIDATION_ERROR;
        } else if (!hasNumeric(newPass)) {
            log.info("Error: Password doesn't contain a numeric");
            return BaseServiceErrorCode.PASSWORD_VALIDATION_ERROR;
        }
        else if (!hasSpecialChar(newPass)) {
            log.info("Error: Password doesn't contain a special character");
            return BaseServiceErrorCode.PASSWORD_VALIDATION_ERROR;
        }
        return null;
    }


    private boolean hasRepetition(String subject){
        Pattern p = Pattern.compile("(.)\\1{2,}");
        Matcher m = p.matcher(subject);

        if (m.find()){
            return true;
        } else {
            return false;
        }
    }

    private boolean hasBothUpperAndLowercase(String subject) {
        return (!subject.equals(subject.toLowerCase()) && !subject.equals(subject.toUpperCase()));
    }

    private boolean hasNumeric(String subject) {
        String regex = "(.)*(\\d)(.)*";
        Pattern pattern = Pattern.compile(regex);
        return pattern.matcher(subject).matches();
    }

    private boolean hasSpecialChar(String subject) {
        Pattern p = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(subject);
        return m.find();
    }
}
