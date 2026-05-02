package com.fluentdoc.util.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UtilService {

    public static String base64Encode(String input) {
        return java.util.Base64.getEncoder().encodeToString(input.getBytes());
    }
}
