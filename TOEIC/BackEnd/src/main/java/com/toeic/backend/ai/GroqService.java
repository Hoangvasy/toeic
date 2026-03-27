package com.toeic.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${groq.api.key}")
    private String apiKey;

    public GroqService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.groq.com")
                .build();
    }

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

        Map<String, Object> body = Map.of(
                "model", "llama-3.1-8b-instant",
                "temperature", 0.1,   // classification nên để thấp
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        String rawResponse = webClient.post()
                .uri("/openai/v1/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

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