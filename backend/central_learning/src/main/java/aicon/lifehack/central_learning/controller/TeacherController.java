package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.model.Classroom;
import aicon.lifehack.central_learning.service.ClassroomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final ClassroomService classroomService;

    public TeacherController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    /**
     * Retrieves all classrooms managed by a specific teacher.
     */
    @GetMapping("/{teacherId}/classrooms")
    public ResponseEntity<List<Classroom>> getTeacherClassrooms(@PathVariable String teacherId) 
            throws ExecutionException, InterruptedException {
        
        List<Classroom> classrooms = classroomService.getClassroomsByTeacher(teacherId);
        return ResponseEntity.ok(classrooms);
    }
}