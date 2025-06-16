package aicon.lifehack.central_learning.dto;

import aicon.lifehack.central_learning.model.Lesson;
import aicon.lifehack.central_learning.model.Quiz;
import aicon.lifehack.central_learning.model.Resource;
import lombok.Data;

import java.util.List;

@Data
public class CurrentLessonDTO {
    private Lesson lessonDetails;
    private List<Resource> resources;
    private Quiz quiz;
}