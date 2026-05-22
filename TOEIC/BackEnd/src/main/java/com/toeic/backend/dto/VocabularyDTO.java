package com.toeic.backend.dto;

import java.util.List;

public class VocabularyDTO {

    private String word;
    private String ipa;
    private String partOfSpeech;
    private String meaningEn;
    private String meaningVi;
    private String example;
    private List<String> synonyms;
    private String audio;

    public VocabularyDTO() {
    }

    public VocabularyDTO(
            String word,
            String ipa,
            String partOfSpeech,
            String meaningEn,
            String meaningVi,
            String example,
            List<String> synonyms,
            String audio) {

        this.word = word;
        this.ipa = ipa;
        this.partOfSpeech = partOfSpeech;
        this.meaningEn = meaningEn;
        this.meaningVi = meaningVi;
        this.example = example;
        this.synonyms = synonyms;
        this.audio = audio;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getIpa() {
        return ipa;
    }

    public void setIpa(String ipa) {
        this.ipa = ipa;
    }

    public String getMeaningEn() {
        return meaningEn;
    }

    public void setMeaningEn(String meaningEn) {
        this.meaningEn = meaningEn;
    }

    public String getMeaningVi() {
        return meaningVi;
    }

    public void setMeaningVi(String meaningVi) {
        this.meaningVi = meaningVi;
    }

    public String getExample() {
        return example;
    }

    public void setExample(String example) {
        this.example = example;
    }

    public List<String> getSynonyms() {
        return synonyms;
    }

    public void setSynonyms(List<String> synonyms) {
        this.synonyms = synonyms;
    }

    public String getAudio() {
        return audio;
    }

    public void setAudio(String audio) {
        this.audio = audio;
    }

    public String getPartOfSpeech() {
        return partOfSpeech;
    }

    public void setPartOfSpeech(String partOfSpeech) {
        this.partOfSpeech = partOfSpeech;
    }

}