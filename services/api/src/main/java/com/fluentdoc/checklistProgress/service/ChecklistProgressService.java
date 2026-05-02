package com.fluentdoc.checklistProgress.service;

import com.fluentdoc.checklistProgress.domain.ChecklistProgress;
import com.fluentdoc.checklistProgress.enums.ChecklistType;
import com.fluentdoc.checklistProgress.repository.ChecklistProgressRepository;
import com.fluentdoc.checklistProgress.response.ChecklistProgressResponse;
import com.fluentdoc.language.service.LanguageService;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChecklistProgressService {
    private final ChecklistProgressRepository repository;
    private final LanguageService languageService;

    public ChecklistProgressService(ChecklistProgressRepository repository, LanguageService languageService) {
        this.repository = repository;
        this.languageService = languageService;
    }

    public ChecklistProgressResponse getProgress(String userId, ChecklistType type) {
        ChecklistProgress progress = repository
                .findByUserIdAndType(userId, type)
                .orElseGet(() -> new ChecklistProgress(userId, type, getDefaultStepMap(type)));

        Map<String, Boolean> steps = new LinkedHashMap<>(progress.getSteps());


        // Only update if not already marked true
        if (!steps.getOrDefault("createLanguage", false)) {
            steps.put("createLanguage", languageService.userHasLanguages(userId));
        }

        if (!steps.getOrDefault("addPhonology", false)) {
            steps.put("addPhonology", languageService.userHasPhonology(userId));
        }

        if (!steps.getOrDefault("createWord", false)) {
            steps.put("createWord", languageService.userHasVocabulary(userId));
        }

        if (!steps.getOrDefault("createPhrase", false)) {
            steps.put("createPhrase", languageService.userHasPhrases(userId));
        }

        // Update and persist checklist progress
        progress.setSteps(steps);
        progress.setComplete(steps.values().stream().allMatch(Boolean::booleanValue));
        repository.save(progress);

        // Build ordered step response
        List<ChecklistProgressResponse.StepStatus> stepList = steps.entrySet().stream()
                .map(entry -> {
                    String id = entry.getKey();
                    boolean isDone = entry.getValue();
                    return new ChecklistProgressResponse.StepStatus(
                            id,
                            getStepTitle(id),
                            getStepDescription(id),
                            isDone ? "done" : "upcoming"
                    );
                })
                .collect(Collectors.toList());

        // Mark first "upcoming" step as "current"
        stepList.stream()
                .filter(s -> s.getStatus().equals("upcoming"))
                .findFirst()
                .ifPresent(s -> s.setStatus("current"));

        int completed = (int) stepList.stream().filter(s -> s.getStatus().equals("done")).count();
        String currentStep = stepList.stream()
                .filter(s -> s.getStatus().equals("current"))
                .map(ChecklistProgressResponse.StepStatus::getTitle)
                .findFirst()
                .orElse(null);

        return new ChecklistProgressResponse(completed, stepList.size(), currentStep, stepList);
    }


    private Map<String, Boolean> getDefaultStepMap(ChecklistType type) {
        return switch (type) {
            case GETTING_STARTED -> {
                Map<String, Boolean> steps = new LinkedHashMap<>();
                steps.put("createLanguage", false);
                steps.put("addPhonology", false);
                steps.put("createWord", false);
                steps.put("createPhrase", false);
                steps.put("exportLanguage", false);
                yield steps;
            }
            default -> new LinkedHashMap<>();
        };
    }

    private String getStepTitle(String id) {
        return switch (id) {
            case "createLanguage" -> "Create your first Language";
            case "addPhonology" -> "Add a phonology section";
            case "createWord" -> "Create your first word";
            case "createPhrase" -> "Create your first phrase";
            case "exportLanguage" -> "Export your language";
            default -> "Unnamed Step";
        };
    }

    private String getStepDescription(String id) {
        return switch (id) {
            case "createLanguage" -> "Give your language a name and define its purpose.";
            case "addPhonology" -> "Define the sounds used in your language, including consonants and vowels.";
            case "createWord" -> "Start building your dictionary by adding a new word.";
            case "createPhrase" -> "Show how your words come together by adding a phrase.";
            case "exportLanguage" -> "Download your language guide, dictionary, or phrasebook.";
            default -> "";
        };
    }

    public ChecklistProgressResponse markStepComplete(String userId, ChecklistType type, String stepId) {
        ChecklistProgress progress = repository
                .findByUserIdAndType(userId, type)
                .orElseGet(() -> new ChecklistProgress(userId, type, getDefaultStepMap(type)));

        Map<String, Boolean> steps = new LinkedHashMap<>(progress.getSteps());

        // Only update if the step exists and is not already complete
        if (steps.containsKey(stepId) && !steps.get(stepId)) {
            steps.put(stepId, true);
            progress.setSteps(steps);
            progress.setComplete(steps.values().stream().allMatch(Boolean::booleanValue));
            repository.save(progress);
        }

        // Build ordered step response
        List<ChecklistProgressResponse.StepStatus> stepList = steps.entrySet().stream()
                .map(entry -> {
                    String id = entry.getKey();
                    boolean isDone = entry.getValue();
                    return new ChecklistProgressResponse.StepStatus(
                            id,
                            getStepTitle(id),
                            getStepDescription(id),
                            isDone ? "done" : "upcoming"
                    );
                })
                .collect(Collectors.toList());

        // Mark first upcoming as current
        stepList.stream()
                .filter(s -> s.getStatus().equals("upcoming"))
                .findFirst()
                .ifPresent(s -> s.setStatus("current"));

        int completed = (int) stepList.stream().filter(s -> s.getStatus().equals("done")).count();
        String currentStep = stepList.stream()
                .filter(s -> s.getStatus().equals("current"))
                .map(ChecklistProgressResponse.StepStatus::getTitle)
                .findFirst()
                .orElse(null);

        return new ChecklistProgressResponse(completed, stepList.size(), currentStep, stepList);
    }
}

