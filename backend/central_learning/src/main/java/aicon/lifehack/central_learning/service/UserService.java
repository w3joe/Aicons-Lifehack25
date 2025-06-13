package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class UserService {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "users";

    public UserService(Firestore firestore) {
        this.firestore = firestore;
    }

    public User getUser(String documentId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(documentId);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            return document.toObject(User.class);
        }
        return null;
    }

    public List<User> getAllUsers() throws ExecutionException, InterruptedException {
        CollectionReference usersCollection = firestore.collection(COLLECTION_NAME);
        List<User> userList = new ArrayList<>();
        usersCollection.get().get().getDocuments().forEach(document -> {
            userList.add(document.toObject(User.class));
        });
        return userList;
    }

    public User createUser(User user) throws ExecutionException, InterruptedException {
    // Let Firestore auto-generate the ID
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document();
    user.setUser_id(docRef.getId()); // Set the auto-generated ID to the user object
    // Asynchronously write the data and wait for the result to ensure it's saved
    ApiFuture<WriteResult> result = docRef.set(user);
    result.get(); // .get() waits for the operation to complete
    return user; // Return the user object, now with the ID
    }

    public boolean updateUser(User user) throws ExecutionException, InterruptedException {
    // 1. Get a reference to the document using the ID from the user object.
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(user.getUser_id());

    // 2. Check if the document actually exists.
    ApiFuture<DocumentSnapshot> existenceCheck = docRef.get();
    DocumentSnapshot document = existenceCheck.get();

    if (document.exists()) {
        // 3. If it exists, perform the update.
        docRef.set(user);
        return true; // Signal that the update was successful.
    } else {
        // 4. If it does not exist, do nothing and signal failure.
        return false;
    }
}

   // In FirebaseService.java
public boolean deleteUser(String documentId) throws ExecutionException, InterruptedException {
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(documentId);
    
    // 1. First, get the document to see if it exists.
    DocumentSnapshot document = docRef.get().get(); 
    
        if (document.exists()) {
            // 2. If it exists, delete it.
            docRef.delete();
            return true; // Deletion was successful
        } else {
            // 3. If it doesn't exist, do nothing and report back.
            return false; // User was not found
        }
    }
}
