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
public class GroqService {

        private final RestTemplate restTemplate = new RestTemplate();
        private final ObjectMapper objectMapper = new ObjectMapper();

        @Value("${groq.api.key}")
        private String apiKey;

        public Map<String, String> analyzeQuestion(String questionBlock) throws Exception {

                String prompt = """
                                Bạn là chuyên gia TOEIC Part 5.

                                Chỉ được chọn label trong danh sách sau:
                                word_form
                                tense_voice
                                preposition
                                conjunction
                                pronoun
                                vocabulary_meaning
                                vocabulary_collocation
                                confusing_words

                                Phải trả về đúng JSON format sau:
                                {
                                  "label": "...",
                                  "answer": "A/B/C/D"
                                }

                                Không giải thích.
                                Không thêm chữ gì ngoài JSON.

                                Câu hỏi:
                                """ + questionBlock;

                // Body request gửi lên Groq
                Map<String, Object> body = Map.of(
                                "model", "llama-3.1-8b-instant",
                                "temperature", 0.1,
                                "messages", List.of(
                                                Map.of("role", "user", "content", prompt)));

                // Headers
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(apiKey);
                headers.setContentType(MediaType.APPLICATION_JSON);

                // Request entity
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                // Gọi API
                ResponseEntity<String> response = restTemplate.exchange(
                                "https://api.groq.com/openai/v1/chat/completions",
                                HttpMethod.POST,
                                request,
                                String.class);

                String rawResponse = response.getBody();

                // Parse JSON response
                JsonNode root = objectMapper.readTree(rawResponse);

                String content = root.path("choices")
                                .get(0)
                                .path("message")
                                .path("content")
                                .asText()
                                .trim();

                // Convert JSON string -> Map
                return objectMapper.readValue(content, Map.class);
        }
}