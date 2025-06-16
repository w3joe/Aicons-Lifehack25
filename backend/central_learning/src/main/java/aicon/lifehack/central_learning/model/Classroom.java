package aicon.lifehack.central_learning.model;

import lombok.Data;

@Data
public class Classroom {
    private String classroom_id;
    // The teacher who owns this classroom
    private String teacher_id;
    private String name; // e.g., "Grade 10 - Section A"
}