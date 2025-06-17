package aicon.lifehack.central_learning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor // A constructor with all fields is useful here
public class QuizContextDTO {
    private String course_id;
    private String lesson_id;
}