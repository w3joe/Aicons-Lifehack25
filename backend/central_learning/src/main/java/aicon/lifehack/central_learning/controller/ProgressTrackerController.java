package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.dto.ProgressRequestDTO;
import aicon.lifehack.central_learning.model.ProgressTracker;
import aicon.lifehack.central_learning.service.ProgressTrackerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

//To allow for student to retake lessons
@RestController
@RequestMapping("/api/progress")
public class ProgressTrackerController {

    private final ProgressTrackerService progressTrackerService;

    public ProgressTrackerController(ProgressTrackerService progressTrackerService) {
        this.progressTrackerService = progressTrackerService;
    }

    @PostMapping("/status")
    public ResponseEntity<ProgressTracker> getProgress(@RequestBody ProgressRequestDTO request) 
            throws ExecutionException, InterruptedException {
        
        if (request.getUser_id() == null || request.getCourse_id() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        ProgressTracker tracker = progressTrackerService.getOrCreateTracker(request.getUser_id(), request.getCourse_id());
        return ResponseEntity.ok(tracker);
    }

    @PutMapping
    public ResponseEntity<ProgressTracker> updateProgress(@RequestBody ProgressRequestDTO request) 
            throws ExecutionException, InterruptedException {
        
        // You could add validation for quizScore here if needed
        if (request.getUser_id() == null || request.getCourse_id() == null) {
            return ResponseEntity.badRequest().build();
        }
                
        ProgressTracker updatedTracker = progressTrackerService.updateProgress(
            request.getUser_id(), 
            request.getCourse_id(), 
            request.getProficiency_score(),
            request.getQuiz_score() 
        );
        return ResponseEntity.ok(updatedTracker);
    }
}