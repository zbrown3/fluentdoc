package com.fluentdoc.story.service;

import com.fluentdoc.common.response.BaseServiceErrorCode;
import com.fluentdoc.language.model.Language;
import com.fluentdoc.story.model.Story;
import com.fluentdoc.story.repository.StoryRepository;
import org.springframework.stereotype.Service;

@Service
public class StoryService {

    private final StoryRepository storyRepository;

    public StoryService(StoryRepository storyRepository) {
        this.storyRepository = storyRepository;
    }

    public Story addStory(Story story) {
        return storyRepository.save(story);
    }

    public void deleteStory(Story story) {
        storyRepository.delete(story);
    }

    public Story updateStory(String id, Story storyRequest) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new RuntimeException(BaseServiceErrorCode.STORY_NOT_FOUND.getMessage()));
        story.setContent(storyRequest.getContent());
        story.setTitle(storyRequest.getTitle());
        return storyRepository.save(story);
    }

    public void deleteStoriesByLanguage(Language language) {
        if (language.getStory() != null) {
            deleteStory(language.getStory());
        }
    }
}
