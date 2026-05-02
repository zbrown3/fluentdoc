package com.fluentdoc.language.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class PinnedSectionDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private int order;
    private String section;
    private String name;
    private String title;
}
