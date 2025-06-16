import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Quiz } from "@/models/Quiz";
import { getQuizWithQuestions } from "@/services/quizService";

const quizData = [
  {
    id: "1",
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    correct_answer: "Paris",
  },
  {
    id: "2",
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "22"],
    correct_answer: "4",
  },
  {
    id: "3",
    question: "Who wrote Hamlet?",
    options: ["Shakespeare", "Hemingway", "Tolkien", "Rowling"],
    correct_answer: "Shakespeare",
  },
];

const confidenceLevels = ["No Idea", "Maybe", "I Think So", "Definitely"];

const confidenceLevelsValue: { [key: string]: number } = {
  "No Idea": 0.0, // red
  Maybe: 0.33, // yellow
  "I Think So": 0.77, // light green
  Definitely: 1.0, // dark green
};

export default function QuizScreen() {
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getQuizWithQuestions("xcMz4tXgYqFQ5HwsO5bx");
        setQuiz(data.body);
      } catch (err) {
        console.error(err);
      }
    })();
  }, ["xcMz4tXgYqFQ5HwsO5bx"]);

  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [answerSelected, setAnswerSelected] = useState<boolean>(false);
  const [confidenceLevelsPerQ, setConfidenceLevelsPerQ] = useState<{
    [key: string]: string;
  }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const question = quiz?.questions?.at(currentQuestionIndex);

  const selectOption = (questionId: string, answer: string) => {
    if (submittedQuestions[questionId]) return;
    setAnswerSelected(true);
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const selectConfidence = (questionId: string, level: string) => {
    if (submittedQuestions[questionId]) return;
    setConfidenceLevelsPerQ((prev) => ({ ...prev, [questionId]: level }));
    submitCurrentQuestion();
    setAnswerSelected(false);
  };

  const submitCurrentQuestion = () => {
    if (!selectedAnswers[question?.question_id!]) {
      Alert.alert("Select an answer first.");
      return;
    }
    setSubmittedQuestions((prev) => ({
      ...prev,
      [question?.question_id!]: true,
    }));
  };

  const calculateFinalScore = () => {
    let score = 0;
    quiz?.questions!.forEach((q) => {
      if (selectedAnswers[q.question_id] === q.correct_answer) {
        score += 1 * confidenceLevelsValue[confidenceLevelsPerQ[q.question_id]];
      }
    });
    window.alert(score);
    router.back();
  };

  const isSubmitted = submittedQuestions[question?.question_id!];
  const selected = selectedAnswers[question?.question_id!];
  const isCorrect = selected === question?.correct_answer;

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question?.question_text}</Text>

        {question?.options.map((option) => {
          const isSelected = selected === option;
          const isAnswer = isSubmitted && option === question.correct_answer;
          return (
            <TouchableOpacity
              key={option}
              disabled={isSubmitted}
              style={[
                styles.option,
                isSelected && styles.selectedOption,
                isAnswer && styles.correctOption,
                isSubmitted &&
                  selected === option &&
                  selected !== question.correct_answer &&
                  styles.incorrectOption,
              ]}
              onPress={() => selectOption(question?.question_id, option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}

        {isSubmitted && (
          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "500" }}>
            {isCorrect
              ? "✅ Correct!"
              : `❌ Incorrect. Correct Answer: ${question?.correct_answer}
${question?.explanation}
                `}
          </Text>
        )}
      </View>

      <View style={styles.navContainer}>
        {!isSubmitted ? (
          <View style={styles.confidenceContainer}>
            {confidenceLevels.map((level) => {
              const isSelected =
                confidenceLevelsPerQ[question?.question_id!] === level;
              return (
                <TouchableOpacity
                  key={level}
                  disabled={isSubmitted}
                  onPress={() =>
                    selectConfidence(question?.question_id!, level)
                  }
                  style={[
                    styles.confidenceButton,
                    !answerSelected && styles.deselectConfidenceButton,
                  ]}
                >
                  <Text style={styles.confidenceButtonText}>{level}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : currentQuestionIndex < quizData.length - 1 ? (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentQuestionIndex((prev) => prev + 1)}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, styles.submitButton]}
            onPress={calculateFinalScore}
          >
            <Text style={styles.submitButtonText}>Finish Quiz</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    justifyContent: "center",
  },
  questionText: {
    fontSize: 18,
    marginBottom: 12,
  },
  option: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedOption: {
    backgroundColor: "#d0e8ff",
    borderColor: "#007aff",
  },
  correctOption: {
    backgroundColor: "#c8e6c9",
    borderColor: "#388e3c",
  },
  incorrectOption: {
    backgroundColor: "#ffcdd2",
    borderColor: "#d32f2f",
  },
  optionText: {
    fontSize: 16,
  },
  confidenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  confidenceButton: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#007aff",
    borderRadius: 6,
    marginRight: 6,
    marginTop: 6,
  },
  deselectConfidenceButton: {
    backgroundColor: "#d0e8ff",
  },
  confidenceButtonText: {
    fontSize: 16,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  navButton: {
    backgroundColor: "#007aff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#28a745",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
