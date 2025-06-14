package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.model.Lesson;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class LessonService {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "lessons";

    public LessonService(Firestore firestore) {
        this.firestore = firestore;
    }
    
    private CollectionReference getLessonsCollection() {
        return firestore.collection(COLLECTION_NAME);
    }

    public Lesson createLesson(Lesson lesson) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getLessonsCollection().document();
        lesson.setLesson_id(docRef.getId());
        docRef.set(lesson).get();
        return lesson;
    }
    
    public Lesson getLesson(String lessonId) throws ExecutionException, InterruptedException {
        DocumentSnapshot document = getLessonsCollection().document(lessonId).get().get();
        return document.exists() ? document.toObject(Lesson.class) : null;
    }

    public List<Lesson> getLessonsByCourse(String courseId) throws ExecutionException, InterruptedException {
        List<Lesson> lessonList = new ArrayList<>();
        QuerySnapshot querySnapshot = getLessonsCollection().whereEqualTo("course_id", courseId).get().get();
        
        querySnapshot.getDocuments().forEach(document -> {
            lessonList.add(document.toObject(Lesson.class));
        });
        return lessonList;
    }
    
    public Lesson updateLesson(String lessonId, Lesson lesson) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getLessonsCollection().document(lessonId);
        if (docRef.get().get().exists()) {
            // Selectively update fields
            docRef.update("title", lesson.getTitle());
            return docRef.get().get().toObject(Lesson.class);
        }
        return null;
    }
    
    public boolean deleteLesson(String lessonId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getLessonsCollection().document(lessonId);
        if (docRef.get().get().exists()) {
            docRef.delete();
            return true;
        }
        return false;
    }
}