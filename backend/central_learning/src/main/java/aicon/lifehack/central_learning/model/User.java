package aicon.lifehack.central_learning.model;

import lombok.Data;

@Data // Lombok annotation to create all the getters, setters, equals, hash, and toString methods
public class User {
    private String user_id; // This will be the document ID from Firestore
    private String name;
    private String email;
}