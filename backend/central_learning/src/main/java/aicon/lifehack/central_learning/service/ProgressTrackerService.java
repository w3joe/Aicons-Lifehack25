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
    
    public ProgressTracker updateProgress(String userId, String courseId, Difficulty newDifficulty) throws ExecutionException, InterruptedException {
    DocumentReference trackerRef = getTrackerRef(userId, courseId);
            firestore.runTransaction(transaction -> {
            DocumentSnapshot trackerSnapshot = transaction.get(trackerRef).get();
            if (!trackerSnapshot.exists()) {
                throw new IllegalStateException("Progress tracker not found. Cannot update.");
            }

            transaction.update(trackerRef, "current_lesson_number", FieldValue.increment(1));
            
            // Use the newDifficulty parameter directly
            transaction.update(trackerRef, "current_difficulty", newDifficulty);
            
            return null; 
        }).get();

        // The re-fetch logic also remains the same
        DocumentSnapshot updatedSnapshot = trackerRef.get().get();
        if (updatedSnapshot.exists()) {
            return updatedSnapshot.toObject(ProgressTracker.class);
        } else {
            throw new IllegalStateException("Progress tracker disappeared after update.");
        }
    }
}