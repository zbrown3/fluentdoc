package com.fluentdoc.task.controller;

import com.fluentdoc.task.service.TaskService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Task", description = "Endpoints for task data")
@RestController
@RequestMapping("/tasks")
@Slf4j
public class TaskController {
    
    public TaskController(TaskService taskService) {

    }

//    /**
//     * Endpoint to get all tasks from database for user
//     *
//     * @return ResponseEntity<BaseResponse>
//     */
//    @GetMapping(value = "/{id:.+}")
//    @PreAuthorize("hasPermission(#id, 'READ')")
//    public ResponseEntity<BaseResponse> getUserTasks(@PathVariable String id) {
//        log.info("Request sent for all tasks for user with id: {}", id);
//        Map<String, Object> response = new HashMap<>();
//
//        response.put("tasks", taskService.getUserTasks(id));
//
//        return BaseResponseBuilder.buildSuccessResponse(response);
//    }
//
//
//    /**
//     * Endpoint to add a language to the database for a user
//     */
//    @PostMapping(value = "")
//    public ResponseEntity<BaseResponse> createTask(@RequestBody @Valid TaskRequest taskRequest) {
//        log.info("Request sent to add task for user with id: {}", taskRequest.getCreatorId());
//        Map<String, Object> response = new HashMap<>();
//
//        Task task = new Task();
//        task.setTask(taskRequest.getTask());
//        task.setCreatorId(taskRequest.getCreatorId());
//        taskService.createTask(task);
//
//        // get user tasks
//        response.put("tasks", taskService.getUserTasks(taskRequest.getCreatorId()));
//
//        return BaseResponseBuilder.buildSuccessResponse(response);
//    }
//
//    /**
//     * Endpoint to delete a task from database by Id
//     * @param userId
//     * @param taskId
//     * @return
//     */
//    @DeleteMapping(value="{userId:.+}/{taskId:.+}")
//    @PreAuthorize("hasPermission(#userId, 'READ')")
//    public ResponseEntity<BaseResponse> deleteTask(@PathVariable String userId, @PathVariable String taskId){
//        log.info("Delete request for task with id: {}", taskId);
//        Map<String, Object> response = new HashMap<>();
//
//        Task task = taskService.getTaskById(taskId);
//
//        // If task doesn't exist in database, return error
//        if (task == null){
//            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
//        }
//
//        taskService.deleteTask(task);
//        log.info("task with Id: {} deleted", taskId);
//
//        // get user tasks
//        response.put("tasks", taskService.getUserTasks(userId));
//
//        return BaseResponseBuilder.buildSuccessResponse(response);
//    }
//
//    // update user task to completed
//    @PutMapping(value = "{userId:.+}/{taskId:.+}")
//    @PreAuthorize("hasPermission(#userId, 'READ')")
//    public ResponseEntity<BaseResponse> updateTask(@PathVariable String userId, @PathVariable String taskId, @RequestBody @Valid TaskUpdateRequest request) {
//        log.info("Request sent to update user task for task with id: {}", taskId);
//        Map<String, Object> response = new HashMap<>();
//
//        Task task = taskService.getTaskById(taskId);
//
//        // If task doesn't exist in database, return error
//        if (task == null){
//            return BaseResponseBuilder.buildErrorResponse(BaseServiceErrorCode.DATABASE_ERROR);
//        }
//
//
//        taskService.updateTask(task, request.isComplete());
//
//        // get user tasks
//        response.put("tasks", taskService.getUserTasks(userId));
//
//        return BaseResponseBuilder.buildSuccessResponse(response);
//    }

}
