package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.dto.StudentLessonProgressDTO;
import aicon.lifehack.central_learning.service.DashboardService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * Fetches the progress of all students in a given classroom for a specific lesson.
     * This is intended for the teacher's dashboard view.
     */
    @GetMapping("/lesson-progress")
    public ResponseEntity<?> getLessonProgressForClassroom(
            @RequestParam String classroomId, @RequestParam String lessonId) 
            throws ExecutionException, InterruptedException {
        
        // You could add a security check here to ensure the user making the request
        // is the teacher who owns this classroomId.
        
        List<StudentLessonProgressDTO> dashboardData = dashboardService.getDashboardData(classroomId, lessonId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(dashboardData)); // 200 OK
    }
}
