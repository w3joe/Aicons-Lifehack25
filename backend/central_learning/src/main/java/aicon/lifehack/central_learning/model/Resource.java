package aicon.lifehack.central_learning.model;

import lombok.Data;

@Data
public class Resource {
    private String resource_id;
    private String lesson_id;
    private String title;
    private ResourceType resource_type;
    private String url_or_content;

    // Define the enum for resource types
    public enum ResourceType {
        VIDEO,
        TEXT
    }
}