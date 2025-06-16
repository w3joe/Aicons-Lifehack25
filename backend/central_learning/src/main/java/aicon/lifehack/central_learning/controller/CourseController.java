package aicon.lifehack.central_learning.controller;
import aicon.lifehack.central_learning.model.Course;
import aicon.lifehack.central_learning.service.CourseService;
import aicon.lifehack.central_learning.service.LessonService;
import aicon.lifehack.central_learning.model.Lesson;
import aicon.lifehack.central_learning.dto.LikeRequestDTO; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.*;
import aicon.lifehack.central_learning.dto.CourseDetailsDTO;
import aicon.lifehack.central_learning.dto.CurrentLessonDTO;

import java.net.URI;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import java.util.List; 
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final LessonService lessonService;


   public CourseController(CourseService courseService, LessonService lessonService ) {
        this.courseService = courseService;
        this.lessonService = lessonService;
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Course course) throws ExecutionException, InterruptedException {
        Course createdCourse = courseService.createCourse(course);
        URI location = URI.create("/api/courses/" + createdCourse.getCourse_id());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseEntity.created(location).body(createdCourse));
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getCourse(@PathVariable String courseId) throws ExecutionException, InterruptedException {
        Course course = courseService.getCourse(courseId);
        if (course != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(course)); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Course not found with ID: " + courseId));

        }
    }

    // --- READ (Get All) ---
    @GetMapping
    public ResponseEntity<?> getAllCourses() throws ExecutionException, InterruptedException {
        List<Course> courses = courseService.getAllCourse();
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(courses)); // 200 OK
    }

    // --- GET A SINGLE COURSE WITH ITS LESSONS ---
    @GetMapping("/{courseId}/details")
    public ResponseEntity<?> getCourseWithLessons(@PathVariable String courseId) 
            throws ExecutionException, InterruptedException {
        
        CourseDetailsDTO courseDetails = courseService.getCourseWithLessons(courseId);
        
        if (courseDetails != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(courseDetails)); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Course not found with ID: " + courseId));
        }
    }

    // --- GET THE CURRENT LESSON WITH THE CORRESPONDING DIFFICULTY ---
    @GetMapping("/{courseId}/current-lesson")
    public ResponseEntity<?> getCurrentLesson(
        @PathVariable String courseId, @RequestParam String userId)
        throws ExecutionException, InterruptedException {
            
        CurrentLessonDTO currentLessonData = courseService.getCurrentLessonForUser(userId, courseId);
        if (currentLessonData == null) {
            // You could return a special object indicating course completion
            return ResponseEntity.ok().body(null); // Or a specific DTO for "Course Complete"
        }
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(currentLessonData)); // 200 OK

    }
    
    @PutMapping("/{courseId}")
    public ResponseEntity<?> updateCourse(@PathVariable String courseId, @RequestBody Course course) throws ExecutionException, InterruptedException {
        Course updatedCourse = courseService.updateCourse(courseId, course);
        if (updatedCourse != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(updatedCourse));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot update. Course not found with ID: " + courseId));

        }
    }
    
    @DeleteMapping("/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable String courseId) throws ExecutionException, InterruptedException {
        if (courseService.deleteCourse(courseId)) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body("Course " + courseId + " is deleted"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot delete. Course not found with ID: " + courseId));
        }
    }
    @GetMapping("/{courseId}/lessons")
    public ResponseEntity<?> getLessonsForCourse(@PathVariable String courseId) 
            throws ExecutionException, InterruptedException {
        List<Lesson> lessons = lessonService.getLessonsByCourse(courseId);
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(lessons)); // 200 OK
    }

    // --- LIKE a Course ---
    @PostMapping("/{courseId}/like")
    public ResponseEntity<?> likeCourse(
            @PathVariable String courseId, @RequestBody LikeRequestDTO likeRequest) 
            throws ExecutionException, InterruptedException {
        
        // Attempt to like the course
        courseService.likeCourse(courseId, likeRequest.getUser_id());
        
        // Regardless of whether a new like was added or not,
        // fetch and return the current state of the course.
        Course updatedCourse = courseService.getCourse(courseId);
        if (updatedCourse == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Course not found with ID: " + courseId));

        }
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(updatedCourse)); // 200 OK

    }

    // --- UNLIKE a Course ---
    @DeleteMapping("/{courseId}/unlike")
    public ResponseEntity<?> unlikeCourse(
            @PathVariable String courseId, @RequestBody LikeRequestDTO likeRequest) 
            throws ExecutionException, InterruptedException {

        // Attempt to unlike the course
        courseService.unlikeCourse(courseId, likeRequest.getUser_id());
        
        // Fetch and return the current state of the course.
        Course updatedCourse = courseService.getCourse(courseId);
        if (updatedCourse == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Course not found with ID: " + courseId));

        }
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(courseId)); // 200 OK
    }
}