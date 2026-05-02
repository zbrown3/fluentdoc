package com.fluentdoc.task.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskUpdateRequest {

    private boolean isComplete;
    @NotBlank(message = "taskId cannot be blank")
    private String taskId;

}
