package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.dto.CurrentLessonDTO;
import aicon.lifehack.central_learning.model.Lesson;
import aicon.lifehack.central_learning.model.Quiz;
import aicon.lifehack.central_learning.model.Resource;
import aicon.lifehack.central_learning.model.StudentProgress;
import aicon.lifehack.central_learning.model.Difficulty;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Transaction;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Date;
import java.util.concurrent.ExecutionException;

@Service
public class StudentProgressService {

    private final Firestore firestore;
    private final LessonService lessonService;
    private final ResourceService resourceService;
    private final QuizService quizService;
    private static final String COLLECTION_NAME = "student_progress";

    public StudentProgressService(Firestore firestore, LessonService lessonService, ResourceService resourceService, QuizService quizService) {
        this.firestore = firestore;
        this.lessonService = lessonService;
        this.resourceService = resourceService;
        this.quizService = quizService;
    }   

    public StudentProgress getProgressForLesson(String userId, String lessonId) throws ExecutionException, InterruptedException {
        String progressId = userId + "_" + lessonId;
        DocumentSnapshot doc = firestore.collection(COLLECTION_NAME).document(progressId).get().get();
        return doc.exists() ? doc.toObject(StudentProgress.class) : null;
    }

    public void recordAttemptInTransaction(Transaction transaction, String userId, String lessonId, double proficiencyScore, double quizScore, Difficulty nextDifficulty) 
            throws ExecutionException, InterruptedException {
        
        String progressId = userId + "_" + lessonId;
        DocumentReference progressRef = firestore.collection(COLLECTION_NAME).document(progressId);
        
        DocumentSnapshot progressSnapshot = transaction.get(progressRef).get();

       if (progressSnapshot.exists()) {
            // Update existing record
            transaction.update(progressRef, "attempts", FieldValue.increment(1));
            transaction.update(progressRef, "latest_proficiency_score", proficiencyScore);
            transaction.update(progressRef, "quiz_score", quizScore); 
            transaction.update(progressRef, "completed_at", new Date());
            transaction.update(progressRef, "next_time_difficulty", nextDifficulty);
        } else {
            // Create a new record for the first attempt
            StudentProgress newProgress = new StudentProgress();
            newProgress.setProgress_id(progressId);
            newProgress.setUser_id(userId);
            newProgress.setLesson_id(lessonId);
            newProgress.setAttempts(1);
            newProgress.setLatest_proficiency_score(proficiencyScore);
            newProgress.setQuiz_score(quizScore); 
            newProgress.setCompleted_at(new Date());
            newProgress.setNext_time_difficulty(nextDifficulty);
            
            transaction.set(progressRef, newProgress);
        }
    }

    public CurrentLessonDTO getReviewLessonData(String userId, String lessonId) throws ExecutionException, InterruptedException {
        // 1. Get the student's progress record for this specific lesson (Unchanged)
        StudentProgress progress = getProgressForLesson(userId, lessonId);
        if (progress == null) {
            return null;
        }
        Difficulty reviewDifficulty = progress.getNext_time_difficulty();

        // 2. Fetch the full lesson details (Unchanged)
        Lesson lesson = lessonService.getLesson(lessonId);
        if (lesson == null) {
            throw new IllegalStateException("Lesson data not found for a progress record that exists.");
        }

        // 3. --- THIS IS THE KEY LOGIC CHANGE ---
        // Find the single resource for that lesson that matches the review difficulty.
        Resource lessonResource = resourceService.getResourcesByLesson(lessonId).stream()
                .filter(resource -> resource.getDifficulty() == reviewDifficulty)
                .findFirst() // Get the first (and only) match
                .orElse(null); // If no matching resource is found, return null

        // 4. Find the quiz (this logic is unchanged)
        Quiz lessonQuiz = null;
        if (lesson.getQuiz_id() != null && !lesson.getQuiz_id().isEmpty()) {
            Quiz potentialQuiz = quizService.getQuiz(lesson.getQuiz_id());
            if (potentialQuiz != null && potentialQuiz.getDifficulty() == reviewDifficulty) {
                lessonQuiz = potentialQuiz;
            }
        }
        
        // 5. Assemble and return the DTO with the new structure
        CurrentLessonDTO dto = new CurrentLessonDTO();
        dto.setLessonDetails(lesson);
        dto.setResource(lessonResource); // Set the single resource object
        dto.setQuiz(lessonQuiz);
        
        return dto;
    }

    public StudentProgress retakeQuiz(String userId, String lessonId, double proficiencyScore, double quizScore) 
        throws ExecutionException, InterruptedException {
    
    String progressId = userId + "_" + lessonId;
    DocumentReference progressRef = firestore.collection(COLLECTION_NAME).document(progressId);

    // We must run this in a transaction to safely read the old difficulty before writing.
    firestore.runTransaction(transaction -> {
        DocumentSnapshot progressSnapshot = transaction.get(progressRef).get();
        if (!progressSnapshot.exists()) {
            // This is a retake, so a record must already exist.
            throw new IllegalStateException("Cannot retake. No initial progress found for this lesson.");
        }

        StudentProgress existingProgress = progressSnapshot.toObject(StudentProgress.class);
        Difficulty currentDifficulty = existingProgress.getNext_time_difficulty();
        
        // Calculate the difficulty for the *next* time they might retake it again.
        // We need a way to determine the new difficulty. Let's assume we need the `calculateNewDifficulty`
        // logic. We might need to pass the "old" difficulty from somewhere or decide on a rule.
        // For simplicity, let's assume the "old" difficulty is the one stored in the record.
        Difficulty newNextTimeDifficulty = calculateNewDifficulty(currentDifficulty, proficiencyScore);

        // Update the document
        transaction.update(progressRef, "attempts", FieldValue.increment(1));
        transaction.update(progressRef, "latest_proficiency_score", proficiencyScore);
        transaction.update(progressRef, "quiz_score", quizScore);
        transaction.update(progressRef, "completed_at", new Date());
        transaction.update(progressRef, "next_time_difficulty", newNextTimeDifficulty);

        return null; // The transaction itself returns null
    }).get();

    // After the transaction, fetch and return the updated document.
    return progressRef.get().get().toObject(StudentProgress.class);
    }

    // We need the difficulty calculation logic here as well.
    // You could move this to a shared utility class, but for now, duplicating it is fine.
    private Difficulty calculateNewDifficulty(Difficulty current, double score) {
        if (score >= 86.0) {
            switch (current) {
                case REMEDIAL: return Difficulty.BEGINNER;
                case BEGINNER: return Difficulty.INTERMEDIATE;
                case INTERMEDIATE: return Difficulty.ADVANCED;
                case ADVANCED: return Difficulty.ADVANCED;
            }
        } else if (score >= 66.0) {
            return current;
        } else {
            switch (current) {
                case ADVANCED: return Difficulty.INTERMEDIATE;
                case INTERMEDIATE: return Difficulty.BEGINNER;
                case BEGINNER: return Difficulty.REMEDIAL;
                case REMEDIAL: return Difficulty.REMEDIAL;
            }
        }
        return current;
    }

    
}