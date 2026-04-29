package com.toeic.backend.dto;

public class Part6TestDTO {

    private Long id;
    private String title;

    public Part6TestDTO(Long id, String title) {
        this.id = id;
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }
}