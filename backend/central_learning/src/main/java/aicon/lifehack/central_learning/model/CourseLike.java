package aicon.lifehack.central_learning.model;

import lombok.Data;

import java.util.Date;

@Data
public class CourseLike {
    private String course_likes_id;
    private String user_id;
    private String course_id;
    private Date liked_at;
}