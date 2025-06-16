package aicon.lifehack.central_learning.model;

import lombok.Data;

@Data
public class ProgressTracker {
    
    private String progress_id;
    private String user_id;
    private String course_id;
    private int current_lesson_number;
    private Difficulty current_difficulty;
}