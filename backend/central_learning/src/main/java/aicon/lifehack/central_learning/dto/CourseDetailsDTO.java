package aicon.lifehack.central_learning.dto;

import aicon.lifehack.central_learning.model.Lesson;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor // A no-argument constructor is needed for object mapping
public class CourseDetailsDTO {
    // Fields from the Course object
    private String course_id;
    private String topic_id;
    private String title;
    private String description;
    private String thumbnail;
    private int like_count;
    // The nested list of lessons
    private List<Lesson> lessons;
}