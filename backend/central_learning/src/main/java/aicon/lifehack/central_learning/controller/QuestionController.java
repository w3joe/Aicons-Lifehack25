package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.model.Question;
import aicon.lifehack.central_learning.service.QuestionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody Question question) throws ExecutionException, InterruptedException {
        Question createdQuestion = questionService.createQuestion(question);
        URI location = URI.create("/api/questions/" + createdQuestion.getQuestion_id());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseEntity.created(location).body(createdQuestion));

    }

    @PutMapping("/{questionId}")
    public ResponseEntity<?> updateQuestion(@PathVariable String questionId, @RequestBody Question question) throws ExecutionException, InterruptedException {
        Question updatedQuestion = questionService.updateQuestion(questionId, question);
        if (updatedQuestion != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(updatedQuestion));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot update. Question not found with ID: " + questionId));

        }
    }
    
    @DeleteMapping("/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable String questionId) throws ExecutionException, InterruptedException {
        if (questionService.deleteQuestion(questionId)) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body("Question " + questionId + " is deleted"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot delete. Question not found with ID: " + questionId));
        }
    }
}