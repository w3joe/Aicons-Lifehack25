package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.dto.cohere.CohereChatRequest;
import aicon.lifehack.central_learning.dto.cohere.CohereChatResponse;
import aicon.lifehack.central_learning.model.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIService {

    private final RestTemplate restTemplate;
    private final ResourceService resourceService;

    @Value("${cohere.api.key}") // Injects the key from application.properties
    private String cohereApiKey;

    private static final String COHERE_API_URL = "https://api.cohere.ai/v1/chat";

    public AIService(RestTemplate restTemplate, ResourceService resourceService) {
        this.restTemplate = restTemplate;
        this.resourceService = resourceService;
    }

    public String getAIResponse(String resourceId, String userPrompt) throws Exception {
        // 1. Fetch the resource to get its descriptive title.
        Resource resource = resourceService.getResource(resourceId);
        if (resource == null) {
            throw new IllegalStateException("Resource not found with ID: " + resourceId);

            
        }

        // 2. Create the Preamble (Context) for the AI.
        // This is crucial for guiding the AI's response.
        String preamble = "You are an expert tutor. Based on the context from the following lesson title, answer the user's question. " +
                          "The lesson title is: '" + resource.getTitle() + "'. " +
                          "Only use the information implied by this title to answer the question.";
        
        // 3. Build the request body for Cohere's API.
        CohereChatRequest cohereRequest = CohereChatRequest.builder()
            .preamble(preamble)
            .message(userPrompt)
            .build();
        
        // 4. Set up the HTTP headers.
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(cohereApiKey); // Use Bearer Authentication

        // 5. Create the full HTTP request entity.
        HttpEntity<CohereChatRequest> requestEntity = new HttpEntity<>(cohereRequest, headers);

        // 6. Make the POST request to Cohere's API.
        CohereChatResponse cohereResponse = restTemplate.postForObject(COHERE_API_URL, requestEntity, CohereChatResponse.class);

        // 7. Extract and return the answer.
        if (cohereResponse != null && cohereResponse.getText() != null) {
            return cohereResponse.getText();
        } else {
            throw new Exception("Failed to get a valid response from AI service.");
        }
    }
}