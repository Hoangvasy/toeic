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

        public Map<String, Object> generateVocabulary(String word) throws Exception {

                // prompt chuyên cho toeic (business context)
                String prompt = """
                                You are a TOEIC vocabulary expert.

                                Generate vocabulary information suitable for TOEIC exam context.
                                Focus on business, office communication, emails, meetings, reports.

                                Return JSON only in this format:

                                {
                                  "partOfSpeech": "noun/verb/adjective/adverb",
                                  "example": "A realistic TOEIC-style sentence",
                                  "synonyms": ["...", "...", "..."],
                                  "collocations": ["...", "..."]
                                }

                                Rules:
                                - Example MUST be business-related (office, company, employee, manager, report, email...)
                                - Sentence should be natural like a TOEIC question
                                - Synonyms must be common TOEIC vocabulary
                                - Collocations should be practical (e.g., 'attach a file', 'submit a report')
                                - Keep everything concise and realistic

                                Word:
                                """
                                + word;

                Map<String, Object> body = Map.of(
                                "model", "llama-3.1-8b-instant",
                                "temperature", 0.2,
                                "messages", List.of(
                                                Map.of("role", "user", "content", prompt)));

                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(apiKey);
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                ResponseEntity<String> response = restTemplate.exchange(
                                "https://api.groq.com/openai/v1/chat/completions",
                                HttpMethod.POST,
                                request,
                                String.class);

                JsonNode root = objectMapper.readTree(response.getBody());

                String content = root.path("choices")
                                .get(0)
                                .path("message")
                                .path("content")
                                .asText()
                                .trim();

                return objectMapper.readValue(content, Map.class);
        }

        public String generateVietnameseMeaning(String word, String meaningEn) throws Exception {

                // prompt dịch theo ngữ cảnh toeic
                String prompt = """
                                Bạn là từ điển TOEIC Anh - Việt.

                                Hãy dịch nghĩa NGẮN GỌN, đúng ngữ cảnh công việc, văn phòng.

                                Không giải thích dài dòng.
                                Không viết nhiều nghĩa.
                                Chỉ trả về nghĩa chính.

                                Ví dụ:
                                attach -> đính kèm (file, tài liệu)
                                report -> báo cáo (công việc)
                                schedule -> lịch trình (công việc)

                                Word: """ + word + """

                                English definition:
                                """ + meaningEn + """

                                Trả về một cụm từ tiếng Việt ngắn gọn.
                                """;

                Map<String, Object> body = Map.of(
                                "model", "llama-3.1-8b-instant",
                                "temperature", 0.2,
                                "messages", List.of(
                                                Map.of("role", "user", "content", prompt)));

                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(apiKey);
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                ResponseEntity<String> response = restTemplate.exchange(
                                "https://api.groq.com/openai/v1/chat/completions",
                                HttpMethod.POST,
                                request,
                                String.class);

                JsonNode root = objectMapper.readTree(response.getBody());

                return root.path("choices")
                                .get(0)
                                .path("message")
                                .path("content")
                                .asText()
                                .trim();
        }

        public String getLemma(String word) throws Exception {

                // prompt tối ưu cho toeic + ép output sạch
                String prompt = """
                                You are an English linguistics expert for TOEIC.

                                Convert the given word to its base form (lemma).

                                Rules:
                                - Return ONLY the base word
                                - No explanation
                                - No punctuation
                                - No quotes
                                - Lowercase only
                                - Must be a valid English dictionary word

                                Examples:
                                fluencies -> fluency
                                companies -> company
                                running -> run
                                transported -> transport
                                better -> good
                                children -> child

                                Word:
                                """ + word;

                Map<String, Object> body = Map.of(
                                "model", "llama-3.1-8b-instant",
                                "temperature", 0,
                                "messages", List.of(
                                                Map.of("role", "user", "content", prompt)));

                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(apiKey);
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                ResponseEntity<String> response = restTemplate.exchange(
                                "https://api.groq.com/openai/v1/chat/completions",
                                HttpMethod.POST,
                                request,
                                String.class);

                JsonNode root = objectMapper.readTree(response.getBody());

                String lemma = root.path("choices")
                                .get(0)
                                .path("message")
                                .path("content")
                                .asText()
                                .trim()
                                .toLowerCase();

                lemma = lemma.replaceAll("[^a-z]", "");

                return lemma;
        }

        public List<String> generateToeicSynonyms(String word, String pos) throws Exception {

                String prompt = """
                                You are a TOEIC vocabulary expert.

                                Generate exactly 3 synonyms.

                                Rules:
                                - Same meaning
                                - Same part of speech: """ + pos + """
                                - Business / office context
                                - Common TOEIC words only

                                Return JSON array only.

                                Example:
                                experience (noun)
                                ["expertise", "knowledge", "background"]

                                Word:
                                """ + word;

                Map<String, Object> body = Map.of(
                                "model", "llama-3.1-8b-instant",
                                "temperature", 0,
                                "messages", List.of(
                                                Map.of("role", "user", "content", prompt)));

                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(apiKey);
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                ResponseEntity<String> response = restTemplate.exchange(
                                "https://api.groq.com/openai/v1/chat/completions",
                                HttpMethod.POST,
                                request,
                                String.class);

                JsonNode root = objectMapper.readTree(response.getBody());

                String content = root.path("choices")
                                .get(0)
                                .path("message")
                                .path("content")
                                .asText();

                return objectMapper.readValue(content, List.class);
        }

        public String pickBestDefinition(String word, List<String> definitions) throws Exception {

                String prompt = """
                                You are a TOEIC vocabulary expert.

                                From the list of definitions below, choose the ONE most suitable meaning for TOEIC exam context.

                                Rules:
                                - Prefer common, practical meanings
                                - Prefer business, office, daily communication
                                - Avoid abstract meanings like "opportunity", "scope"
                                - Choose the meaning that learners are most likely to see in TOEIC

                                Return ONLY the chosen definition text.

                                Word:
                                """
                                + word + """

                                                Definitions:
                                                """ + definitions.toString();

                Map<String, Object> body = Map.of(
                                "model", "llama-3.1-8b-instant",
                                "temperature", 0,
                                "messages", List.of(
                                                Map.of("role", "user", "content", prompt)));

                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(apiKey);
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                ResponseEntity<String> response = restTemplate.exchange(
                                "https://api.groq.com/openai/v1/chat/completions",
                                HttpMethod.POST,
                                request,
                                String.class);

                JsonNode root = objectMapper.readTree(response.getBody());

                return root.path("choices")
                                .get(0)
                                .path("message")
                                .path("content")
                                .asText()
                                .trim();
        }

}