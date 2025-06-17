package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.model.Classroom;
import aicon.lifehack.central_learning.model.User;
import aicon.lifehack.central_learning.model.Course;

import com.google.common.collect.Lists;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ClassroomService {

    private final Firestore firestore;
    private final CourseService courseService; 

    public ClassroomService(Firestore firestore, CourseService courseService) {
        this.firestore = firestore;
        this.courseService = courseService;
    }

    // Creates a new classroom and assigns it to a teacher
    public Classroom createClassroom(Classroom classroom) throws ExecutionException, InterruptedException {
        DocumentReference classroomRef = firestore.collection("classrooms").document();
        classroom.setClassroom_id(classroomRef.getId());

        // Update the teacher's document to add this new classroomId
        DocumentReference teacherRef = firestore.collection("users").document(classroom.getTeacher_id());
        
        // Atomically add the new classroomId to the teacher's list
        teacherRef.update("classroom_ids", FieldValue.arrayUnion(classroom.getClassroom_id())).get();

        classroomRef.set(classroom).get();
        return classroom;
    }
    
    // Assigns a student to a classroom
    public void assignStudentToClassroom(String studentId, String classroomId) throws ExecutionException, InterruptedException {
        DocumentReference studentRef = firestore.collection("users").document(studentId);
        studentRef.update("classroom_id", classroomId).get();
    }
    
    // Get all students in a specific classroom
    public List<User> getStudentsInClassroom(String classroomId) throws ExecutionException, InterruptedException {
        return firestore.collection("users")
            .whereEqualTo("classroom_id", classroomId)
            .whereEqualTo("role", "STUDENT") // Ensure we only get students
            .get().get().toObjects(User.class);
    }

    public List<Classroom> getClassroomsByTeacher(String teacherId) throws ExecutionException, InterruptedException {
    return firestore.collection("classrooms")
        .whereEqualTo("teacher_id", teacherId)
        .get().get().toObjects(Classroom.class);
    }

    public void assignCourseToClassroom(String courseId, String classroomId) throws ExecutionException, InterruptedException {
        DocumentReference classroomRef = firestore.collection("classrooms").document(classroomId);

        // Use FieldValue.arrayUnion to safely add the course ID to the list.
        // This prevents duplicates and is an atomic operation.
        classroomRef.update("course_ids", FieldValue.arrayUnion(courseId)).get();
    }
    
    // --- NEW METHOD: Get all courses for a classroom ---
    public List<Course> getCoursesInClassroom(String classroomId) throws ExecutionException, InterruptedException {
        // 1. First, get the classroom document to find its list of course_ids.
        DocumentReference classroomRef = firestore.collection("classrooms").document(classroomId);
        DocumentSnapshot classroomSnapshot = classroomRef.get().get();

        if (!classroomSnapshot.exists()) {
            throw new IllegalStateException("Classroom not found with ID: " + classroomId);
        }

        Classroom classroom = classroomSnapshot.toObject(Classroom.class);
        List<String> courseIds = classroom.getCourse_ids();

        if (courseIds == null || courseIds.isEmpty()) {
            return new ArrayList<>(); // Return empty list if no courses are assigned.
        }

        // 2. Fetch all course documents corresponding to the IDs.
        // We must re-use the partitioning logic here to handle the 30-item limit of the 'in' query.
        List<Course> coursesInClassroom = new ArrayList<>();
        List<List<String>> partitionedCourseIds = Lists.partition(courseIds, 30);

        for (List<String> partition : partitionedCourseIds) {
            if (!partition.isEmpty()) {
                QuerySnapshot coursesSnapshot = firestore.collection("courses")
                        .whereIn(FieldPath.documentId(), partition)
                        .get()
                        .get();
                
                coursesInClassroom.addAll(coursesSnapshot.toObjects(Course.class));
            }
        }
        
        return coursesInClassroom;
    }
}
