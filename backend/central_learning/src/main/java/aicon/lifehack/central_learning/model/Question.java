package aicon.lifehack.central_learning.model;

import lombok.Data;

import java.util.List; // For the options array

@Data
public class Question {
    private String question_id;
    private String quiz_id;
    private String question_text;
    // A list of strings for the multiple-choice options
    private List<String> options;
    private String correct_answer;
    private String explanation;
}