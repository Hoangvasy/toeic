package com.toeic.backend.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.toeic.backend.ai.GroqService;
import com.toeic.backend.dto.VocabularyDTO;

@Service
public class VocabularyService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final GroqService groqService;

    public VocabularyService(GroqService groqService) {
        this.groqService = groqService;
    }

    public VocabularyDTO getWordDetail(String word) {

        // kiểm tra input
        if (word == null || word.isBlank())
            return null;

        String originalWord = word;

        // lấy dữ liệu từ api
        Map<String, Object> data = getWordData(word);

        // fallback lemma nếu không tìm thấy
        if (data == null) {
            try {
                String lemma = groqService.getLemma(originalWord);

                if (lemma != null && !lemma.equals(word)) {
                    data = getWordData(lemma);
                    word = lemma;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // nếu vẫn không có thì dùng ai
        if (data == null) {
            return generateFromAI(originalWord);
        }

        String ipa = (String) data.getOrDefault("phonetic", "");

        List<Map<String, Object>> meanings = (List<Map<String, Object>>) data.get("meanings");

        // nếu không có meanings thì fallback ai
        if (meanings == null || meanings.isEmpty()) {
            return generateFromAI(word);
        }

        // flatten definitions + pos
        List<Map<String, Object>> allDefinitions = new ArrayList<>();

        for (Map<String, Object> m : meanings) {

            String pos = (String) m.get("partOfSpeech");
            List<Map<String, Object>> defs = (List<Map<String, Object>>) m.get("definitions");

            if (defs == null)
                continue;

            for (Map<String, Object> d : defs) {

                String def = (String) d.get("definition");

                if (def == null || def.isBlank())
                    continue;

                Map<String, Object> newDef = new HashMap<>(d);
                newDef.put("pos", pos);

                allDefinitions.add(newDef);
            }
        }

        // nếu không có definition hợp lệ
        if (allDefinitions.isEmpty()) {
            return generateFromAI(word);
        }

        // collect danh sách nghĩa
        List<String> defTexts = new ArrayList<>();
        for (Map<String, Object> d : allDefinitions) {
            defTexts.add((String) d.get("definition"));
        }

        // ai chọn nghĩa tốt nhất
        String meaningEn;
        try {
            meaningEn = groqService.pickBestDefinition(word, defTexts);
        } catch (Exception e) {
            meaningEn = defTexts.isEmpty() ? "" : defTexts.get(0);
        }

        // đảm bảo không rỗng
        if (meaningEn == null || meaningEn.isBlank()) {
            meaningEn = defTexts.isEmpty() ? "No definition available" : defTexts.get(0);
        }

        // match definition phù hợp nhất
        Map<String, Object> selectedDef = null;

        for (Map<String, Object> d : allDefinitions) {

            String def = (String) d.get("definition");

            if (def != null &&
                    (def.equalsIgnoreCase(meaningEn)
                            || def.toLowerCase().contains(meaningEn.toLowerCase())
                            || meaningEn.toLowerCase().contains(def.toLowerCase()))) {

                selectedDef = d;
                break;
            }
        }

        // fallback nếu không match
        if (selectedDef == null) {
            selectedDef = allDefinitions.get(0);
        }

        // lấy pos từ definition
        String partOfSpeech = (String) selectedDef.getOrDefault("pos", "");

        // fallback pos bằng ai
        if (partOfSpeech == null || partOfSpeech.isBlank()) {
            try {
                Map<String, Object> aiData = groqService.generateVocabulary(word);
                partOfSpeech = (String) aiData.getOrDefault("partOfSpeech", "");
            } catch (Exception e) {
                partOfSpeech = "";
            }
        }

        // lấy example đúng nghĩa
        String example = (String) selectedDef.getOrDefault("example", "");

        // lấy synonyms
        List<String> synonyms = new ArrayList<>();

        try {
            synonyms = groqService.generateToeicSynonyms(word, partOfSpeech);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (synonyms == null) {
            synonyms = new ArrayList<>();
        }

        // fallback ai nếu thiếu dữ liệu
        if ((example == null || example.isBlank())
                || synonyms.isEmpty()
                || (partOfSpeech == null || partOfSpeech.isBlank())) {

            try {
                Map<String, Object> aiData = groqService.generateVocabulary(word);

                if (example == null || example.isBlank()) {
                    example = (String) aiData.getOrDefault("example", "");
                }

                Object syn = aiData.get("synonyms");
                if (synonyms.isEmpty() && syn instanceof List) {
                    synonyms = (List<String>) syn;
                }

                if (partOfSpeech == null || partOfSpeech.isBlank()) {
                    partOfSpeech = (String) aiData.getOrDefault("partOfSpeech", "");
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // dịch sang tiếng việt
        String meaningVi;

        try {
            meaningVi = groqService.generateVietnameseMeaning(word, meaningEn);
        } catch (Exception e) {
            meaningVi = translate(meaningEn);
        }

        String audio = "https://dict.youdao.com/dictvoice?audio=" + word;

        return new VocabularyDTO(
                word,
                ipa,
                partOfSpeech,
                meaningEn,
                meaningVi,
                example,
                synonyms,
                audio);
    }

    // fallback ai khi không có dữ liệu
    private VocabularyDTO generateFromAI(String word) {

        try {
            Map<String, Object> aiData = groqService.generateVocabulary(word);

            String partOfSpeech = (String) aiData.getOrDefault("partOfSpeech", "");
            String example = (String) aiData.getOrDefault("example", "");
            List<String> synonyms = (List<String>) aiData.getOrDefault("synonyms", new ArrayList<>());

            String meaningVi = groqService.generateVietnameseMeaning(word, word);

            return new VocabularyDTO(
                    word,
                    "",
                    partOfSpeech,
                    "",
                    meaningVi,
                    example,
                    synonyms,
                    "https://dict.youdao.com/dictvoice?audio=" + word);

        } catch (Exception e) {
            return new VocabularyDTO(
                    word,
                    "",
                    "",
                    "",
                    "",
                    "",
                    new ArrayList<>(),
                    "");
        }
    }

    // gọi api dictionary
    private Map<String, Object> getWordData(String word) {
        try {
            Object[] response = restTemplate.getForObject(
                    "https://api.dictionaryapi.dev/api/v2/entries/en/" + word,
                    Object[].class);

            if (response == null || response.length == 0)
                return null;

            return (Map<String, Object>) response[0];

        } catch (Exception e) {
            return null;
        }
    }

    // dịch bằng api fallback
    private String translate(String text) {
        try {
            String encoded = URLEncoder.encode(text, StandardCharsets.UTF_8);

            String url = "https://api.mymemory.translated.net/get?q="
                    + encoded + "&langpair=en|vi";

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null)
                return "";

            Map<String, Object> data = (Map<String, Object>) response.get("responseData");

            if (data == null)
                return "";

            String result = (String) data.get("translatedText");

            return result != null ? result : "";

        } catch (Exception e) {
            return "";
        }
    }
}