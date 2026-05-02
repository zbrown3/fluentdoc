package com.fluentdoc.common.validation;

import com.fluentdoc.common.response.BaseServiceErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DateValidator {

    private static final Logger LOGGER = LoggerFactory.getLogger("User Service: DateValidator");

    public BaseServiceErrorCode validate(String date){
        if (date == null || date.equals("")){
            return BaseServiceErrorCode.INVALID_DATE_FORMAT_ERROR;
        }
        if (!dateFormatCheck(date)){
            return BaseServiceErrorCode.INVALID_DATE_FORMAT_ERROR;
        }

        return null;
    }



    public boolean dateFormatCheck(String subject) {
        Pattern p = Pattern.compile("^[0-9]{1,2}\\/[0-9]{1,2}\\/[0-9]{4}");
        Matcher m = p.matcher(subject);

        if (m.find()) {
            return true;
        } else {
            return false;
        }
    }
}
