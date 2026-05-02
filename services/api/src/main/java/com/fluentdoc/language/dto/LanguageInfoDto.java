package com.fluentdoc.language.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fluentdoc.language.enums.LanguageType;
import com.fluentdoc.language.enums.PrivacyLevel;
import com.fluentdoc.story.dto.StoryDTO;
import com.fluentdoc.user.enums.Reason;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import static com.fluentdoc.common.util.Constants.DATE_FORMAT;


@Data
public class LanguageInfoDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String id;
    @JsonFormat(pattern=DATE_FORMAT)
    private LocalDateTime lastUpdated;
    private String creatorId;
    private String name;
    private String description;
    private String flagUrl;
    private List<LanguageType> types;
    @JsonFormat(pattern=DATE_FORMAT)
    private LocalDateTime dateCreated;
    private List<Reason> reasons;
    private StoryDTO story;
    private PrivacyLevel privacyLevel;
    private int progressPercentage;
}
