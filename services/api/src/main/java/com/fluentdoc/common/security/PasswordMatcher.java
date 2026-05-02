package com.fluentdoc.common.security;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class PasswordMatcher {

    public boolean matchPassword(String password, String dbPassword) {
        return BCrypt.checkpw(password, dbPassword);
    }
}
