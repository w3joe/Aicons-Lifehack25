package aicon.lifehack.central_learning.dto;

import aicon.lifehack.central_learning.model.Difficulty;
import lombok.Data;

@Data
public class ProgressRequestDTO {
    private String user_id;
    private String course_id;
    // This field will only be used for the update request,
    // it can be null for the 'get' request.
    private Difficulty new_difficulty;
}