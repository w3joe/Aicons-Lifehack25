package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.dto.AIQueryRequestDTO;
import aicon.lifehack.central_learning.dto.AIQueryResponseDTO;
import aicon.lifehack.central_learning.service.AIService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/query")
    public ResponseEntity<?> getAIQueryResponse(@RequestBody AIQueryRequestDTO request) throws Exception {
        
        String answer = aiService.getAIResponse(request.getResource_id(), request.getPrompt());
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(new AIQueryResponseDTO(answer))); // 200 OK

    }
}