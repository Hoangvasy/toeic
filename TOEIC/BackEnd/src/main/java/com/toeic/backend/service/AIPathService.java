
package com.toeic.backend.service;

import com.toeic.backend.entity.*;
import com.toeic.backend.repository.*;
import com.toeic.backend.service.learningengine.updater.AbilityUpdater;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import java.util.*;
import java.util.stream.Collectors;
//import com.toeic.backend.service.learningengine.DifficultyUpdateService;

@Service
public class AIPathService {

    private final Part5Repo part5Repo;
    private final Part6Repo part6Repo;
    private final Part7GroupRepo part7GroupRepo;
    private final UserAttemptRepo userAttemptRepo;
    private final AttemptDetailRepo attemptDetailRepo;
    private final UserQuestionStateRepo stateRepo;
    private final AbilityUpdater abilityUpdater;
    private final UserSkillAbilityRepo abilityRepo;
    private final UserRepository userRepository;
    private final DifficultyUpdateService difficultyUpdateService;

    public AIPathService(
            Part5Repo part5Repo,
            Part6Repo part6Repo,
            Part7GroupRepo part7GroupRepo,
            UserAttemptRepo userAttemptRepo,
            AttemptDetailRepo attemptDetailRepo,
            UserQuestionStateRepo stateRepo,
            AbilityUpdater abilityUpdater,
            UserSkillAbilityRepo abilityRepo,
            UserRepository userRepository,
            DifficultyUpdateService difficultyUpdateService) {
        this.part5Repo = part5Repo;
        this.part6Repo = part6Repo;
        this.part7GroupRepo = part7GroupRepo;
        this.userAttemptRepo = userAttemptRepo;
        this.attemptDetailRepo = attemptDetailRepo;
        this.stateRepo = stateRepo;
        this.abilityUpdater = abilityUpdater;
        this.abilityRepo = abilityRepo;
        this.userRepository = userRepository;

        this.difficultyUpdateService = difficultyUpdateService;
    }

    // ================= USER =================
    private User getCurrentUser() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attr == null) {
            throw new RuntimeException("NO REQUEST CONTEXT");
        }

        HttpSession session = attr.getRequest().getSession(false);

        if (session == null) {
            throw new RuntimeException("NOT LOGGED IN");
        }

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            throw new RuntimeException("NOT LOGGED IN");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("USER NOT FOUND IN DB"));
    }

    private HttpSession getSession() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attr == null)
            throw new RuntimeException("NO REQUEST CONTEXT");

        return attr.getRequest().getSession(true);
    }

    // ================= HELPER METHODS FOR SESSION =================
    @SuppressWarnings("unchecked")
    private Map<String, Integer> getOrInitMap(HttpSession session, String key) {
        Map<String, Integer> map = (Map<String, Integer>) session.getAttribute(key);
        if (map == null) {
            map = new HashMap<>();
            session.setAttribute(key, map);
        }
        return map;
    }

    @SuppressWarnings("unchecked")
    private Set<Long> getOrInitSet(HttpSession session, String key) {
        Set<Long> set = (Set<Long>) session.getAttribute(key);
        if (set == null) {
            set = new HashSet<>();
            session.setAttribute(key, set);
        }
        return set;
    }

    // private Map<String, Object> mapPart5(Part5 q) {
    // Map<String, Object> m = new HashMap<>();

    // m.put("id", q.getId());
    // m.put("type", "part5");

    // m.put("question", q.getQuestion());

    // m.put("optionA", q.getOptionA());
    // m.put("optionB", q.getOptionB());
    // m.put("optionC", q.getOptionC());
    // m.put("optionD", q.getOptionD());

    // m.put("answer", q.getAnswer());
    // m.put("explanation", q.getExplanation());

    // m.put("label", q.getLabel());

    // return m;
    // }

    // ================= ENTRY TEST =================
    public Map<String, Object> generateEntryTest() {
        HttpSession session = getSession();

        session.setAttribute("askedCount", new HashMap<String, Integer>());
        session.setAttribute("wrongCount", new HashMap<String, Integer>());
        session.setAttribute("seenQuestions", new HashSet<Long>());

        Map<String, Object> res = new HashMap<>();
        res.put("part5", buildPart5());
        res.put("part6Groups", buildPart6());
        res.put("part7Groups", buildPart7());

        return res;
    }

    // ================= PART 5 =================
    private List<Map<String, Object>> buildPart5() {
        int MAX_PART5 = 23;

        List<String> labels = List.of(
                "word_form", "tense_voice", "preposition", "conjunction",
                "pronoun", "vocabulary_meaning", "vocabulary_collocation", "confusing_words");

        List<Part5> all = new ArrayList<>();

        for (String label : labels) {

            if (all.size() >= MAX_PART5)
                break;

            int remaining = MAX_PART5 - all.size();
            int fetchSize = Math.min(2, remaining);

            List<Part5> qs = part5Repo.findRandomByLabel(label, fetchSize);

            // nếu thiếu thì bù
            if (qs.size() < fetchSize) {
                qs.addAll(part5Repo.findRandom(fetchSize - qs.size()));
            }

            all.addAll(qs);

            // cắt nếu vượt
            if (all.size() > MAX_PART5) {
                all = all.subList(0, MAX_PART5);
                break;
            }
        }

        Collections.shuffle(all);

        return all.stream()
                .limit(MAX_PART5)
                .map(this::mapPart5)
                .toList();
    }

    private Map<String, Object> mapPart5(Part5 q) {
        Map<String, Object> m = new HashMap<>();

        m.put("type", "part5");
        m.put("id", q.getId());
        m.put("question", q.getQuestion());

        m.put("optionA", q.getOptionA());
        m.put("optionB", q.getOptionB());
        m.put("optionC", q.getOptionC());
        m.put("optionD", q.getOptionD());

        m.put("answer", q.getAnswer());
        m.put("explanation", q.getExplanation());

        m.put("label", q.getLabel());
        m.put("difficulty", q.getDifficulty());

        return m;
    }

    // ================= PART 6 =================
    private List<Map<String, Object>> buildPart6() {
        List<Long> groupIds = part6Repo.findRandomGroupIds(1);
        if (groupIds == null || groupIds.isEmpty())
            return List.of();

        Map<Integer, List<Part6>> grouped = part6Repo.findByGroupIdIn(groupIds)
                .stream()
                .filter(q -> q.getGroupId() != null)
                .collect(Collectors.groupingBy(Part6::getGroupId));

        List<Map<String, Object>> result = new ArrayList<>();

        for (List<Part6> items : grouped.values()) {
            items.sort(Comparator.comparing(Part6::getQuestionNumber));

            Part6 first = items.getFirst();

            Map<String, Object> group = new HashMap<>();
            group.put("type", "part6");
            group.put("groupId", first.getGroupId());
            group.put("passage", first.getPassage());
            group.put("passageVn", first.getPassageVn());
            group.put("questions", items.stream().map(this::mapPart6).toList());

            result.add(group);
        }
        return result;
    }

    private Map<String, Object> mapPart6(Part6 q) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", q.getId());
        m.put("question", q.getQuestion());
        m.put("questionNumber", q.getQuestionNumber());
        m.put("optionA", q.getOptionA());
        m.put("optionB", q.getOptionB());
        m.put("optionC", q.getOptionC());
        m.put("optionD", q.getOptionD());
        m.put("answer", q.getAnswer());
        m.put("explanation", q.getExplanation());
        m.put("label", q.getLabel());
        m.put("type", "part6");
        return m;
    }

    // ================= PART 7 =================
    private List<Map<String, Object>> buildPart7() {
        return part7GroupRepo.findRandom(1)
                .stream()
                .map(g -> {
                    Map<String, Object> group = new HashMap<>();
                    group.put("type", "part7");
                    group.put("id", g.getId());
                    group.put("header", g.getHeader());
                    group.put("passage", g.getPassage());
                    group.put("passageTranslation", g.getPassageTranslation());

                    group.put("questions",
                            g.getQuestions().stream()
                                    .filter(q -> q != null && q.getId() != null)
                                    .sorted(Comparator.comparing(Part7Question::getQuestionNumber))
                                    .map(this::mapPart7)
                                    .toList());
                    return group;
                })
                .toList();
    }

    private Map<String, Object> mapPart7(Part7Question q) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", q.getId());
        m.put("question", q.getQuestion());
        m.put("questionNumber", q.getQuestionNumber());
        m.put("optionA", q.getOptionA());
        m.put("optionB", q.getOptionB());
        m.put("optionC", q.getOptionC());
        m.put("optionD", q.getOptionD());
        m.put("answer", q.getAnswer());
        m.put("explanation", q.getExplanation());
        m.put("label", q.getLabel());

        m.put("type", "part7");
        return m;
    }

    // ================= SAVE ATTEMPT =================
    @Transactional
public Long saveAttempt(Map<String, Object> body) {

    User user = getCurrentUser();

    UserAttempt attempt = new UserAttempt();
    attempt.setUser(user);
    attempt.setScore(((Number) body.get("score")).intValue());
    attempt.setTotalQuestions(((Number) body.get("total")).intValue());
    attempt.setCorrectAnswers(((Number) body.get("correct")).intValue());

    attempt = userAttemptRepo.save(attempt);

    List<AttemptDetail> details = buildAttemptDetails(body, attempt);

    attemptDetailRepo.saveAll(details);

    updateUserQuestionState(user.getId(), details);

    abilityUpdater.update(user.getId(), details);

    difficultyUpdateService.updateFromAttempt(
            user.getId(),
            details);

    return attempt.getId();
}

    // ================= DETAILS =================
    private List<AttemptDetail> buildAttemptDetails(Map<String, Object> body, UserAttempt attempt) {
        Map<String, String> answers = (Map<String, String>) body.get("answers");
        List<Map<String, Object>> questions = (List<Map<String, Object>>) body.get("questions");

        List<AttemptDetail> list = new ArrayList<>();

        for (int i = 0; i < questions.size(); i++) {
            Map<String, Object> q = questions.get(i);
            String type = (String) q.get("type");

            if ("part5".equals(type)) {
                list.add(createDetail(attempt, q, answers.get(String.valueOf(i))));
            } else {
                List<Map<String, Object>> subs = (List<Map<String, Object>>) q.get("questions");
                for (int j = 0; j < subs.size(); j++) {
                    list.add(createDetail(attempt, subs.get(j), answers.get(i + "-" + j)));
                }
            }
        }
        return list;
    }

    private AttemptDetail createDetail(UserAttempt attempt, Map<String, Object> q, String userAns) {
        AttemptDetail d = new AttemptDetail();
        d.setAttempt(attempt);
        d.setQuestionId(((Number) q.get("id")).longValue());
        d.setUserAnswer(userAns);
        d.setCorrectAnswer((String) q.get("answer"));
        d.setIsCorrect(userAns != null && userAns.equalsIgnoreCase((String) q.get("answer")));
        d.setQuestionType((String) q.get("type"));
        d.setLabel((String) q.get("label"));
        return d;
    }

    private void updateUserQuestionState(Long userId, List<AttemptDetail> details) {
        for (AttemptDetail d : details) {
            UserQuestionState state = stateRepo
                    .findByUserIdAndQuestionId(userId, d.getQuestionId())
                    .orElseGet(() -> {
                        UserQuestionState s = new UserQuestionState();
                        s.setUser(userRepository.findById(userId).orElse(null));
                        s.setQuestionId(d.getQuestionId());
                        return s;
                    });

            boolean correct = Boolean.TRUE.equals(d.getIsCorrect());

            state.setTotalAttempts((state.getTotalAttempts() == null ? 0 : state.getTotalAttempts()) + 1);
            state.setCorrectCount(correct
                    ? (state.getCorrectCount() == null ? 0 : state.getCorrectCount()) + 1
                    : state.getCorrectCount());
            state.setWrongCount(!correct
                    ? (state.getWrongCount() == null ? 0 : state.getWrongCount()) + 1
                    : state.getWrongCount());
            state.setStreak(correct
                    ? (state.getStreak() == null ? 0 : state.getStreak()) + 1
                    : 0);

            state.setLastResult(correct);
            stateRepo.save(state);
        }
    }

    // ================= REALTIME ANSWER (ĐÃ SỬA LỖI) =================
    public Map<String, Object> handleAnswer(Map<String, Object> body) {

        String label = (String) body.get("label");
        String correct = (String) body.get("correctAnswer");
        String userAns = (String) body.get("userAnswer");
        Long questionId = ((Number) body.get("questionId")).longValue();

        boolean isCorrect = userAns != null && userAns.equalsIgnoreCase(correct);

        HttpSession session = getSession();

        Map<String, Integer> asked = getOrInitMap(session, "askedCount");
        Map<String, Integer> wrong = getOrInitMap(session, "wrongCount");
        Set<Long> seen = getOrInitSet(session, "seenQuestions");

        // luôn đánh dấu đã thấy câu
        seen.add(questionId);

        // 👉 chỉ tăng asked khi FAIL (quan trọng)
        if (!isCorrect) {
            asked.put(label, asked.getOrDefault(label, 0) + 1);
            wrong.put(label, wrong.getOrDefault(label, 0) + 1);
        }

        session.setAttribute("askedCount", asked);
        session.setAttribute("wrongCount", wrong);
        session.setAttribute("seenQuestions", seen);

        Map<String, Object> res = new HashMap<>();
        res.put("correct", isCorrect);

        int wrongCount = wrong.getOrDefault(label, 0);
        int askedCount = asked.getOrDefault(label, 0);

        // ================= ADAPTIVE LOGIC =================

        // 👉 chỉ khi sai >= 2 lần mới bắt đầu "ép luyện"
        if (wrongCount >= 2 && askedCount < 4) {

            List<Part5> pool = part5Repo.findRandomByLabel(label, 10);

            // tránh lỗi lambda
            final Set<Long> seenFinal = new HashSet<>(seen);

            for (Part5 q : pool) {
                if (!seenFinal.contains(q.getId())) {
                    res.put("nextQuestion", mapPart5(q));
                    return res;
                }
            }

            // fallback nếu hết câu cùng label
            List<Part5> fallback = part5Repo.findRandom(5);
            for (Part5 q : fallback) {
                if (!seenFinal.contains(q.getId())) {
                    res.put("nextQuestion", mapPart5(q));
                    return res;
                }
            }
        }

        // 👉 không cần hỏi thêm
        res.put("nextQuestion", null);
        return res;
    }
}