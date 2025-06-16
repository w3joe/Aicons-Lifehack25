package aicon.lifehack.central_learning.model;


import java.util.Date;

import lombok.Data;

@Data
public class Course {
    private String course_id;
    // This is our "foreign key" relationship
    private String topic_id;
    private String title;
    private String description;
    private String author;
    private Date created_at;
    private int like_count = 0;
    // You could add more fields here later, like 'difficulty', 'imageUrl', etc.
}