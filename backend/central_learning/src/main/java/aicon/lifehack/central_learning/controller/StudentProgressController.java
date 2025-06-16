package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.model.StudentProgress;
import aicon.lifehack.central_learning.service.StudentProgressService;
import aicon.lifehack.central_learning.dto.RetakeQuizRequestDTO; 
import aicon.lifehack.central_learning.dto.CurrentLessonDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

//Mainly for getting student lesson progress
@RestController
@RequestMapping("/api/student-progress")
public class StudentProgressController {

    private final StudentProgressService studentProgressService;

    public StudentProgressController(StudentProgressService studentProgressService) {
        this.studentProgressService = studentProgressService;
    }

    @GetMapping
    public ResponseEntity<?> getLessonProgress(
            @RequestParam String userId, @RequestParam String lessonId) 
            throws ExecutionException, InterruptedException {
        
        StudentProgress progress = studentProgressService.getProgressForLesson(userId, lessonId);
        if (progress != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(progress)); // 200 OK
        } else {
            // Return 200 OK with an empty body or a 404, depending on desired behavior.
            // For this, returning an OK with empty is fine, means no attempt yet.
            return ResponseEntity.ok().build(); 
        }
    }

    @GetMapping("/review-lesson")
    public ResponseEntity<?> getReviewLesson(
            @RequestParam String userId, @RequestParam String lessonId)
            throws ExecutionException, InterruptedException {
        
        CurrentLessonDTO reviewData = studentProgressService.getReviewLessonData(userId, lessonId);

        if (reviewData != null) {
            return ResponseEntity.ok(reviewData);
        } else {
            // This means the user has never attempted the lesson, so there's nothing to review.
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("No progress found for user '" + userId + "' on lesson '" + lessonId + "'."));

        }
    }

    @PutMapping("/retake")
    public ResponseEntity<StudentProgress> retakeQuiz(@RequestBody RetakeQuizRequestDTO request) 
            throws ExecutionException, InterruptedException {
        
        // Basic validation
        if (request.getUser_id() == null || request.getLesson_id() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        StudentProgress updatedProgress = studentProgressService.retakeQuiz(
            request.getUser_id(),
            request.getLesson_id(),
            request.getProficiency_score(),
            request.getQuiz_score()
        );

        return ResponseEntity.ok(updatedProgress);
    }

}