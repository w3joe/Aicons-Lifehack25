package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.dto.UpdateUserDTO;
import aicon.lifehack.central_learning.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
import com.google.cloud.firestore.WriteResult;
import org.springframework.stereotype.Service;
import com.google.cloud.firestore.QuerySnapshot; 
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
    public User updateUser(String userId, UpdateUserDTO updateUserDTO) throws ExecutionException, InterruptedException {
    // 1. Get a reference to the document
    DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(userId);
    
    // 2. Fetch the existing document to make sure it exists
    DocumentSnapshot document = docRef.get().get();

    if (document.exists()) {
        // 3. Convert the existing document to a User object
        User existingUser = document.toObject(User.class);
        
        // 4. Selectively update the fields from the DTO
        if (updateUserDTO.getUsername() != null) {
            existingUser.setUsername(updateUserDTO.getUsername());
        }
        if (updateUserDTO.getEmail() != null) {
            existingUser.setEmail(updateUserDTO.getEmail());
        }
          if (updateUserDTO.getPassword() != null) {
            existingUser.setPassword(updateUserDTO.getPassword());
        }
        
        // 5. Save the fully updated User object back to Firestore
        docRef.set(existingUser).get();
        return existingUser;
    } else {
        // 6. If the document doesn't exist, return null
        return null;
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

    public User loginUser(String email, String password) throws ExecutionException, InterruptedException {
        // 1. Create a query to find the user by email
        ApiFuture<QuerySnapshot> query = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("email", email)
                .get();

        QuerySnapshot querySnapshot = query.get();

        // 2. Check if any user was found
        if (querySnapshot.isEmpty()) {
            return null; // User with that email not found
        }

        // 3. Get the first document (assuming emails are unique)
        User user = querySnapshot.getDocuments().get(0).toObject(User.class);

        // 4. Compare the provided password with the stored password (plaintext comparison for MVP)
        // DANGER: In a real app, you would use passwordEncoder.matches(password, user.getPassword())
        if (user != null && user.getPassword().equals(password)) {
            return user; // Passwords match
        }

        return null; // Passwords do not match
    }
    
}
