package com.fluentdoc.user.request;


import com.fluentdoc.user.enums.Experience;
import lombok.Data;

@Data
public class AccountSetupRequest {
    private Experience experience;
    private boolean shareLanguage;
    private boolean collaborative;
}
