package aicon.lifehack.central_learning.model;

import lombok.Data;

import java.util.Date;

@Data
public class StudentProgress {

    // use a composite ID: "userId_lessonId"
    private String progress_id;
    private String user_id;
    private String lesson_id;
    private double quiz_score;
    private double latest_proficiency_score;
    private int attempts = 0; // Default to 0
    private Date completed_at;
    // The difficulty level for the NEXT time they take this lesson
    private Difficulty next_time_difficulty;
    /*public double getLatestProficiencyScore() {
        return this.latest_proficiency_score;
    }

    public void setLatestProficiencyScore(double latest_proficiency_score) {
        this.latest_proficiency_score = latest_proficiency_score;
    }*/
}