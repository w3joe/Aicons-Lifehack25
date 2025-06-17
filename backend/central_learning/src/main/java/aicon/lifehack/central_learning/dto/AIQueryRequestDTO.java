package aicon.lifehack.central_learning.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AIQueryRequestDTO {
    private String resource_id;

    private String prompt; // The user's question
}