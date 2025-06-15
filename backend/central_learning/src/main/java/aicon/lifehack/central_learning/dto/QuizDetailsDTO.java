package aicon.lifehack.central_learning.dto;

import aicon.lifehack.central_learning.model.Question;
import aicon.lifehack.central_learning.model.Quiz;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class QuizDetailsDTO {
    
    // This annotation "flattens" the Quiz object, so its fields
    // appear at the top level of the JSON response.
    @JsonUnwrapped
    private Quiz quiz;

    private List<Question> questions;

    // Convenience constructor
    public QuizDetailsDTO(Quiz quiz, List<Question> questions) {
        this.quiz = quiz;
        this.questions = questions;
    }
}