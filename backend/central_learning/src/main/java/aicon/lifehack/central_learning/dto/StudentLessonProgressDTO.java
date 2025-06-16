package aicon.lifehack.central_learning.dto;

import aicon.lifehack.central_learning.model.StudentProgress;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StudentLessonProgressDTO {
    
    // Student Info
    private String userId;
    private String username;
    private String email;
    
    // This will "flatten" the StudentProgress object, so its fields (attempts, score, etc.)
    // appear directly under the student, making the JSON cleaner.
    @JsonUnwrapped
    private StudentProgress lessonProgress;

    public StudentLessonProgressDTO(String userId, String username, String email) {
        this.userId = userId;
        this.username = username;
        this.email = email;
    }
}