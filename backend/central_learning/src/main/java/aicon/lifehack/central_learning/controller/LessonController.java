package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.model.Lesson;
import aicon.lifehack.central_learning.service.LessonService;
import aicon.lifehack.central_learning.model.Resource; 
import aicon.lifehack.central_learning.service.ResourceService; 
import java.util.List; 

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;
    private final ResourceService resourceService;

    public LessonController(LessonService lessonService, ResourceService resourceService) {
        this.lessonService = lessonService;
        this.resourceService = resourceService;
    }

    @PostMapping
    public ResponseEntity<?> createLesson(@RequestBody Lesson lesson) throws ExecutionException, InterruptedException {
        Lesson createdLesson = lessonService.createLesson(lesson);
        URI location = URI.create("/api/lessons/" + createdLesson.getLesson_id());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseEntity.created(location).body(createdLesson));
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<?> getLesson(@PathVariable String lessonId) throws ExecutionException, InterruptedException {
        Lesson lesson = lessonService.getLesson(lessonId);
        if (lesson != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(lesson)); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Lesson not found with ID: " + lessonId));
        }
    }

    @GetMapping("/{lessonId}/resources")
    public ResponseEntity<List<Resource>> getResourcesForLesson(@PathVariable String lessonId) 
            throws ExecutionException, InterruptedException {
        List<Resource> resources = resourceService.getResourcesByLesson(lessonId);
        return ResponseEntity.ok(resources);
    }

    
    @PutMapping("/{lessonId}")
    public ResponseEntity<?> updateLesson(@PathVariable String lessonId, @RequestBody Lesson lesson) throws ExecutionException, InterruptedException {
        Lesson updatedLesson = lessonService.updateLesson(lessonId, lesson);
        if (updatedLesson != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(updatedLesson));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot update. Lesson not found with ID: " + lessonId));
        }
    }
    
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<?> deleteLesson(@PathVariable String lessonId) throws ExecutionException, InterruptedException {
        if (lessonService.deleteLesson(lessonId)) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body("Lesson " + lessonId + " is deleted"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot update. Lesson not found with ID: " + lessonId));
        }
    }
}