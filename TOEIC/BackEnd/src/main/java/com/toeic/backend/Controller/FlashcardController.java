package com.toeic.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.toeic.backend.dto.FlashcardDTO;
import com.toeic.backend.dto.FlashcardQuizDTO;
import com.toeic.backend.dto.FlashcardSetDTO;
import com.toeic.backend.entity.FlashcardCard;
import com.toeic.backend.entity.FlashcardReview;
import com.toeic.backend.entity.FlashcardSet;
import com.toeic.backend.repository.FlashcardCardRepo;
import com.toeic.backend.repository.FlashcardReviewRepo;
import com.toeic.backend.repository.FlashcardSetRepo;
import com.toeic.backend.service.FlashcardService;

@RestController
@RequestMapping("/api/flashcard")
@CrossOrigin(origins = "http://localhost:5173")
public class FlashcardController {

    private final FlashcardSetRepo setRepo;
    private final FlashcardCardRepo cardRepo;
    private final FlashcardReviewRepo reviewRepo;
    private final FlashcardService service;

    public FlashcardController(
            FlashcardSetRepo setRepo,
            FlashcardCardRepo cardRepo,
            FlashcardReviewRepo reviewRepo,
            FlashcardService service) {

        this.setRepo = setRepo;
        this.cardRepo = cardRepo;
        this.reviewRepo = reviewRepo;
        this.service = service;
    }

    @GetMapping("/set")
    public List<FlashcardSetDTO> getSets() {
        return service.getSets(1L);
    }

    @PostMapping("/set")
    public FlashcardSet createSet(@RequestBody Map<String, String> req) {

        FlashcardSet set = new FlashcardSet();
        set.setUserId(1L);
        set.setTitle(req.get("title"));
        set.setDescription("");
        set.setCreatedAt(LocalDateTime.now());

        return setRepo.save(set);
    }

    @GetMapping("/due")
    public List<FlashcardDTO> getDueCards(@RequestParam Long setId) {
        return service.getDueCards(1L, setId);
    }

    @PostMapping("/review-srs")
    public FlashcardReview reviewSRS(@RequestBody Map<String, Object> req) {

        Long reviewId = ((Number) req.get("reviewId")).longValue();
        Integer rating = ((Number) req.get("rating")).intValue();

        return service.reviewSRS(reviewId, rating); // ✅ FIX
    }

    @PostMapping("/review-simple")
    public FlashcardReview reviewSimple(@RequestBody Map<String, Object> req) {

        Long reviewId = ((Number) req.get("reviewId")).longValue();
        Integer rating = ((Number) req.get("rating")).intValue();

        return service.reviewSimple(reviewId, rating); // ✅ FIX
    }

    @GetMapping("/review-all")
    public List<FlashcardDTO> getAllCards(@RequestParam Long setId) {
        Long userId = 1L;
        return service.getAllCards(userId, setId); // ✅ FIX
    }

    @PostMapping("/add")
    public FlashcardCard addFlashcard(@RequestBody Map<String, Object> req) {

        Long setId = ((Number) req.get("setId")).longValue();

        FlashcardCard card = new FlashcardCard();
        card.setSetId(setId);
        card.setWord((String) req.get("word"));
        card.setMeaningVi((String) req.get("meaningVi"));
        card.setExample((String) req.get("example"));
        card.setIpa((String) req.get("ipa"));

        FlashcardCard saved = cardRepo.save(card);

        FlashcardReview review = new FlashcardReview();
        review.setUserId(1L);
        review.setCardId(saved.getId());
        review.setNextReview(LocalDateTime.now());

        reviewRepo.save(review);

        return saved;
    }

    @GetMapping("/quiz")
    public List<FlashcardQuizDTO> getQuiz(@RequestParam Long setId) {
        return service.getQuiz(1L, setId);
    }

    @PostMapping("/progress/review")
    public void progressReview(@RequestBody Map<String, Object> req) {

        Long reviewId = ((Number) req.get("reviewId")).longValue();

        service.updateReview(reviewId);
    }

    @PostMapping("/progress/quiz")
    public void progressQuiz(@RequestBody Map<String, Object> req) {

        Long reviewId = ((Number) req.get("reviewId")).longValue();

        boolean correct = Boolean.parseBoolean(req.get("correct").toString());

        service.updateQuiz(reviewId, correct);
    }

    @PostMapping("/progress/match")
    public void progressMatch(@RequestBody Map<String, Object> req) {

        Long reviewId = ((Number) req.get("reviewId")).longValue();

        service.updateMatch(reviewId);
    }
}