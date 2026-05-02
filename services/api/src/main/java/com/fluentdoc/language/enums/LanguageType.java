package com.fluentdoc.language.enums;

import lombok.Getter;

@Getter
//@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum LanguageType {
    PERSONAL("PERSONAL"),
    A_PRIORI("A_PRIORI"),
    A_POSTERIORI("A_POSTERIORI"),
    ARTLANG("ARTLANG"),
    AUXLANG("AUXLANG"),
    ENGLANG("ENGLANG"),
    PHILOLOGICAL("PHILOLOGICAL"),
    MICRONATIONAL("MICRONATIONAL"),
    SIGN("SIGN"),
    SACRED_RELIGIOUS("SACRED_RELIGIOUS"),
    OTHER("OTHER");

    private final String name;

    LanguageType(String name) {
        this.name = name;
    }

    public static LanguageType lookup(String name) {
        for (LanguageType type : values()) {
            if (type.getName().equals(name)) {
                return type;
            }
        }
        return null;
    }
}
