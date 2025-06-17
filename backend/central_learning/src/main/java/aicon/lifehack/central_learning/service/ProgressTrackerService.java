package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.model.Difficulty;
import aicon.lifehack.central_learning.model.Lesson;
import aicon.lifehack.central_learning.model.ProgressTracker;
import aicon.lifehack.central_learning.model.StudentProgress;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;
import java.util.Date;

import java.util.concurrent.ExecutionException;

@Service
public class ProgressTrackerService {

    private final Firestore firestore;
    private final LessonService lessonService; // Make sure this is injected

    private static final String PROGRESS_TRACKERS_COLLECTION = "progress_trackers";
    private static final String STUDENT_PROGRESS_COLLECTION = "student_progress";

    public ProgressTrackerService(Firestore firestore, LessonService lessonService) {
        this.firestore = firestore;
        this.lessonService = lessonService;
    }

    private DocumentReference getTrackerRef(String userId, String courseId) {
        String progressId = userId + "_" + courseId;
        return firestore.collection(PROGRESS_TRACKERS_COLLECTION).document(progressId);
    }
    
    public ProgressTracker getOrCreateTracker(String userId, String courseId) throws ExecutionException, InterruptedException {
        DocumentReference trackerRef = getTrackerRef(userId, courseId);
        DocumentSnapshot trackerSnapshot = trackerRef.get().get();

        if (trackerSnapshot.exists()) {
            return trackerSnapshot.toObject(ProgressTracker.class);
        } else {
            ProgressTracker newTracker = new ProgressTracker();
            newTracker.setProgress_id(trackerRef.getId());
            newTracker.setUser_id(userId);
            newTracker.setCourse_id(courseId);
            newTracker.setCurrent_lesson_number(1);
            newTracker.setCurrent_difficulty(Difficulty.INTERMEDIATE);

            trackerRef.set(newTracker).get();
            return newTracker;
        }
    }
    
    public ProgressTracker updateProgress(String userId, String courseId, double proficiencyScore, double quizScore) throws ExecutionException, InterruptedException {
        DocumentReference trackerRef = getTrackerRef(userId, courseId);
        
        firestore.runTransaction(transaction -> {
                        DocumentSnapshot trackerSnapshot = transaction.get(trackerRef).get();
            if (!trackerSnapshot.exists()) {
                throw new IllegalStateException("Progress tracker not found. Cannot update.");
            }
            
            // We need the lesson number to find the lesson that was just completed.
            int currentLessonNumber = trackerSnapshot.getLong("current_lesson_number").intValue();
            
            // Find the lesson document to get its ID.
            // This query happens outside the transaction's read set, but it's necessary
            // to get the ID we need for the next read.
            Lesson completedLesson = lessonService.getLessonsByCourse(courseId).stream()
                .filter(lesson -> lesson.getLesson_number() == currentLessonNumber)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Could not find lesson with number: " + currentLessonNumber));
            
            // 3. Prepare to read the specific student_progress record for this lesson.
            String studentProgressId = userId + "_" + completedLesson.getLesson_id();
            DocumentReference studentProgressRef = firestore.collection(STUDENT_PROGRESS_COLLECTION).document(studentProgressId);
            DocumentSnapshot studentProgressSnapshot = transaction.get(studentProgressRef).get();


            // --- LOGIC AND WRITE PHASE ---
            
            ProgressTracker currentTracker = trackerSnapshot.toObject(ProgressTracker.class);
            Difficulty currentDifficulty = currentTracker.getCurrent_difficulty();
        
            Difficulty newDifficulty = calculateNewDifficulty(currentDifficulty, proficiencyScore);
            boolean shouldIncrementLesson = shouldIncrementLesson(currentDifficulty, newDifficulty, proficiencyScore);
            
            // Write #1: Apply updates to the main tracker
            if (shouldIncrementLesson) {
                transaction.update(trackerRef, "current_lesson_number", FieldValue.increment(1));
            }
            transaction.update(trackerRef, "current_difficulty", newDifficulty);

            // Write #2: Apply writes to the student progress record
            Difficulty nextTimeDifficultyForThisLesson = calculateNewDifficulty(currentDifficulty, proficiencyScore);
            
            if (studentProgressSnapshot.exists()) {
                // Update existing student progress
                transaction.update(studentProgressRef, "attempts", FieldValue.increment(1));
                transaction.update(studentProgressRef, "latest_proficiency_score", proficiencyScore);
                transaction.update(studentProgressRef, "quiz_score", quizScore);
                transaction.update(studentProgressRef, "completed_at", new Date());
                transaction.update(studentProgressRef, "next_time_difficulty", nextTimeDifficultyForThisLesson);
            } else {
                // Create new student progress record
                StudentProgress newProgress = new StudentProgress();
                newProgress.setProgress_id(studentProgressId);
                newProgress.setUser_id(userId);
                newProgress.setLesson_id(completedLesson.getLesson_id());
                newProgress.setAttempts(1);
                newProgress.setLatest_proficiency_score(proficiencyScore);
                newProgress.setCompleted_at(new Date());
                newProgress.setNext_time_difficulty(nextTimeDifficultyForThisLesson);
                transaction.set(studentProgressRef, newProgress);
            }
            
            return null; // Transaction must return something.
        }).get();

        // After the transaction, re-fetch the main tracker to return its final, committed state.
        return trackerRef.get().get().toObject(ProgressTracker.class);
    }
    



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
    
    private boolean shouldIncrementLesson(Difficulty oldDifficulty, Difficulty newDifficulty, double score) {
        // Rule #1: The "Remedial Gate"
        // If the difficulty was just lowered TO Remedial, do not advance.
        if (newDifficulty == Difficulty.REMEDIAL && oldDifficulty != Difficulty.REMEDIAL) {
            return false;
        }
        
        // Rule #2: The "Remedial Exit"
        // If the user is currently at the Remedial level, they have stricter requirements to advance.
        if (oldDifficulty == Difficulty.REMEDIAL) {
            return score >= 86.0;
        }
        
        // In all other cases, the user progresses to the next lesson.
        return true;
    }
}