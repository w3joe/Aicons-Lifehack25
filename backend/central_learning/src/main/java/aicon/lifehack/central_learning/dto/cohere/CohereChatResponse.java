package aicon.lifehack.central_learning.dto.cohere;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // Important for ignoring extra fields
public class CohereChatResponse {
    private String text; // This is where Cohere's answer will be
}