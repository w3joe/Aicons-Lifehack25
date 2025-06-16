package aicon.lifehack.central_learning.model;

import lombok.Data;

@Data
public class Lesson {

    private String lesson_id;
    private String course_id;

    // Optional field. It can be null.
    private String quiz_id; 
    private String title;
    private String time_taken;
    // You could add more fields here later, like 'video_url', 'content', 'lesson_order', etc.
    private String Description;
    private int lesson_number; //AUTO INCREMENT
}