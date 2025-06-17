package aicon.lifehack.central_learning.controller;
import aicon.lifehack.central_learning.model.Course;
import aicon.lifehack.central_learning.model.Quiz;
import aicon.lifehack.central_learning.model.User;
import aicon.lifehack.central_learning.model.Lesson;
import aicon.lifehack.central_learning.service.LessonService;
import aicon.lifehack.central_learning.service.QuizService;
import aicon.lifehack.central_learning.service.UserService;
import aicon.lifehack.central_learning.dto.QuizContextDTO; 
import aicon.lifehack.central_learning.dto.QuizDetailsDTO;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;
    private final LessonService lessonService;

    public QuizController(QuizService quizService, LessonService lessonService) {
    this.quizService = quizService;
    this.lessonService = lessonService;
}

    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody Quiz quiz) throws ExecutionException, InterruptedException {
        Quiz createdQuiz = quizService.createQuiz(quiz);
        URI location = URI.create("/api/quizzes/" + createdQuiz.getQuiz_id());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseEntity.created(location).body(createdQuiz));
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable String quizId, @RequestBody Quiz quiz) throws ExecutionException, InterruptedException {
        Quiz updatedQuiz = quizService.updateQuiz(quizId, quiz);
        if (updatedQuiz != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(updatedQuiz));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot update. Quiz not found with ID: " + quizId));

        }
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuiz(@PathVariable String quizId) throws ExecutionException, InterruptedException {
        Quiz quiz = quizService.getQuiz(quizId);
        if (quiz != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(quiz)); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("quiz not found with ID: " + quizId));
        }
    }


    @GetMapping("/{quizId}/details")
    public ResponseEntity<?> getQuizWithDetails(@PathVariable String quizId) throws ExecutionException, InterruptedException {
        QuizDetailsDTO quizDetails = quizService.getQuizWithQuestions(quizId);
        if (quizDetails != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(quizDetails)); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Quiz not found with ID: " + quizId));
        }
    }


    @GetMapping("/{quizId}/context")
    public ResponseEntity<?> getQuizContext(@PathVariable String quizId)
        throws ExecutionException, InterruptedException {
    
        // First, you might want to check if the quiz itself exists
        if (quizService.getQuiz(quizId) == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Quiz not found with ID: " + quizId));
        }

    // Find the lesson associated with this quiz
        Lesson lesson = lessonService.getLessonByQuizId(quizId);

        if (lesson != null) {
            // If a lesson is found, create the response DTO
            QuizContextDTO context = new QuizContextDTO(lesson.getCourse_id(), lesson.getLesson_id());
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(context)); // 200 OK
        } else {
            // This means a quiz exists but is not linked to any lesson.
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("No lesson is associated with quiz ID: " + quizId));

        }
    }
    
    @DeleteMapping("/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable String quizId) throws ExecutionException, InterruptedException {
        if (quizService.deleteQuiz(quizId)) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body("Quiz " + quizId + " is deleted"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot delete. Quiz not found with ID: " + quizId));
        }
    }
}