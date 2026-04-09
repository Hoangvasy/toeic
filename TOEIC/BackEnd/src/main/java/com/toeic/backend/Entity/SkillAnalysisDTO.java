package com.toeic.backend.entity;

public class SkillAnalysisDTO {

    private String topic;

    private double accuracy;

    public SkillAnalysisDTO(String topic, double accuracy) {
        this.topic = topic;
        this.accuracy = accuracy;
    }

    public String getTopic() {
        return topic;
    }

    public double getAccuracy() {
        return accuracy;
    }

}
