// package com.toeic.backend.service.learningengine;

// import com.toeic.backend.entity.AttemptDetail;
// import com.toeic.backend.entity.Part7Group;
// import com.toeic.backend.repository.Part5Repo;
// import com.toeic.backend.repository.Part6Repo;
// import com.toeic.backend.repository.Part7GroupRepo;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// @Service
// public class DifficultyUpdater {

//     private final Part5Repo part5Repo;
//     private final Part6Repo part6Repo;
//     private final Part7GroupRepo part7GroupRepo;

//     public DifficultyUpdater(
//             Part5Repo part5Repo,
//             Part6Repo part6Repo,
//             Part7GroupRepo part7GroupRepo
//     ) {
//         this.part5Repo = part5Repo;
//         this.part6Repo = part6Repo;
//         this.part7GroupRepo = part7GroupRepo;
//     }

//     public void update(List<AttemptDetail> details) {

//         Map<String, List<AttemptDetail>> byType =
//                 details.stream().collect(Collectors.groupingBy(AttemptDetail::getQuestionType));

//         for (var entry : byType.entrySet()) {

//             String type = entry.getKey();

//             Map<Long, List<AttemptDetail>> byQuestion =
//                     entry.getValue().stream()
//                             .collect(Collectors.groupingBy(AttemptDetail::getQuestionId));

//             for (var e : byQuestion.entrySet()) {

//                 long correct = e.getValue().stream()
//                         .filter(AttemptDetail::getIsCorrect)
//                         .count();

//                 long total = e.getValue().size();

//                 float diff = 1 - ((correct + 1f) / (total + 2f));

//                 Long id = e.getKey();

//                 if ("part5".equals(type)) {

//                     part5Repo.findById(id).ifPresent(q -> {
//                         q.setDifficulty(diff);
//                         part5Repo.save(q);
//                     });
//                 }

//                 else if ("part6".equals(type)) {

//                     part6Repo.findById(id).ifPresent(q -> {
//                         q.setPassageDifficulty(diff);
//                         part6Repo.save(q);
//                     });
//                 }

//                 else if ("part7".equals(type)) {

//                     List<Part7Group> groups = part7GroupRepo.findAll();

//                     for (Part7Group g : groups) {
//                         boolean exists = g.getQuestions()
//                                 .stream()
//                                 .anyMatch(q -> q.getId().equals(id));

//                         if (exists) {
//                             g.setPassageDifficulty(diff);
//                             part7GroupRepo.save(g);
//                             break;
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }