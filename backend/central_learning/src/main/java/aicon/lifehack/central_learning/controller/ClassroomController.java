package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.model.Classroom;
import aicon.lifehack.central_learning.service.ClassroomService;
import aicon.lifehack.central_learning.dto.AssignStudentDTO;
import aicon.lifehack.central_learning.model.User;
import aicon.lifehack.central_learning.dto.AssignCourseDTO; 
import aicon.lifehack.central_learning.model.Course; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.ExecutionException;
import java.util.List; 

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {

    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    /**
     * Creates a new classroom and assigns it to the specified teacher.
     */
    @PostMapping
    public ResponseEntity<?> createClassroom(@RequestBody Classroom classroom) 
            throws ExecutionException, InterruptedException {
        
        // Basic validation
        if (classroom.getTeacher_id() == null || classroom.getName() == null) {
            return ResponseEntity.badRequest().build();
        }

        Classroom createdClassroom = classroomService.createClassroom(classroom);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(createdClassroom)); // 200 OK
    }

    
    @PutMapping("/{classroomId}/assign-student")
    public ResponseEntity<?> assignStudent(
            @PathVariable String classroomId, @RequestBody AssignStudentDTO assignStudentDTO) 
            throws ExecutionException, InterruptedException {
        
        // Security check: You could verify that the user making this request is the teacher of this classroom.

        classroomService.assignStudentToClassroom(assignStudentDTO.getStudent_id(), classroomId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body("Student " + assignStudentDTO.getStudent_id() + "is added")); // 200 OK
    }
    
    //---GET ALL STUDENT IN A CLASS---
    @GetMapping("/{classroomId}/students")
    public ResponseEntity<?> getStudentsInClassroom(@PathVariable String classroomId) 
            throws ExecutionException, InterruptedException {
        
        // Security check: You could verify that the user making the request
        // is the teacher of this classroom before proceeding.

        List<User> students = classroomService.getStudentsInClassroom(classroomId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(students)); // 200 OK
    }

    // --- ASSIGN A COURSE TO A CLASSROOM ---
    @PutMapping("/{classroomId}/assign-course")
    public ResponseEntity<?> assignCourse(
            @PathVariable String classroomId, @RequestBody AssignCourseDTO assignCourseDTO) 
            throws ExecutionException, InterruptedException {
        
        classroomService.assignCourseToClassroom(assignCourseDTO.getCourse_id(), classroomId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body("Course  " + assignCourseDTO.getCourse_id() + " is added to classroom" + classroomId)); // 200 OK

    }

    // --- GET ALL COURSES IN A CLASSROOM ---
    @GetMapping("/{classroomId}/courses")
    public ResponseEntity<?> getCoursesInClassroom(@PathVariable String classroomId) 
            throws ExecutionException, InterruptedException {
        
        List<Course> courses = classroomService.getCoursesInClassroom(classroomId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(courses)); // 200 OK
    }
}