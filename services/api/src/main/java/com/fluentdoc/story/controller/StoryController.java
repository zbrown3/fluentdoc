package com.fluentdoc.story.controller;

import com.fluentdoc.common.response.BaseResponse;
import com.fluentdoc.common.response.BaseResponseBuilder;
import com.fluentdoc.story.model.Story;
import com.fluentdoc.story.service.StoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Story", description = "Endpoints for story operations")
@RestController
@RequestMapping("/stories")
@Slf4j
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    // endpoint to update a story
    @PutMapping("/{id:.+}")
    public ResponseEntity<BaseResponse> updateStory(@PathVariable String id, @RequestBody Story storyRequest) {
        log.info("Updating story with id: {}", id);
        // update story
        return BaseResponseBuilder.buildSuccessResponse(storyService.updateStory(id, storyRequest));
    }
}
