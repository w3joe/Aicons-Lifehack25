package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.dto.StudentLessonProgressDTO;
import aicon.lifehack.central_learning.model.StudentProgress;
import aicon.lifehack.central_learning.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ClassroomService classroomService;
    private final StudentProgressService studentProgressService;

    public DashboardService(ClassroomService classroomService, StudentProgressService studentProgressService) {
        this.classroomService = classroomService;
        this.studentProgressService = studentProgressService;
    }

    public List<StudentLessonProgressDTO> getDashboardData(String classroomId, String lessonId) 
            throws ExecutionException, InterruptedException {
        
        // 1. Get all students in the specified classroom.
        List<User> students = classroomService.getStudentsInClassroom(classroomId);

        if (students.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 2. For each student, fetch their specific progress record for the given lesson.
        // This is a great place for parallel processing in a real app, but for now, a loop is fine.
        List<StudentLessonProgressDTO> dashboardData = new ArrayList<>();
        for (User student : students) {
            StudentLessonProgressDTO studentData = new StudentLessonProgressDTO(
                student.getUser_id(),
                student.getUsername(),
                student.getEmail()
            );

            // Fetch the progress for this lesson.
            StudentProgress progress = studentProgressService.getProgressForLesson(student.getUser_id(), lessonId);
            
            // The 'progress' can be null if the student hasn't attempted the lesson yet.
            // Our DTO is designed to handle this gracefully.
            studentData.setLessonProgress(progress);
            
            dashboardData.add(studentData);
        }

        return dashboardData;
    }
}