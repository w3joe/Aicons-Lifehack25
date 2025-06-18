package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.dto.cohere.CohereChatRequest;
import aicon.lifehack.central_learning.dto.cohere.CohereChatResponse;
import aicon.lifehack.central_learning.model.Difficulty;
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

    @Value("${cohere.api.key}")
    private String cohereApiKey;

    private static final String COHERE_API_URL = "https://api.cohere.ai/v1/chat";

    public AIService(RestTemplate restTemplate, ResourceService resourceService) {
        this.restTemplate = restTemplate;
        this.resourceService = resourceService;
    }

    public String getAIResponse(String resourceId, String userPrompt) throws Exception {
        // 1. Fetch the resource to get its title and difficulty.
        Resource resource = resourceService.getResource(resourceId);
        if (resource == null) {
                throw new IllegalStateException("Resource not found with ID: " + resourceId);
            
        }

        // 2. --- THIS IS THE NEW LOGIC ---
        // Generate the dynamic preamble based on the resource's difficulty.
        String preamble = generatePreambleForDifficulty(resource.getDifficulty(), resource.getTitle());
        
        // 3. Build the request body for Cohere's API.
        CohereChatRequest cohereRequest = CohereChatRequest.builder()
            .preamble(preamble)
            .message(userPrompt)
            .build();
        
        // 4. Set up headers (unchanged).
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(cohereApiKey);

        // 5. Create the request entity (unchanged).
        HttpEntity<CohereChatRequest> requestEntity = new HttpEntity<>(cohereRequest, headers);

        // 6. Make the POST request (unchanged).
        CohereChatResponse cohereResponse = restTemplate.postForObject(COHERE_API_URL, requestEntity, CohereChatResponse.class);

        // 7. Extract and return the answer (unchanged).
        if (cohereResponse != null && cohereResponse.getText() != null) {
            return cohereResponse.getText();
        } else {
            throw new Exception("Failed to get a valid response from AI service.");
        }
    }

    /**
     * Private helper method to construct the correct AI persona and context
     * based on the difficulty level of the resource.
     * @param difficulty The difficulty level from the resource.
     * @param title The title of the resource to be included in the preamble.
     * @return A formatted preamble string.
     */
    private String generatePreambleForDifficulty(Difficulty difficulty, String title) {
        // Use a default preamble in case the difficulty is null or unexpected.
        String defaultPreamble = String.format("""
            You are an expert tutor.  answer the user's question.
            The lesson title is: '%s'.
            Only use the information implied by this title to answer the question. Do not repeat the lesson title in the answer. For example
            do not put "base on the lesson title "title". Just explain the answer and not repeat the lesson title in the answer.
            """, title);

        if (difficulty == null) {
            return defaultPreamble;
        }

        // Use a switch statement for clean, readable logic.
        // Java Text Blocks (""") make multiline strings easy to manage.
        switch (difficulty) {
            case REMEDIAL:
                return String.format("""
                    You are a kind and patient teacher explaining the concept of '%s' to someone with no prior experience. Do not repeat the lesson title in the answer. For example
            do not put "base on the lesson title "title". Just explain the answer and not repeat the lesson title in the answer.
                    
                    Explain slowly and simply. Use:
                    - Everyday analogies or metaphors
                    - Basic examples with minimal technical jargon
                    - Step-by-step breakdowns
                    - Visual descriptions where helpful
                    - A tone that builds confidence and encourages curiosity
                    """, title);
            
            case BEGINNER:
                return String.format("""
                    You are an engaging instructor teaching the concept of '%s' to someone with some experience and foundational knowledge. Do not repeat the lesson title in the answer. For example
            do not put "base on the lesson title "title". Just explain the answer and not repeat the lesson title in the answer.
                    
                    Your explanation should:
                    - Build on what they likely already know
                    - Introduce more technical depth, but remain clear
                    - Offer real-world examples or use cases
                    - Highlight common mistakes or misconceptions
                    - Invite questions to explore related subtopics
                    """, title);

            case INTERMEDIATE:
                return String.format("""
                    You are a domain expert mentoring a capable student in the concept of '%s'. Do not repeat the lesson title in the answer. For example
            do not put "base on the lesson title "title". Just explain the answer and not repeat the lesson title in the answer.
                    
                    Your response should:
                    - Dive into the theory and inner mechanics
                    - Compare different approaches or philosophies
                    - Use concise, precise language
                    - Introduce edge cases or lesser-known details
                    - Reference best practices and academic insights
                    """, title);

            case ADVANCED:
                return String.format("""
                    You are a fellow expert discussing the concept of '%s' with another specialist.Do not repeat the lesson title in the answer. For example
            do not put "base on the lesson title "title". Just explain the answer and not repeat the lesson title in the answer.
                    Your explanation should:
                    - Be concise, insightful, and assume fluency
                    - Focus on nuanced trade-offs or optimizations
                    - Reference standards, research, or tools where relevant
                    - Avoid over-explaining fundamentals
                    - Be framed more like a collaborative discussion than a lecture
                    """, title);

            default:
                return defaultPreamble;
        }
    }
}