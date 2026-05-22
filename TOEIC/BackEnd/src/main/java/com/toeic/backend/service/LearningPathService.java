package com.toeic.backend.service;

import com.toeic.backend.entity.*;
import com.toeic.backend.repository.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import com.toeic.backend.repository.Part6Repo;
import com.toeic.backend.repository.Part7GroupRepo;
import com.toeic.backend.repository.Part7QuestionRepo;
import com.toeic.backend.repository.UserRepository;

@Service
public class LearningPathService {


    private final UserQuestionStateRepo stateRepo;
    private final UserSkillAbilityRepo abilityRepo;
    private final Part5Repo part5Repo;
    private final HttpSession session;
    private final Part6Repo part6Repo;
private final Part7GroupRepo part7GroupRepo;
private final Part7QuestionRepo part7QuestionRepo;
private final UserRepository userRepository;

   public LearningPathService(
        UserQuestionStateRepo stateRepo,
        UserSkillAbilityRepo abilityRepo,
        Part5Repo part5Repo,
        Part6Repo part6Repo,
        Part7GroupRepo part7GroupRepo,
        Part7QuestionRepo part7QuestionRepo,
        HttpSession session,
        UserRepository userRepository
) {
    this.stateRepo = stateRepo;
    this.abilityRepo = abilityRepo;
    this.part5Repo = part5Repo;

    this.part6Repo = part6Repo;
    this.part7GroupRepo = part7GroupRepo;
    this.part7QuestionRepo = part7QuestionRepo;

    this.session = session;
    this.userRepository = userRepository;
}

    // ================= USER =================
   private User getCurrentUser() {

    Long userId = (Long) session.getAttribute("userId");

    if (userId == null) {
        throw new RuntimeException("NOT LOGGED IN");
    }

    return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("USER NOT FOUND"));
}

    // ================= MAIN =================
    public Map<String, Object> generateTodayPlan() {

        User user = getCurrentUser();

       List<Map<String, Object>> weakSkills = getWeakSkills();
List<Map<String, Object>> review = getReviewQuestions();

// ✅ lấy id của review hôm nay
Set<Long> reviewIds = review.stream()
        .map(q -> (Long) q.get("id"))
        .collect(Collectors.toSet());

// ✅ learnedIds = tất cả đã làm
Set<Long> learnedIds = stateRepo.findByUserId(user.getId())
        .stream()
        .map(UserQuestionState::getQuestionId)
        .collect(Collectors.toSet());

// 🔥 CHẶN: không cho review lọt vào new
learnedIds.addAll(reviewIds);

        Set<Long> usedIds = new HashSet<>(reviewIds);

        List<Map<String, Object>> newQs = new ArrayList<>();

        newQs.addAll(generatePart5(user, learnedIds, usedIds));
        newQs.addAll(generatePart6());
        newQs.addAll(generatePart7());

        int estimatedTime = review.size() * 40 + newQs.size() * 60;

        Map<String, Object> res = new HashMap<>();
        res.put("review", review);
        res.put("new", newQs);
        res.put("weakSkills", weakSkills);
        res.put("estimatedTime", estimatedTime);

        return res;
    }

    // ================= PART 5 =================
  private List<Map<String, Object>> generatePart5(
        User user,
        Set<Long> learnedIds,
        Set<Long> usedIds
) {
    String label = getWeakestLabel(user);
    float ability = getAbility("part5_" + label);

    int total = (int) (8 + (1 - ability) * 6);

    int mediumCount = (int) (total * 0.6);
    int easyCount = (int) (total * 0.2);
    int hardCount = total - mediumCount - easyCount;

    // float target = 1 - ability;
float target = ability;
    List<Part5> result = new ArrayList<>();

    // 🎯 MEDIUM
    result.addAll(fetchWithExpand(
            label, target, 0.15f, mediumCount, learnedIds, usedIds
    ));

    // 🎯 EASY
    result.addAll(fetchWithExpand(
            label, target - 0.2f, 0.1f, easyCount, learnedIds, usedIds
    ));

    // 🎯 HARD
    result.addAll(fetchWithExpand(
            label, target + 0.2f, 0.1f, hardCount, learnedIds, usedIds
    ));

    // 🔥 fallback nếu thiếu
    if (result.size() < total) {
    List<Part5> extra = part5Repo.findRandomByLabel(label, total * 5);

    for (Part5 q : extra) {
        if (!usedIds.contains(q.getId())) {
            result.add(q);
            usedIds.add(q.getId());
            if (result.size() >= total) break;
        }
    }
}

    return result.stream()
            .map(this::mapToNewQuestion)
            .toList();
}

private List<Part5> fetchWithExpand(
        String label,
        float center,
        float baseRange,
        int limit,
        Set<Long> learnedIds,
        Set<Long> usedIds
) {
    List<Part5> result = new ArrayList<>();

    float[] expandSteps = {baseRange, baseRange + 0.15f, baseRange + 0.3f};

    for (float range : expandSteps) {

        float min = clamp(center - range);
        float max = clamp(center + range);

        List<Part5> qs = part5Repo.findByLabelAndDifficulty(label, min, max, limit * 5)
                .stream()
                .sorted(Comparator.comparing(q -> Math.abs(q.getDifficulty() - center)))
                .toList();

        // ✅ Phase 1: ưu tiên chưa làm
        for (Part5 q : qs) {
            if (!learnedIds.contains(q.getId()) && !usedIds.contains(q.getId())) {
                result.add(q);
                usedIds.add(q.getId());
                if (result.size() >= limit) return result;
            }
        }

        // ✅ Phase 2: cho phép lấy lại (repeat nhẹ)
        for (Part5 q : qs) {
            if (!usedIds.contains(q.getId())) {
                result.add(q);
                usedIds.add(q.getId());
                if (result.size() >= limit) return result;
            }
        }
    }

    return result;
}

    // ================= PART 6 =================
   private List<Map<String, Object>> generatePart6() {

    float ability = getAbility("part6");

    int passageCount = ability < 0.4f ? 3 : ability < 0.7f ? 2 : 1;

    List<Long> groupIds = part6Repo.findRandomGroupIds(passageCount);

    return groupIds.stream().map(id -> {

        List<Part6> qs = part6Repo.findByGroupId(id);

        if (qs.isEmpty()) return null;

        Part6 first = qs.get(0);

        Map<String, Object> block = new HashMap<>();
        block.put("type", "part6");
        block.put("groupId", id);
        block.put("passage", first.getPassage());
        block.put("passageVn", first.getPassageVn());

        block.put("questions", qs.stream().map(q -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", q.getId());
            m.put("question", q.getQuestion());
            m.put("optionA", q.getOptionA());
            m.put("optionB", q.getOptionB());
            m.put("optionC", q.getOptionC());
            m.put("optionD", q.getOptionD());
            m.put("answer", q.getAnswer());
            return m;
        }).toList());

        return block;

    }).filter(Objects::nonNull).toList();
}

    // ================= PART 7 =================
  private List<Map<String, Object>> generatePart7() {

    float ability = getAbility("part7");

    // ================= GROUP COUNT =================
    int groupCount =
            ability < 0.4f ? 3 :
            ability < 0.7f ? 2 : 1;

    // ================= STRUCTURE TYPE =================
    String structure;

    if (ability < 0.35f) {
        structure = "single";
    } else if (ability < 0.7f) {
        structure = "double";
    } else {
        structure = "triple";
    }

    // ================= DIFFICULTY RANGE =================
    float min = clamp(ability - 0.15f);
    float max = clamp(ability + 0.15f);

    // ================= FETCH ADAPTIVE GROUPS =================
    List<Part7Group> groups =
            part7GroupRepo.findAdaptive(
                    structure,
                    min,
                    max,
                    groupCount
            );

    // ================= FALLBACK =================
    if (groups.isEmpty()) {
        groups = part7GroupRepo.findRandom(groupCount);
    }

    // ================= MAP RESULT =================
    return groups.stream().map(g -> {

        Map<String, Object> block = new HashMap<>();

        block.put("type", "part7");
        block.put("groupId", g.getId());
        block.put("header", g.getHeader());
        block.put("passage", g.getPassage());
        block.put("passageTranslation", g.getPassageTranslation());

        List<Part7Question> qs =
                part7QuestionRepo.findByGroupId(g.getId());

        block.put("questions", qs.stream().map(q -> {

            Map<String, Object> m = new HashMap<>();

            m.put("id", q.getId());
            m.put("questionNumber", q.getQuestionNumber());
            m.put("question", q.getQuestion());

            m.put("optionA", q.getOptionA());
            m.put("optionB", q.getOptionB());
            m.put("optionC", q.getOptionC());
            m.put("optionD", q.getOptionD());

            m.put("answer", q.getAnswer());

            return m;

        }).toList());

        return block;

    }).toList();
}
    // ================= ABILITY =================
    private float getAbility(String skill) {
    return abilityRepo
            .findByUserIdAndSkill(getCurrentUser().getId(), skill)
            .map(a -> a.getAbility() != null ? a.getAbility() : 0.5f)
            .orElse(0.5f);
}

    // ================= LABEL (FIXED N+1 + SAFE) =================
    private String getWeakestLabel(User user) {

    return abilityRepo.findByUserId(user.getId())
            .stream()
            .filter(a -> a.getSkill() != null && a.getSkill().startsWith("part5_"))
            .min(Comparator.comparing(a -> 
                    a.getAbility() != null ? a.getAbility() : 0.5f))
            .map(a -> a.getSkill().replace("part5_", ""))
            .orElse("word_form");
}

    // ✅ FIX ERROR HERE (THIS WAS MISSING)
    private double avgAccuracy(List<UserQuestionState> list) {
        return list.stream()
                .mapToDouble(s -> s.getTotalAttempts() == 0
                        ? 0
                        : (double) s.getCorrectCount() / s.getTotalAttempts()
                )
                .average()
                .orElse(0);
    }

    // ================= REVIEW =================
    public List<Map<String, Object>> getReviewQuestions() {

        User user = getCurrentUser();

        return stateRepo.findByUserId(user.getId())
                .stream()
                .filter(s -> s.getNextReview() != null &&
                        !s.getNextReview().isAfter(LocalDateTime.now()))
                .sorted((a, b) -> Double.compare(priority(b), priority(a)))
                .limit(15)
                .map(this::mapToReviewQuestion)
                .collect(Collectors.toList());
    }

    private double priority(UserQuestionState s) {

        double accuracy = s.getTotalAttempts() == 0 ? 0 :
                (double) s.getCorrectCount() / s.getTotalAttempts();

        long days = s.getLastSeen() == null ? 0 :
                Duration.between(s.getLastSeen(), LocalDateTime.now()).toDays();

        double forgetting = 1 - Math.exp(-days / 3.0);

        return (1 - accuracy) * 0.4
                + forgetting * 0.4
                + (1.0 / (s.getMasteryLevel() + 1)) * 0.2;
    }

    // ================= MAP =================
    private Map<String, Object> mapToReviewQuestion(UserQuestionState s) {
        return part5Repo.findById(s.getQuestionId())
                .map(q -> {
                    Map<String, Object> m = baseQuestionMap(q);
                    m.put("type", "review");
                    return m;
                })
                .orElse(new HashMap<>());
    }

    private Map<String, Object> mapToNewQuestion(Part5 q) {
        Map<String, Object> m = baseQuestionMap(q);
        m.put("type", "part5");
        return m;
    }

    private Map<String, Object> baseQuestionMap(Part5 q) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", q.getId());
        m.put("question", q.getQuestion());
        m.put("optionA", q.getOptionA());
        m.put("optionB", q.getOptionB());
        m.put("optionC", q.getOptionC());
        m.put("optionD", q.getOptionD());
        m.put("answer", q.getAnswer());
         m.put("label", q.getLabel());
        return m;
    }

    // ================= SKILLS =================
    public List<Map<String, Object>> getWeakSkills() {

        return abilityRepo.findByUserId(getCurrentUser().getId())
                .stream()
                .sorted((a, b) -> Double.compare(skillPriority(b), skillPriority(a)))
                .limit(3)
                .map(a -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("skill", a.getSkill());
                    m.put("ability", a.getAbility());
                    return m;
                })
                .collect(Collectors.toList());
    }

    private double skillPriority(UserSkillAbility s) {

        double forgetting = 0;

        if (s.getLastSeenAt() != null) {
            long days = Duration.between(s.getLastSeenAt(), LocalDateTime.now()).toDays();
            forgetting = 1 - Math.exp(-days / 5.0);
        }

        return (1 - s.getAbility()) * 0.6
                + forgetting * 0.3
                + (1.0 / (s.getStreak() + 1)) * 0.1;
    }

    private float clamp(float v) {
        return Math.max(0f, Math.min(1f, v));
    }
}
