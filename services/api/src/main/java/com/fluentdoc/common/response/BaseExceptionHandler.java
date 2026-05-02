package com.fluentdoc.common.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class BaseExceptionHandler {

    // Exception handler for validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse> handleValidationExceptionUserController(MethodArgumentNotValidException e) {
        List<ObjectError> errorMessages = e.getBindingResult().getAllErrors();

        List<String> errors = new ArrayList<>();
        for(ObjectError objectError : errorMessages){
            errors.add(objectError.getDefaultMessage());
        }
        return BaseResponseBuilder.buildValidationErrorResponse(errors.get(0), HttpStatus.BAD_REQUEST);
    }

    // handle MissingServletRequestParameterException
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<BaseResponse> handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        System.out.println("MissingServletRequestParameterException: " + e.getMessage());
        BaseResponse response = new BaseResponse();
        response.setStatus("ERROR");
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("code", BaseServiceErrorCode.MISSING_REQUEST_PARAMETER_ERROR.getCode());
        errorMap.put("message", e.getMessage());
        response.setError(errorMap);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // handle HttpMessageNotReabableException
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<BaseResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        System.out.println("HttpMessageNotReadableException: " + e.getMessage());
        BaseResponse response = new BaseResponse();
        response.setStatus("ERROR");
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("code", BaseServiceErrorCode.HTTP_MESSAGE_NOT_READABLE_ERROR.getCode());
        errorMap.put("message", e.getMessage());
        response.setError(errorMap);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // handle NoResourceFoundException
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<BaseResponse> handleNoResourceFoundException(NoResourceFoundException e) {
        System.out.println("NoResourceFoundException: " + e.getMessage());
        BaseResponse response = new BaseResponse();
        response.setStatus("ERROR");
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("code", BaseServiceErrorCode.NO_RESOURCE_FOUND_ERROR.getCode());
        errorMap.put("message", BaseServiceErrorCode.NO_RESOURCE_FOUND_ERROR.getMessage());
        response.setError(errorMap);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // handle all other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse> handleAllExceptions(Exception e) {
        System.out.println("Exception: " + e.getMessage());
        BaseResponse response = new BaseResponse();
        response.setStatus("ERROR");
        Map<String, Object> errorMap = new HashMap<>();


        // CODE HIGHLIGHT:: Custom error handling for BaseException
        // if the exception is a BaseException exception, use the custom error code and message
        // as long as the code doesn't start with 'api-', 'db-' or 'http-', return the error code and message
        if (e instanceof BaseException baseException
                && !baseException.getCode().startsWith("api-")
                && !baseException.getCode().startsWith("db-")
                && !baseException.getCode().startsWith("http-")) {
            errorMap.put("code", baseException.getCode());
            errorMap.put("message", baseException.getMessage());
            response.setError(errorMap);
            return new ResponseEntity<>(response, baseException.getHttpStatus());
        }

        errorMap.put("code", BaseServiceErrorCode.GENERIC_ERROR.getCode());
        errorMap.put("message", BaseServiceErrorCode.GENERIC_ERROR.getMessage());
        response.setError(errorMap);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
