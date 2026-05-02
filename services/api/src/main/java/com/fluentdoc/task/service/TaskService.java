package com.fluentdoc.task.service;

import com.fluentdoc.task.domain.Task;
import com.fluentdoc.task.repository.TaskRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

@Service
@Slf4j
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    /**
     * Return all tasks from database for user
     */
    public List<Task> getUserTasks(String userId){
        List<Task> tasks = new ArrayList<>();
        for (Task task : repository.findAllByCreatorId(userId)) {
            tasks.add(task);
        }
        return tasks;
    }

    /**
     * Create a new task
     */
    public void createTask(Task newTask){
        // set date created as today's date
        Calendar cal = Calendar.getInstance();
        // Set ISO Date Format (yyyy-MM-dd'T'HH:mm'Z')
        TimeZone tz = TimeZone.getTimeZone("UTC");
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'"); // Quoted "Z" to indicate UTC, no timezone offset
        df.setTimeZone(tz);
        String nowAsISO = df.format(cal.getTime());
        newTask.setDateCreated(nowAsISO);

        repository.save(newTask);
    }

    public Task getTaskById(String id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteTask(Task task) {
        repository.delete(task);
    }

    public void updateTask(Task task, boolean isComplete) {
        task.setCompleted(isComplete);
        repository.save(task);
    }
}
