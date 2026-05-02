package com.fluentdoc.language.request;

import com.fluentdoc.language.enums.LanguageType;
import com.fluentdoc.user.enums.Reason;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CreateLanguageRequest {
    @NotBlank(message = "Name cannot be blank")
    private String name;
    private List<LanguageType> types;
    @NotBlank(message = "Description cannot be blank")
    private String description;
    private List<Reason> reasons;
    private boolean includeStory;
}
