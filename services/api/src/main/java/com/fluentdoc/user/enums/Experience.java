package com.fluentdoc.user.enums;

import lombok.Getter;

@Getter
public enum Experience {

    BEGINNER("BEGINNER"),
    HOBBYIST("HOBBYIST"),
    ADVANCED("ADVANCED");


    private final String description;

    Experience(String text) {
        this.description = text;
    }

    public static Experience lookup(String description) {
        if (description != null) {
            for (Experience type : values()) {
                if (type.getDescription().equals(description)) {
                    return type;
                }
            }
        }
        return null;
    }
}
