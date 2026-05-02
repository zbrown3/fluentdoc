package com.fluentdoc.common.util;

public class CommonRegexPatterns {

    public static final String NAME_REGEX = "^(|[A-Za-zÀ-ÖØ-öø-ÿœŒÄËÏÖÜŸ  ,.'-]+)$";

    public static final String OPTIONAL_FIELD_CHAR_ONLY_REGEX = "^(|[a-zA-Z ]+)$";

    public static final String TEMP_KEY_REGEX = "^(|[a-zA-Z0-9]+)$";

    public static final String PATH_TYPE_REGEX = "^(DOCUMENTATION|CREATION)$";

    public static final String ADMIN_REQUEST_KEY_REGEX = "^x3BUiR94dK$";

    public static final String WORD_ORDER_REGEX = "^(SOV|SVO|VSO|VOS|OSV|OVS|Free word order)$";

    /**
     * Performs the following password validations, except 6<br>
     Validation rules:<br>
     1) Four to Twenty(4 - 20) characters in length<br>
     2) Alphanumeric values, spaces and ,.'- symbols<br>
     3) Username must not already be in database<br>
     **/
    public static final String USERNAME_REGEX = "^([a-zA-Z0-9]+)$";

}
