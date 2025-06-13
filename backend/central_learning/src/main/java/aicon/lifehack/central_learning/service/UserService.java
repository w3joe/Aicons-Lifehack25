package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
import com.google.cloud.firestore.WriteResult;
import org.springframework.stereotype.Service;

import java.util.Date;
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

    
    public User getUser(String userId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(userId);
        DocumentSnapshot document = docRef.get().get();
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
        // 1. Generate the unique ID from Firestore
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document();
        
        // 2. Set the server-side fields
        user.setUser_id(docRef.getId()); // Set the user_id
        user.setCreated_at(new Date());  
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // 3. Save the user object to Firestore
        docRef.set(user).get(); // .get() waits for the write to complete
        
        return user;
    }

    public boolean updateUser(User user) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(user.getUser_id());
        DocumentSnapshot document = docRef.get().get();

        if (document.exists()) {
            // Be careful about what fields you allow to be updated.
            // For example, you probably don't want to change 'createdAt'.
            // A more advanced implementation would use a DTO (Data Transfer Object) here.
            docRef.set(user, SetOptions.merge()); // Use merge to avoid overwriting createdAt if not provided
            return true;
        } else {
            return false;
        }
    }



   public boolean deleteUser(String userId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(userId);
        DocumentSnapshot document = docRef.get().get();
        
        if (document.exists()) {
            docRef.delete();
            return true;
        } else {
            return false;
        }
    }
    
}
