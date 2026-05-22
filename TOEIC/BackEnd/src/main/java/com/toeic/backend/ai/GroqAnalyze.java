package com.toeic.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GroqAnalyze {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${groq.api.key}")
    private String apiKey;

    public Map<String, Object> analyzePerformance(String structuredData) throws Exception {

        String prompt = """
You are an expert TOEIC learning analyst in an adaptive learning system.

Your job is NOT to grade the test or recalculate scores.
You ONLY analyze structured error data and generate personalized learning feedback.

Rules:
- Be strict and based only on provided data
- Do not hallucinate questions or scores
- Focus on skill weaknesses and learning priorities
- Output must be JSON only

You must return:

{
  "summary": "...",
  "strengths": [],
  "weaknesses": [
    {
      "skill": "",
      "reason": "",
      "priority": 1
    }
  ],
  "learning_path": [
    {
      "skill": "",
      "recommendation": "",
      "url": ""
    }
  ],
  "message_to_student": ""
}

Input data:
""" + structuredData;

        Map<String, Object> body = Map.of(
                "model", "llama-3.1-8b-instant",
                "temperature", 0.2,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                "https://api.groq.com/openai/v1/chat/completions",
                HttpMethod.POST,
                request,
                String.class
        );

        String rawResponse = response.getBody();

        JsonNode root = objectMapper.readTree(rawResponse);

        String content = root.path("choices")
                .get(0)
                .path("message")
                .path("content")
                .asText()
                .trim();

        return objectMapper.readValue(content, Map.class);
    }
}