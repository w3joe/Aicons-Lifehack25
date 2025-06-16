package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.model.Classroom;
import aicon.lifehack.central_learning.model.User;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ClassroomService {

    private final Firestore firestore;

    public ClassroomService(Firestore firestore) {
        this.firestore = firestore;
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
}
