# 📚 Kế Hoạch Triển Khai: Hệ Thống Luyện Tập Theo Part & Topics

## 1. Định Nghĩa Tính Năng

### Mục Tiêu
Xây dựng hệ thống luyện tập có cấu trúc theo từng PART (5, 6, 7) và trong mỗi PART chia thành các TOPICS (Grammar, Vocabulary, Comprehension, v.v.) để người dùng luyện tập hiệu quả hơn.

### Cấu Trúc Phân Cấp
```
TOEIC Practice System
│
├── Part 5 (Incomplete Sentences)
│   ├── Grammar
│   ├── Vocabulary
│   ├── Word Forms
│   └── Idioms & Expressions
│
├── Part 6 (Text Completion)
│   ├── Discourse Markers
│   ├── Vocabulary
│   ├── Grammar
│   └── Reading Comprehension
│
└── Part 7 (Reading Comprehension)
    ├── Single Passage Reading
    ├── Multiple Passage Reading
    ├── Email & Memos
    ├── Advertisements & Notices
    └── Charts & Graphs
```

---

## 2. Database Schema (Backend)

### Entity Models

#### PracticeTopic (Chủ đề luyện tập)
```java
@Entity
@Table(name = "practice_topics")
public class PracticeTopic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String topicName;        // "Grammar", "Vocabulary"
    
    @Column(length = 500)
    private String description;      // Mô tả chủ đề
    
    @Column(nullable = false)
    private Integer partNumber;      // 5, 6, 7
    
    @Column(nullable = false)
    private Integer displayOrder;    // Thứ tự hiển thị
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @OneToMany(mappedBy = "topic")
    private List<PracticeQuestion> questions;
}
```

#### PracticeQuestion (Câu hỏi luyện tập)
```java
@Entity
@Table(name = "practice_questions")
public class PracticeQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "topic_id")
    private PracticeTopic topic;     // Liên kết tới chủ đề
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;
    
    @Column(columnDefinition = "TEXT")
    private String context;          // Bối cảnh/đoạn văn
    
    @Column(nullable = false)
    private String optionA;
    
    @Column(nullable = false)
    private String optionB;
    
    @Column(nullable = false)
    private String optionC;
    
    @Column(nullable = false)
    private String optionD;
    
    @Column(nullable = false)
    private String correctAnswer;    // A, B, C, D
    
    @Column(columnDefinition = "TEXT")
    private String explanation;      // Giải thích chi tiết
    
    @Column(columnDefinition = "TEXT")
    private String relatedGrammar;  // Quy tắc ngữ pháp liên quan
    
    private Integer difficulty;      // 1-5 (dễ -> khó)
    
    @OneToMany(mappedBy = "question")
    private List<UserPracticeRecord> userRecords;
}
```

#### UserPracticeRecord (Lịch sử luyện tập)
```java
@Entity
@Table(name = "user_practice_records")
public class UserPracticeRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "question_id")
    private PracticeQuestion question;
    
    @ManyToOne
    @JoinColumn(name = "topic_id")
    private PracticeTopic topic;
    
    private String userAnswer;       // Câu trả lời của user
    private Boolean isCorrect;       // Đúng/Sai
    private Integer timeSpent;       // Thời gian (giây)
    private LocalDateTime practiceDate;
    private Integer attemptNumber;   // Lần thứ bao nhiêu
}
```

#### TopicProgress (Tiến độ theo chủ đề)
```java
@Entity
@Table(name = "topic_progress")
public class TopicProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "topic_id")
    private PracticeTopic topic;
    
    private Integer totalAttempts;   // Tổng số câu làm
    private Integer correctAnswers;  // Số câu đúng
    private Double accuracyRate;     // Tỉ lệ chính xác %
    private LocalDateTime lastPracticedAt;
    private Integer streak;          // Chuỗi ngày luyện tập
}
```

---

## 3. Backend REST API

### 3.1 Topics Management Endpoints

```
GET    /api/practice/topics                    # Lấy danh sách tất cả topics
GET    /api/practice/topics/{partNumber}       # Lấy topics theo Part (5/6/7)
GET    /api/practice/topics/{topicId}          # Chi tiết topic
POST   /api/practice/topics                    # Tạo topic (ADMIN)
PUT    /api/practice/topics/{topicId}          # Cập nhật topic (ADMIN)
DELETE /api/practice/topics/{topicId}          # Xóa topic (ADMIN)
```

**Response Example:**
```json
{
  "id": 1,
  "topicName": "Grammar",
  "description": "Exercises for grammar rules and sentence structures",
  "partNumber": 5,
  "displayOrder": 1,
  "questionCount": 45,
  "userProgress": {
    "totalAttempts": 20,
    "correctAnswers": 16,
    "accuracyRate": 80,
    "lastPracticedAt": "2026-04-03T10:30:00"
  }
}
```

### 3.2 Practice Questions Endpoints

```
GET    /api/practice/questions/{topicId}              # Lấy câu hỏi của topic
GET    /api/practice/questions/{topicId}?difficulty=2 # Filter theo độ khó
GET    /api/practice/questions/{questionId}           # Chi tiết câu
  
POST   /api/practice/questions/submit                 # Submit câu trả lời
       {
         "questionId": 1,
         "userAnswer": "B",
         "timeSpent": 45
       }

POST   /api/practice/questions                        # Tạo câu hỏi (ADMIN)
```

**Submit Response:**
```json
{
  "questionId": 1,
  "userAnswer": "B",
  "correctAnswer": "B",
  "isCorrect": true,
  "explanation": "...",
  "relatedGrammar": "...",
  "topicAccuracy": 85,
  "totalAttempts": 1
}
```

### 3.3 Progress & Statistics Endpoints

```
GET    /api/practice/progress                 # Tiến độ tổng quát
GET    /api/practice/progress/{partNumber}    # Tiến độ theo Part
GET    /api/practice/progress/topic/{topicId} # Tiến độ theo Topic
GET    /api/practice/stats                    # Thống kê học tập
GET    /api/practice/recommendations          # Gợi ý luyện tập
```

**Progress Response:**
```json
{
  "part5": {
    "topics": [
      {
        "topicId": 1,
        "topicName": "Grammar",
        "totalQuestions": 50,
        "completed": 20,
        "accuracy": 85,
        "streak": 3
      },
      {
        "topicId": 2,
        "topicName": "Vocabulary",
        "totalQuestions": 40,
        "completed": 15,
        "accuracy": 72,
        "streak": 1
      }
    ],
    "partAccuracy": 79
  }
}
```

---

## 4. Frontend Structure

### 4.1 New Pages & Components

```
src/pages/User/
├── Learning/
│   ├── Learning.jsx                          # Page chính
│   ├── Learning.css
│   ├── PartSelector.jsx                      # Chọn Part
│   └── TopicSelector.jsx                     # Chọn Topic
│
└── Practice/
    ├── PracticeMode.jsx                      # Trang luyện tập
    ├── PracticeMode.css
    ├── QuestionDisplay.jsx                   # Hiển thị câu hỏi
    ├── AnswerOptions.jsx                     # Options A, B, C, D
    ├── QuestionTimer.jsx                     # Timer đếm ngược
    ├── ProgressBar.jsx                       # Thanh tiến độ
    └── ResultCard.jsx                        # Kết quả câu trả lời

src/components/
├── PracticeStats/
│   ├── TopicCard.jsx                         # Card từng topic
│   ├── ProgressChart.jsx                     # Biểu đồ tiến độ
│   ├── WeeklyStats.jsx                       # Thống kê tuần
│   └── RecommendationPanel.jsx               # Panel gợi ý
```

### 4.2 Learning Home Page

```jsx
// /pages/User/Learning/Learning.jsx
- Hiển thị tất cả Parts (5, 6, 7)
- Mỗi Part có:
  - Danh sách Topics
  - Tiến độ (% hoàn thành, số câu)
  - Accuracy rate
  - Button "Start Practice"
```

### 4.3 Practice Mode Component

```jsx
// /pages/User/Practice/PracticeMode.jsx
- Tuyên bố: Part 5 > Grammar (20/50 câu)
- Câu hỏi hiện tại
- 4 lựa chọn (A, B, C, D)
- Timer (tùy chọn)
- Progress bar
- Nút: Skip, Submit, Hint
- Hiệu ứng: Animation khi đúng/sai
```

### 4.4 Results & Analytics

```jsx
// Components:
- TopicProgress Card: Hiển thị từng topic
- AccuracyTrend: Biểu đồ theo thời gian
- WeaknessList: Chủ đề cần cải thiện
- RecommendedTopics: Gợi ý luyện tập
- StreakCounter: Chuỗi ngày luyện tập
```

---

## 5. Implementation Roadmap

### Phase 1: Backend Foundation (Week 1)
- [ ] Create 3 new entities (PracticeTopic, PracticeQuestion, UserPracticeRecord)
- [ ] Create repositories for new entities
- [ ] Create services (PracticeService)
- [ ] Implement API endpoints for topics & questions
- [ ] Seed initial data (Topics for Part 5, 6, 7)

### Phase 2: User Interaction (Week 2)
- [ ] Implement submit answer endpoint
- [ ] Record user answers in database
- [ ] Calculate accuracy and statistics
- [ ] Implement progress tracking
- [ ] Create recommendation algorithm

### Phase 3: Frontend - Learning Hub (Week 3)
- [ ] Create Learning page with Parts & Topics
- [ ] Create TopicCard component
- [ ] Implement PartSelector & TopicSelector
- [ ] Display progress for each topic

### Phase 4: Frontend - Practice Mode (Week 4)
- [ ] Create PracticeMode main page
- [ ] Create QuestionDisplay component
- [ ] Implement answer submission
- [ ] Show results with animation
- [ ] Add timer functionality (optional)

### Phase 5: Analytics & Insights (Week 5)
- [ ] Create progress dashboard
- [ ] Implement accuracy charts
- [ ] Add recommendations system
- [ ] Create weekly/monthly statistics
- [ ] Implement streak counter

---

## 6. Data Flow Diagram

```
User selects Part 5
    ↓
Fetch all Topics for Part 5 (Grammar, Vocabulary, etc.)
    ↓
User selects Topic (e.g., Grammar)
    ↓
Fetch 50 questions for Grammar topic
    ↓
Display Questions one by one
    ↓
User answers question
    ↓
Submit answer to backend
    ↓
Backend:
  - Check if correct
  - Record UserPracticeRecord
  - Update TopicProgress (accuracy, attempts, streak)
  - Calculate recommendations
    ↓
Frontend shows result + explanation
    ↓
User continues or goes back to topic selection
```

---

## 7. API Specification (Detailed)

### Create Practice Session

**Request:**
```json
POST /api/practice/sessions
{
  "partNumber": 5,
  "topicId": 1,
  "sessionType": "timed|untimed",
  "questionCount": 20
}
```

**Response:**
```json
{
  "sessionId": "abc123",
  "part": 5,
  "topic": "Grammar",
  "totalQuestions": 20,
  "questions": [
    {
      "id": 1,
      "question": "The CEO _____ the new strategy yesterday.",
      "context": null,
      "options": {
        "A": "announce",
        "B": "announced",
        "C": "announces",
        "D": "announcing"
      },
      "difficulty": 2
    }
  ]
}
```

### Submit Answer

**Request:**
```json
POST /api/practice/answers
{
  "sessionId": "abc123",
  "questionId": 1,
  "userAnswer": "B",
  "timeSpent": 35
}
```

**Response:**
```json
{
  "questionId": 1,
  "correctAnswer": "B",
  "isCorrect": true,
  "explanation": "Past tense 'announced' is correct here because...",
  "relatedGrammar": "Past Tense Conjugation",
  "historyAction": "RECORDED",
  "currentSessionStats": {
    "correct": 1,
    "total": 1,
    "accuracy": 100
  }
}
```

---

## 8. Frontend Routes

```
/learning                      # Learning Hub (Part selector)
/learning/part/5              # Part 5 Topics
/learning/part/5/grammar      # Grammar Topic details
/practice/part/5/grammar      # Practice Mode for Grammar
/practice/part/5/grammar/{id} # Single question practice
/analytics/topics             # Topics statistics
/analytics/progress           # Overall progress
```

---

## 9. Sample Topics (Seeding Data)

### Part 5 Topics:
1. Subject-Verb Agreement
2. Verb Tenses (Present, Past, Future)
3. Word Forms (Adjectives, Adverbs)
4. Prepositions
5. Articles (A, An, The)
6. Pronouns & Possessives
7. Comparative & Superlatives
8. Vocabulary & Synonyms
9. Phrasal Verbs
10. Idioms & Expressions

### Part 6 Topics:
1. Discourse Markers (connectors)
2. Text Coherence
3. Word Choice
4. Grammar in Context
5. Reference & Pronouns
6. Business Writing Conventions

### Part 7 Topics:
1. Single Passage (Articles, Emails)
2. Multiple Passages
3. Ads & Notices
4. Forms & Memos
5. Charts, Graphs & Tables
6. Inference Questions
7. Main Idea & Details
8. Vocabulary in Context

---

## 10. Key Features

### For Students
✅ Organize practice by Part and Topic
✅ Track progress per topic
✅ See accuracy rates
✅ Get detailed explanations
✅ Recommended topics based on weaknesses
✅ Maintain learning streak
✅ View learning statistics

### For Admins
✅ Create/Edit/Delete topics
✅ Add practice questions
✅ Set difficulty levels
✅ View student progress
✅ Analyze class performance

---

## 11. Technology Stack (No Changes Needed)

Sử dụng tech stack hiện tại:
- Backend: Spring Boot, JPA, MySQL
- Frontend: React, Tailwind CSS, Recharts
- API: REST with JSON

---

## 12. Next Steps

1. **Discuss with team:**
   - Xác nhận cấu trúc Topics
   - Thống nhất naming conventions
   - Quyết định UI/UX

2. **Start implementation:**
   - Backend entities & APIs first
   - Seed sample data
   - Build frontend pages

3. **Testing:**
   - Unit tests cho services
   - Integration tests cho APIs
   - Manual testing practice flow

---

**Tài liệu này cung cấp bản thiết kế chi tiết để triển khai hệ thống luyện tập toàn diện.**
