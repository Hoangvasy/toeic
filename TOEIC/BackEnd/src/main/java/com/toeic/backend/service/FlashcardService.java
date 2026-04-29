package com.toeic.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.toeic.backend.dto.FlashcardDTO;
import com.toeic.backend.dto.FlashcardQuizDTO;
import com.toeic.backend.dto.FlashcardSetDTO;
import com.toeic.backend.entity.FlashcardCard;
import com.toeic.backend.entity.FlashcardProgress;
import com.toeic.backend.entity.FlashcardReview;
import com.toeic.backend.entity.FlashcardSet;
import com.toeic.backend.repository.FlashcardCardRepo;
import com.toeic.backend.repository.FlashcardProgressRepo;
import com.toeic.backend.repository.FlashcardReviewRepo;
import com.toeic.backend.repository.FlashcardSetRepo;

@Service
public class FlashcardService {

    // repository truy cập database
    private final FlashcardSetRepo setRepo;
    private final FlashcardCardRepo cardRepo;
    private final FlashcardReviewRepo reviewRepo;
    private final FlashcardProgressRepo progressRepo;

    // constructor inject dependency
    public FlashcardService(
            FlashcardSetRepo setRepo,
            FlashcardCardRepo cardRepo,
            FlashcardReviewRepo reviewRepo,
            FlashcardProgressRepo progressRepo) {

        this.setRepo = setRepo;
        this.cardRepo = cardRepo;
        this.reviewRepo = reviewRepo;
        this.progressRepo = progressRepo;
    }

    // lấy hoặc tạo progress cho user + card
    private FlashcardProgress getOrCreate(Long userId, Long cardId) {
        return progressRepo
                .findByUserIdAndCardId(userId, cardId)
                .orElseGet(() -> {
                    FlashcardProgress p = new FlashcardProgress();
                    p.setUserId(userId);
                    p.setCardId(cardId);
                    return p;
                });
    }

    // cập nhật trạng thái review (đã học)
    public void updateReview(Long reviewId) {
        FlashcardReview r = reviewRepo.findById(reviewId).orElseThrow();

        FlashcardProgress p = getOrCreate(r.getUserId(), r.getCardId());
        p.setLearnedReview(true);

        progressRepo.save(p);
    }

    // cập nhật trạng thái quiz (chỉ khi đúng)
    public void updateQuiz(Long reviewId, boolean correct) {
        if (!correct)
            return;

        FlashcardReview r = reviewRepo.findById(reviewId).orElseThrow();

        FlashcardProgress p = getOrCreate(r.getUserId(), r.getCardId());
        p.setLearnedQuiz(true);

        progressRepo.save(p);
    }

    // cập nhật trạng thái match
    public void updateMatch(Long reviewId) {
        FlashcardReview r = reviewRepo.findById(reviewId).orElseThrow();

        FlashcardProgress p = getOrCreate(r.getUserId(), r.getCardId());
        p.setLearnedMatch(true);

        progressRepo.save(p);
    }

    // lấy danh sách bộ flashcard + tiến độ
    public List<FlashcardSetDTO> getSets(Long userId) {
        List<FlashcardSet> sets = setRepo.findByUserId(userId);

        return sets.stream().map(set -> {

            int total = cardRepo.countBySetId(set.getId());

            int review = progressRepo.countReview(set.getId(), userId);
            int anki = progressRepo.countAnki(set.getId(), userId);
            int quiz = progressRepo.countQuiz(set.getId(), userId);
            int match = progressRepo.countMatch(set.getId(), userId);

            FlashcardSetDTO dto = new FlashcardSetDTO();

            dto.setId(set.getId());
            dto.setTitle(set.getTitle());
            dto.setDescription(set.getDescription());
            dto.setCardCount(total);

            // tính phần trăm tiến độ
            dto.setProgressReview(total == 0 ? 0 : review * 100 / total);
            dto.setProgressAnki(total == 0 ? 0 : anki * 100 / total);
            dto.setProgressQuiz(total == 0 ? 0 : quiz * 100 / total);
            dto.setProgressMatch(total == 0 ? 0 : match * 100 / total);

            // số lượng đã học
            dto.setLearnedReview(review);
            dto.setLearnedAnki(anki);
            dto.setLearnedQuiz(quiz);
            dto.setLearnedMatch(match);

            return dto;
        }).toList();
    }

    // chế độ anki (spaced repetition)
    public FlashcardReview reviewSRS(Long reviewId, int rating) {
        FlashcardReview r = reviewRepo.findById(reviewId).orElseThrow();

        LocalDateTime now = LocalDateTime.now();
        r.setLastReview(now);

        // rating = 0 (quên)
        if (rating == 0) {
            r.setRepetitions(0);
            r.setIntervalDays(1);
            r.setNextReview(now.plusMinutes(5));
        }

        // rating = 1 (khó)
        else if (rating == 1) {
            int rep = Math.max(1, r.getRepetitions());
            r.setRepetitions(rep);

            int interval = Math.max(1, r.getIntervalDays());
            r.setIntervalDays(interval);

            r.setNextReview(now.plusHours(6));
        }

        // rating = 2 (tốt)
        else if (rating == 2) {
            int rep = r.getRepetitions() + 1;
            r.setRepetitions(rep);

            int interval;

            if (rep == 1) {
                interval = 1;
            } else if (rep == 2) {
                interval = 3;
            } else {
                interval = (int) Math.round(r.getIntervalDays() * 2.2);
            }

            r.setIntervalDays(interval);
            r.setNextReview(now.plusDays(interval));
        }

        // rating = 3 (dễ)
        else if (rating == 3) {
            int rep = r.getRepetitions() + 1;
            r.setRepetitions(rep);

            int interval = Math.max(2, (int) Math.round(r.getIntervalDays() * 2));

            r.setIntervalDays(interval);
            r.setNextReview(now.plusDays(interval));
        }

        FlashcardReview saved = reviewRepo.save(r);

        // cập nhật tiến độ anki
        FlashcardProgress p = getOrCreate(r.getUserId(), r.getCardId());

        if (r.getRepetitions() >= 2 && r.getIntervalDays() >= 3) {
            if (!p.isLearnedAnki()) {
                p.setLearnedAnki(true);
                progressRepo.save(p);
            }
        }

        return saved;
    }

    // chế độ review đơn giản
    public FlashcardReview reviewSimple(Long reviewId, int rating) {
        FlashcardReview r = reviewRepo.findById(reviewId).orElseThrow();

        // cập nhật trạng thái lặp
        if (rating == 0) {
            r.setRepetitions(0);
        } else {
            if (r.getRepetitions() == 0) {
                r.setRepetitions(1);
            }
        }

        FlashcardReview saved = reviewRepo.save(r);

        // cập nhật tiến độ khi trả lời đúng
        if (rating > 0) {
            FlashcardProgress p = getOrCreate(r.getUserId(), r.getCardId());
            p.setLearnedReview(true);

            progressRepo.save(p);
        }

        return saved;
    }

    // lấy danh sách card đến hạn (due)
    public List<FlashcardDTO> getDueCards(Long userId, Long setId) {
        List<FlashcardReview> reviews = reviewRepo.findDueCards(userId, setId, LocalDateTime.now());

        return reviews.stream().map(r -> {
            FlashcardCard card = cardRepo.findById(r.getCardId()).orElseThrow();

            return new FlashcardDTO(
                    r.getId(),
                    card.getWord(),
                    card.getMeaningVi(),
                    card.getExample(),
                    card.getIpa());
        }).toList();
    }

    // lấy toàn bộ card trong set
    public List<FlashcardDTO> getAllCards(Long userId, Long setId) {
        List<FlashcardCard> cards = cardRepo.findBySetId(setId);

        return cards.stream().map(card -> {

            FlashcardReview review = reviewRepo
                    .findByUserIdAndCardId(userId, card.getId())
                    .orElse(null);

            Long reviewId = review != null ? review.getId() : null;

            return new FlashcardDTO(
                    reviewId,
                    card.getWord(),
                    card.getMeaningVi(),
                    card.getExample(),
                    card.getIpa());
        }).toList();
    }

    // tạo quiz từ flashcard
    public List<FlashcardQuizDTO> getQuiz(Long userId, Long setId) {
        List<FlashcardCard> cards = cardRepo.findBySetId(setId);

        return cards.stream().map(card -> {

            // lấy đáp án sai trong cùng set
            List<String> wrongAnswers = new ArrayList<>(cardRepo.getRandomWrongAnswers(setId, card.getId()));

            // nếu chưa đủ thì lấy global
            if (wrongAnswers.size() < 3) {
                List<String> global = cardRepo.getRandomGlobalWrongAnswers(card.getId());

                for (String g : global) {
                    if (!g.equals(card.getMeaningVi()) && !wrongAnswers.contains(g)) {
                        wrongAnswers.add(g);
                    }
                    if (wrongAnswers.size() == 3)
                        break;
                }
            }

            // fallback nếu db quá ít dữ liệu
            List<String> fallback = List.of("Không xác định", "Chưa biết", "Khác");

            int i = 0;
            while (wrongAnswers.size() < 3 && i < fallback.size()) {
                wrongAnswers.add(fallback.get(i++));
            }

            // trộn đáp án
            List<String> options = new ArrayList<>(wrongAnswers);
            options.add(card.getMeaningVi());

            Collections.shuffle(options);

            FlashcardReview review = reviewRepo
                    .findByUserIdAndCardId(userId, card.getId())
                    .orElse(null);

            Long reviewId = review != null ? review.getId() : null;

            return new FlashcardQuizDTO(
                    reviewId,
                    card.getWord(),
                    card.getMeaningVi(),
                    options);
        }).toList();
    }
}