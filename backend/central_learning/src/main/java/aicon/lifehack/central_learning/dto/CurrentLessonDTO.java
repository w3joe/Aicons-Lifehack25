package aicon.lifehack.central_learning.dto;

import aicon.lifehack.central_learning.model.Lesson;
import aicon.lifehack.central_learning.model.Quiz;
import aicon.lifehack.central_learning.model.Resource;
import lombok.Data;
@Data
public class CurrentLessonDTO {
    private Lesson lessonDetails;
    private Resource resource;
    private Quiz quiz;
}