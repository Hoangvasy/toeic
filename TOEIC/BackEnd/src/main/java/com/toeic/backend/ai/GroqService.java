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
                                You are a TOEIC Part 5 expert.

Task:
- Choose the correct answer (A/B/C/D)
- Assign exactly 1 label

Labels:
word_form, tense_voice, subject_verb_agreement,
preposition, conjunction, pronoun, adverb,
vocabulary_collocation, vocabulary_meaning, confusing_words

Rules:
- word_form: same root word, different forms (noun/verb/adj/adv)
- tense_voice: tense or passive voice
- subject_verb_agreement: subject-verb agreement
- preposition: all options are prepositions
- conjunction: all options are conjunctions
- pronoun: pronouns only
- adverb: adverbs only
- vocabulary_collocation: fixed phrase/collocation
- vocabulary_meaning: meaning-based choice
- confusing_words: easily confused words

If unsure → vocabulary_meaning

Return ONLY JSON:
{
  "label": "",
  "answer": ""
}

Question:
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

        public Map<String, String> analyzeQuestionPart6(String questionBlock) throws Exception {

 String prompt = """
Bạn là chuyên gia TOEIC Part 6.

Nhiệm vụ:
Phân loại chính xác 1 label duy nhất cho câu hỏi.

Chỉ được chọn 1 trong các label sau:

grammar
word_form
vocabulary
cohesion_logic
sentence_insertion

====================

QUY TẮC PHÂN LOẠI:

1. grammar
- lỗi ngữ pháp trong câu
- thì, cấu trúc câu, mệnh đề, giới từ, liên từ
- liên quan toàn bộ cấu trúc câu

2. word_form
- chọn đúng dạng từ
- noun / verb / adjective / adverb
- ví dụ: impress / impressed / impressive / impression

3. vocabulary
- chọn từ/cụm từ theo nghĩa
- collocation (make decision, take action,...)
- nghĩa từ trong ngữ cảnh

4. cohesion_logic
- liên kết ý giữa các câu trong đoạn
- logic email / memo / letter
- từ nối: however, therefore, in addition, because...

👉 ĐÂY LÀ LABEL PHỔ BIẾN NHẤT TRONG PART 6

5. sentence_insertion
- CHỈ dùng khi đề bài yêu cầu:
  "choose the best sentence to insert into the paragraph"
- phải xác định vị trí câu (before/after sentence)

❌ KHÔNG dùng sentence_insertion cho:
- email fill blank
- đoạn văn điền câu bình thường
- có dấu ___ trong câu

====================

QUY TẮC ƯU TIÊN:

- Nếu không chắc → chọn cohesion_logic
- Nếu là dạng blank trong email/memo → ưu tiên cohesion_logic
- sentence_insertion chỉ dùng khi rõ ràng là INSERTION TASK
- KHÔNG được suy diễn "_" = sentence_insertion

====================

OUTPUT PHẢI LÀ JSON:

{
  "label": "...",
  "answer": "A/B/C/D"
}

Không giải thích.
Không thêm bất kỳ chữ nào khác.

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



         public Map<String, String> analyzeQuestionPart7(String questionBlock) throws Exception {

 String prompt = """
Bạn là chuyên gia TOEIC Part 7 (Reading Comprehension).

Nhiệm vụ:
Phân loại chính xác 1 label duy nhất cho câu hỏi dựa trên nội dung đoạn văn và câu hỏi.

Chỉ được chọn 1 trong các label sau:

detail
inference
reference
vocabulary
purpose

====================

QUY TẮC PHÂN LOẠI:

1. detail
- hỏi thông tin trực tiếp trong bài
- câu trả lời có thể tìm thấy rõ trong đoạn văn
- dạng: According to the passage / What is stated / What is mentioned

2. inference
- suy luận từ thông tin trong bài
- không có câu trả lời trực tiếp
- cần hiểu ý ngầm / kết luận

3. reference
- xác định đại từ hoặc từ thay thế
- ví dụ: it, they, this, that refers to what?

4. vocabulary
- đoán nghĩa từ theo ngữ cảnh
- synonym / meaning in context

5. purpose
- mục đích của email / thông báo / đoạn văn
- Why was this written?
- intention of author

====================

QUY TẮC QUAN TRỌNG:

- Nếu câu trả lời có thể tìm trực tiếp trong bài → ưu tiên detail
- Nếu phải suy luận → inference
- Nếu liên quan từ thay thế (it/they/this/that) → reference
- Nếu hỏi nghĩa từ → vocabulary
- Nếu hỏi mục đích văn bản → purpose

- KHÔNG được đoán ngoài nội dung
- KHÔNG thêm label khác

====================

OUTPUT PHẢI LÀ JSON:

{
  "label": "...",
  "answer": "A/B/C/D"
}

Không giải thích.
Không thêm bất kỳ chữ nào khác.

Câu hỏi + đoạn văn:
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