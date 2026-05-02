package com.fluentdoc.checklistProgress.response;

import lombok.Data;

import java.util.List;

@Data
public class ChecklistProgressResponse {

    private int completedCount;
    private int totalCount;
    private String currentStep;
    private List<StepStatus> steps;

    public ChecklistProgressResponse(int completedCount, int totalCount, String currentStep, List<StepStatus> steps) {
        this.completedCount = completedCount;
        this.totalCount = totalCount;
        this.currentStep = currentStep;
        this.steps = steps;
    }

    @Data
    public static class StepStatus {
        private String id;
        private String title;
        private String description; // optional, can be used for more details
        private String status; // "done", "current", or "upcoming"

        public StepStatus(String id, String title, String description, String status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.status = status;
        }
    }
}
