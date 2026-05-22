// package com.toeic.backend.entity;

// import jakarta.persistence.*;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "toeic_test")
// public class ToeicTest {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String title;
//     private String description;

//     private String status; // DRAFT | READY

//     private LocalDateTime createdAt = LocalDateTime.now();

//     // ===== getters setters =====

//     public Long getId() {
//         return id;
//     }

//     public String getTitle() {
//         return title;
//     }

//     public void setTitle(String title) {
//         this.title = title;
//     }

//     public String getDescription() {
//         return description;
//     }

//     public void setDescription(String description) {
//         this.description = description;
//     }

//     public String getStatus() {
//         return status;
//     }

//     public void setStatus(String status) {
//         this.status = status;
//     }

//     public LocalDateTime getCreatedAt() {
//         return createdAt;
//     }
// }

package com.toeic.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "toeic_test")
public class ToeicTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private String status; // DRAFT | READY

    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
private List<Part5> part5s;

    // =========================
    // 🔥 PART 6 GROUP (KHÔNG LƯU DB)
    // =========================
    @Transient
    private List<Map<String, Object>> part6Groups;

    // =========================
    // 🔥 PART 7 GROUP (KHÔNG LƯU DB)
    // =========================
    @Transient
    private List<?> part7Groups;

    // ===== getters setters =====

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // =========================
    // GETTERS / SETTERS EXTRA
    // =========================

    public List<Part5> getPart5s() {
    return part5s;
}

public void setPart5s(List<Part5> part5s) {
    this.part5s = part5s;
}

    public List<Map<String, Object>> getPart6Groups() {
        return part6Groups;
    }

    public void setPart6Groups(List<Map<String, Object>> part6Groups) {
        this.part6Groups = part6Groups;
    }

    public List<?> getPart7Groups() {
        return part7Groups;
    }

    public void setPart7Groups(List<?> part7Groups) {
        this.part7Groups = part7Groups;
    }
}