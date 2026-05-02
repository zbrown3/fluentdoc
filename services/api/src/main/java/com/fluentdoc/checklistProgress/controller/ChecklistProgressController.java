package com.fluentdoc.checklistProgress.controller;

import com.fluentdoc.checklistProgress.enums.ChecklistType;
import com.fluentdoc.checklistProgress.response.ChecklistProgressResponse;
import com.fluentdoc.checklistProgress.service.ChecklistProgressService;
import com.fluentdoc.common.response.BaseResponse;
import com.fluentdoc.common.response.BaseResponseBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/checklists")
public class ChecklistProgressController {

    private final ChecklistProgressService service;

    public ChecklistProgressController(ChecklistProgressService service) {
        this.service = service;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<BaseResponse> getProgress(
            @PathVariable String userId,
            @RequestParam ChecklistType type
    ) {
        ChecklistProgressResponse response = service.getProgress(userId, type);
        return BaseResponseBuilder.buildSuccessResponse(response);
    }

    @PostMapping("/{userId}/complete-step")
    public ResponseEntity<BaseResponse> markStepComplete(
            @PathVariable String userId,
            @RequestParam ChecklistType type,
            @RequestParam String step
    ) {
        ChecklistProgressResponse response = service.markStepComplete(userId, type, step);
        return BaseResponseBuilder.buildSuccessResponse(response);
    }
}
