package com.fluentdoc.common.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;


// CODE HIGHLIGHT:: Custom BaseException Class to handle custom error codes and messages
@Getter
public class BaseException extends RuntimeException {
    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    public BaseException(String code, String message, HttpStatus httpStatus) {
        super(message);
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
