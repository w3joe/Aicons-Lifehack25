package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.model.Question;
import aicon.lifehack.central_learning.model.Quiz;

import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class QuestionService {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "questions";

    public QuestionService(Firestore firestore) {
        this.firestore = firestore;
    }

    private CollectionReference getQuestionsCollection() {
        return firestore.collection(COLLECTION_NAME);
    }

    public Question createQuestion(Question question) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getQuestionsCollection().document();
        question.setQuestion_id(docRef.getId());
        docRef.set(question).get();
        return question;
    }

    public List<Question> getQuestionsByQuiz(String quizId) throws ExecutionException, InterruptedException {
        List<Question> questionList = new ArrayList<>();
        QuerySnapshot querySnapshot = getQuestionsCollection().whereEqualTo("quiz_id", quizId).get().get();
        querySnapshot.getDocuments().forEach(doc -> questionList.add(doc.toObject(Question.class)));
        return questionList;
    }
    
    public boolean deleteQuestion(String questionId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getQuestionsCollection().document(questionId);
        if (docRef.get().get().exists()) {
            docRef.delete();
            return true;
        }
        return false;
    }
    
    // Simple update for a question's text, options, and answer
    public Question updateQuestion(String questionId, Question question) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getQuestionsCollection().document(questionId);
        DocumentSnapshot document = docRef.get().get();
        if (document.exists()) {
            Question existingquestion = document.toObject(Question.class);

            if (question.getQuestion_text() != null) {
                existingquestion.setQuestion_text(question.getQuestion_id());
            }
            if (question.getOptions() != null) {
                existingquestion.setOptions(question.getOptions());
            }
            if (question.getCorrect_answer() != null) {
                existingquestion.setCorrect_answer(question.getCorrect_answer());
            }
            if(question.getExplanation() != null){
                existingquestion.setExplanation(question.getExplanation());
            }
            docRef.set(existingquestion).get();
            return existingquestion;
        }
        return null;
    }
}