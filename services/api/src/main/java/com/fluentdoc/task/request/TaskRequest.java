package com.fluentdoc.task.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequest {

    @NotBlank(message = "task cannot be blank")
    private String task;
    @NotBlank(message = "creatorId cannot be blank")
    private String creatorId;

}
