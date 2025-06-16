package aicon.lifehack.central_learning.model;

import lombok.Data;

import java.util.Date;

@Data
public class Quiz {
    private String quiz_id;
    private String title;
    private String description;
    private Difficulty difficulty;
    private Date created_at;

}