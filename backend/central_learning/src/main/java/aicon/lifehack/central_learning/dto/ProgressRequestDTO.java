package aicon.lifehack.central_learning.dto;

import aicon.lifehack.central_learning.model.Difficulty;
import lombok.Data;

@Data
public class ProgressRequestDTO {
    private String user_id;
    private String course_id;
    private double quiz_score;
    private double proficiency_score; 
}