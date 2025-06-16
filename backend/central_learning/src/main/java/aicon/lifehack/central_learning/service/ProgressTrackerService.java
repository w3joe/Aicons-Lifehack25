package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.dto.UpdateProgressDTO;
import aicon.lifehack.central_learning.model.Difficulty;
import aicon.lifehack.central_learning.model.ProgressTracker;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class ProgressTrackerService {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "progress_trackers";

    public ProgressTrackerService(Firestore firestore) {
        this.firestore = firestore;
    }

    private DocumentReference getTrackerRef(String userId, String courseId) {
        String progressId = userId + "_" + courseId;
        return firestore.collection(COLLECTION_NAME).document(progressId);
    }
    
    // Gets a tracker, or creates a default one if it doesn't exist.
    public ProgressTracker getOrCreateTracker(String userId, String courseId) throws ExecutionException, InterruptedException {
        DocumentReference trackerRef = getTrackerRef(userId, courseId);
        DocumentSnapshot trackerSnapshot = trackerRef.get().get();

        if (trackerSnapshot.exists()) {
            return trackerSnapshot.toObject(ProgressTracker.class);
        } else {
            // Create a new default tracker
            ProgressTracker newTracker = new ProgressTracker();
            newTracker.setProgress_id(trackerRef.getId());
            newTracker.setUser_id(userId);
            newTracker.setCourse_id(courseId);
            newTracker.setCurrent_lesson_number(1); // Start at lesson 1
            newTracker.setCurrent_difficulty(Difficulty.INTERMEDIATE); // Default difficulty

            trackerRef.set(newTracker).get();
            return newTracker;
        }
    }
    
    
    public ProgressTracker updateProgress(String userId, String courseId, double proficiencyScore) throws ExecutionException, InterruptedException {
        DocumentReference trackerRef = getTrackerRef(userId, courseId);
        
        firestore.runTransaction(transaction -> {
            DocumentSnapshot trackerSnapshot = transaction.get(trackerRef).get();
            if (!trackerSnapshot.exists()) {
                throw new IllegalStateException("Progress tracker not found. Cannot update.");
            }

            ProgressTracker currentTracker = trackerSnapshot.toObject(ProgressTracker.class);
            Difficulty currentDifficulty = currentTracker.getCurrent_difficulty();
            
            Difficulty newDifficulty = calculateNewDifficulty(currentDifficulty, proficiencyScore);
            boolean shouldIncrementLesson = shouldIncrementLesson(currentDifficulty, newDifficulty, proficiencyScore);
            
            if (shouldIncrementLesson) {
                transaction.update(trackerRef, "current_lesson_number", FieldValue.increment(1));
            }
            transaction.update(trackerRef, "current_difficulty", newDifficulty);
            
            return null; 
        }).get();

        DocumentSnapshot updatedSnapshot = trackerRef.get().get();
        if (updatedSnapshot.exists()) {
            return updatedSnapshot.toObject(ProgressTracker.class);
        } else {
            throw new IllegalStateException("Progress tracker disappeared after update.");
        }
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