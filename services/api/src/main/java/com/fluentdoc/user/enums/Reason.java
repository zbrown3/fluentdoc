package com.fluentdoc.user.enums;

import lombok.Getter;

@Getter
public enum Reason {

    HOBBY_FUN("HOBBY_FUN"),
    FRIENDS_GROUP("FRIENDS_GROUP"),
    NOVEL("NOVEL"),
    SCHOOL("SCHOOL"),
    VIDEO_GAME("VIDEO_GAME"),
    FILM("FILM"),
    WORK("WORK"),
    OTHER("OTHER");

    private final String description;

    Reason(String text) {
        this.description = text;
    }

    public static Reason lookup(String description) {
        if (description != null) {
            for (Reason type : values()) {
                if (type.getDescription().equals(description)) {
                    return type;
                }
            }
        }
        return null;
    }
}
