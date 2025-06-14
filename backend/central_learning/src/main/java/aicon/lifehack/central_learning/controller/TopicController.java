package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.model.Topic;
import aicon.lifehack.central_learning.service.TopicService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.concurrent.ExecutionException;

import aicon.lifehack.central_learning.model.Course; // Add this
import aicon.lifehack.central_learning.service.CourseService; // Add this
import java.util.List; // Add this

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;
    private final CourseService courseService;

   public TopicController(TopicService topicService, CourseService courseService) {
        this.topicService = topicService;
        this.courseService = courseService;
    }

    // --- CREATE ---
    @PostMapping
    public ResponseEntity<?> createTopic(@RequestBody Topic topic) throws ExecutionException, InterruptedException {
        Topic createdTopic = topicService.createTopic(topic);
        URI location = URI.create("/api/topics/" + createdTopic.getTopic_id());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseEntity.created(location).body(createdTopic));
    }

    // --- READ (Get One) ---
    @GetMapping("/{topicId}")
    public ResponseEntity<?> getTopic(@PathVariable String topicId) throws ExecutionException, InterruptedException {
        Topic topic = topicService.getTopic(topicId);
        if (topic != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(topic)); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Topic not found with ID: " + topicId));
        }
    }

    // --- READ (Get All) ---
    @GetMapping
    public ResponseEntity<?> getAllTopics() throws ExecutionException, InterruptedException {
        List<Topic> topics = topicService.getAllTopics();
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(topics)); // 200 OK
    }

    // --- UPDATE ---
    @PutMapping("/{topicId}")
    public ResponseEntity<?> updateTopic(@PathVariable String topicId, @RequestBody Topic topic) throws ExecutionException, InterruptedException {
        Topic updatedTopic = topicService.updateTopic(topicId, topic);
        if (updatedTopic != null) {
            
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(updatedTopic));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot update. Topic not found with ID: " + topicId));

        }
    }

    // --- DELETE ---
    @DeleteMapping("/{topicId}")
    public ResponseEntity<?> deleteTopic(@PathVariable String topicId) throws ExecutionException, InterruptedException {
        boolean deleted = topicService.deleteTopic(topicId);
        if (deleted) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body("topic " + topicId + " is deleted"));

        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot delete. Topic not found with ID: " + topicId));

        }
    }
    @GetMapping("/{topicId}/courses")
    public ResponseEntity<?> getCoursesForTopic(@PathVariable String topicId) 
            throws ExecutionException, InterruptedException {
        // Here you could first check if the topicId itself is valid
        List<Course> courses = courseService.getCoursesByTopic(topicId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(courses));
    }
    

    
}