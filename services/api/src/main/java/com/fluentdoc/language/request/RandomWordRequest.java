package com.fluentdoc.language.request;

import org.hibernate.validator.constraints.NotBlank;

public class RandomWordRequest {

    private int count;

    @NotBlank(message = "target language cannot be blank")
    private String target;

    public RandomWordRequest() {
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }
}
