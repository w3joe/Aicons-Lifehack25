package aicon.lifehack.central_learning.dto.cohere;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder // The Builder pattern is great for creating these requests
public class CohereChatRequest {
    private String message;
    private String preamble;

    // We can add more parameters like temperature later if needed
    @JsonProperty("stream")
    private boolean stream = false;
}