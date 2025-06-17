package aicon.lifehack.central_learning.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SubmitQuizRequestDTO {
    private String user_id;
    private String quiz_id;
    private double proficiency_score;
    private double quiz_score;
}