package com.fluentdoc.language.dto;


import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class PhrasesDto {

    // allow phrases to be blank in case a user wants to delete
    // and start over (likely scenario)
    private List<Map<String, String>> phrases;
}
