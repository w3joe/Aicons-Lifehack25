package aicon.lifehack.central_learning.dto;

import lombok.Data;

@Data
public class RetakeQuizRequestDTO {
    private String user_id;
    private String lesson_id;
    private double proficiency_score;
    private double quiz_score;
}