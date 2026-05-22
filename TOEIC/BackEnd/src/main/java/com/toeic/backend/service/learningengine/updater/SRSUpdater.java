// package com.toeic.backend.service.learningengine;

// import com.toeic.backend.entity.AttemptDetail;
// import com.toeic.backend.entity.User;
// import com.toeic.backend.entity.UserQuestionState;
// import com.toeic.backend.repository.UserQuestionStateRepo;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// @Service
// public class SRSUpdater {

//     private final UserQuestionStateRepo stateRepo;

//     public SRSUpdater(UserQuestionStateRepo stateRepo) {
//         this.stateRepo = stateRepo;
//     }

//     public void update(User user, List<AttemptDetail> details) {

//         Long userId = user.getId();

//         // ===== GROUP BY QUESTION (IMPORTANT FIX) =====
//         Map<Long, List<AttemptDetail>> byQuestion =
//                 details.stream().collect(Collectors.groupingBy(AttemptDetail::getQuestionId));

//         for (var entry : byQuestion.entrySet()) {

//             Long qid = entry.getKey();
//             List<AttemptDetail> list = entry.getValue();

//             long total = list.size();
//             if (total == 0) continue;

//             long correct = list.stream()
//                     .filter(AttemptDetail::getIsCorrect)
//                     .count();

//             double acc = (double) correct / total;
//             boolean good = acc >= 0.7;

//             // ===== GET OR CREATE =====
//             UserQuestionState state = stateRepo
//                     .findByUserIdAndQuestionId(userId, qid)
//                     .orElseGet(() -> {
//                         UserQuestionState s = new UserQuestionState();
//                         s.setUser(user); // ✅ fix JPA
//                         s.setQuestionId(qid);
//                         s.setTotalAttempts(0);
//                         s.setCorrectCount(0);
//                         s.setWrongCount(0);
//                         s.setStreak(0);
//                         s.setMasteryLevel(0);
//                         s.setEaseFactor(2.5f);
//                         s.setReviewInterval(1);
//                         return s;
//                     });

//             // ===== BASIC STATS =====
//             state.setTotalAttempts(state.getTotalAttempts() + (int) total);
//             state.setCorrectCount(state.getCorrectCount() + (int) correct);
//             state.setWrongCount(state.getWrongCount() + (int) (total - correct));

//             state.setLastResult(good);

//             // ===== STREAK =====
//             int streak = state.getStreak() != null ? state.getStreak() : 0;
//             state.setStreak(good ? streak + 1 : 0);

//             // ===== MASTERY =====
//             int mastery = state.getMasteryLevel();
//             mastery = good ? mastery + 1 : Math.max(0, mastery - 1);
//             state.setMasteryLevel(mastery);

//             // ===== SRS (SM-2 SIMPLIFIED BUT STABLE) =====
//             float ease = state.getEaseFactor();
//             int interval = state.getReviewInterval();

//             if (good) {
//                 ease = Math.min(3.0f, ease + 0.05f); // cap
//                 interval = (int) Math.round(interval * ease);
//             } else {
//                 ease = Math.max(1.3f, ease - 0.15f);
//                 interval = 1;
//             }

//             state.setEaseFactor(ease);
//             state.setReviewInterval(interval);

//             // ===== TIME =====
//             LocalDateTime now = LocalDateTime.now();
//             state.setLastSeen(now);
//             state.setNextReview(now.plusDays(interval));

//             stateRepo.save(state);
//         }
//     }
// }