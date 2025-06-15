package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.dto.QuizDetailsDTO;
import aicon.lifehack.central_learning.model.Course;
import aicon.lifehack.central_learning.model.Question;
import aicon.lifehack.central_learning.model.Quiz;
import aicon.lifehack.central_learning.model.User;

import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class QuizService {

    private final Firestore firestore;
    private final QuestionService questionService; 
    private static final String COLLECTION_NAME = "quizzes";

    public QuizService(Firestore firestore, QuestionService questionService) {
        this.firestore = firestore;
        this.questionService = questionService;
    }

    private CollectionReference getQuizzesCollection() {
        return firestore.collection(COLLECTION_NAME);
    }

    public Quiz createQuiz(Quiz quiz) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getQuizzesCollection().document();
        quiz.setQuiz_id(docRef.getId());
        quiz.setCreated_at(new Date()); 
        docRef.set(quiz).get();
        return quiz;
    }

    public Quiz getQuiz(String quizId) throws ExecutionException, InterruptedException {
    DocumentSnapshot document = getQuizzesCollection().document(quizId).get().get();
    return document.exists() ? document.toObject(Quiz.class) : null;
}

    public boolean deleteQuiz(String quizId) throws ExecutionException, InterruptedException {
        DocumentReference quizDocRef = getQuizzesCollection().document(quizId);
        if (!quizDocRef.get().get().exists()) {
            return false;
        }

        // Cascading Delete: Delete all questions for this quiz
        List<Question> questionsToDelete = questionService.getQuestionsByQuiz(quizId);
        WriteBatch batch = firestore.batch();
        for (Question question : questionsToDelete) {
            DocumentReference questionDocRef = firestore.collection("questions").document(question.getQuestion_id());
            batch.delete(questionDocRef);
        }
        batch.commit().get();

        // Delete the quiz itself
        quizDocRef.delete();
        return true;
    }

    // --- UPDATE ---
    public Quiz updateQuiz(String quizId, Quiz quiz) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getQuizzesCollection().document(quizId);
        DocumentSnapshot document = docRef.get().get();
        
        if (document.exists()) {
        Quiz existingQuiz = document.toObject(Quiz.class);

            if (quiz.getTitle() != null) {
                existingQuiz.setTitle(quiz.getTitle()); 
            }
            if (quiz.getDescription() != null) {
                existingQuiz.setDescription(quiz.getDescription());
            }
            
            

            docRef.set(existingQuiz).get();
            return existingQuiz;
        } else {
            return null;
        }
    }

    // --- GET QUIZ WITH ALL ITS QUESTIONS ---
    public QuizDetailsDTO getQuizWithQuestions(String quizId) throws ExecutionException, InterruptedException {
        Quiz quiz = getQuiz(quizId);
        if (quiz == null) {
            return null;
        }

        List<Question> questions = questionService.getQuestionsByQuiz(quizId);

        // Assemble the DTO
        return new QuizDetailsDTO(quiz, questions);
    }

    
}