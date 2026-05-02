package com.fluentdoc.common.validation;


import com.fluentdoc.common.response.BaseServiceErrorCode;
import com.fluentdoc.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class EmailValidator {


    private final UserService userService;

    public EmailValidator(UserService userService) {
        this.userService = userService;
    }


    /**
     * Performs the following validations<br>
     Validation rules:<br>
     1) Must have @ followed by .extension<br>
     2) Must have .extension<br>
     3) More than 2 Characters before @ <br>
     4) Allow for multiple .extension<br>
     5) Allow special chars (&_-.+)<br>
     6) Less than 50 Characters<br>
     Regex: (^[A-Za-z0-9-_+&.]+)([@])([a-zA-Z0-9-]+)([\.][a-zA-Z0-9]{2,}+)+
     **/
    public BaseServiceErrorCode validate(String email){
        if (email == null){
            log.info("Error: Email is null");
            return BaseServiceErrorCode.EMAIL_VALIDATION_ERROR;
        }
        else if(email.length() > 50 || !email.contains("@") || email.contains(" ")){
            log.info("Error: email format error");
            return BaseServiceErrorCode.EMAIL_VALIDATION_ERROR;
        }
        else if(!emailCheck(email)){
            log.info("Error: email format error");
            return BaseServiceErrorCode.EMAIL_VALIDATION_ERROR;
        }
        else if(existsInDatbase(email)){
            log.info("Error: Email exists in database");
            return BaseServiceErrorCode.EMAIL_EXISTS_ERROR;
        }
        return null;
    }

    public boolean emailCheck(String subject) {
        Pattern p = Pattern.compile("(^[A-Za-z0-9-_+&.]+)([@])([a-zA-Z0-9-]+)([\\.][a-zA-Z0-9]{2,}+)+");
        Matcher m = p.matcher(subject);

        if (m.find()) {
            return true;
        } else {
            return false;
        }
    }

    public boolean existsInDatbase(String email) {
        return userService.emailAlreadyExists(email);
    }

}
