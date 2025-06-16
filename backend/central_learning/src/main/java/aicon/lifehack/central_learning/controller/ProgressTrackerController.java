package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.dto.ProgressRequestDTO; // Add this
import aicon.lifehack.central_learning.model.ProgressTracker;
import aicon.lifehack.central_learning.service.ProgressTrackerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/progress")
public class ProgressTrackerController {

    private final ProgressTrackerService progressTrackerService;

    public ProgressTrackerController(ProgressTrackerService progressTrackerService) {
        this.progressTrackerService = progressTrackerService;
    }

    /**
     * Gets (or creates) the progress for a user in a specific course.
     * Uses POST to accept a JSON body.
     */
    @PostMapping("/status") // Changed to POST and added a path segment for clarity
    public ResponseEntity<ProgressTracker> getProgress(@RequestBody ProgressRequestDTO request) 
            throws ExecutionException, InterruptedException {
        
        if (request.getUser_id() == null || request.getCourse_id() == null) {
            return ResponseEntity.badRequest().build(); // Basic validation
        }
        
        ProgressTracker tracker = progressTrackerService.getOrCreateTracker(request.getUser_id(), request.getCourse_id());
        return ResponseEntity.ok(tracker);
    }

    /**
     * Updates progress after completing a quiz.
     * Uses PUT as it's an update operation.
     */
    @PutMapping
    public ResponseEntity<ProgressTracker> updateProgress(@RequestBody ProgressRequestDTO request) 
            throws ExecutionException, InterruptedException {
        
        if (request.getUser_id() == null || request.getCourse_id() == null || request.getNew_difficulty() == null) {
            return ResponseEntity.badRequest().build(); // Basic validation
        }
                
        ProgressTracker updatedTracker = progressTrackerService.updateProgress(
            request.getUser_id(), 
            request.getCourse_id(), 
            request.getNew_difficulty()
        );
        return ResponseEntity.ok(updatedTracker);
    }
}