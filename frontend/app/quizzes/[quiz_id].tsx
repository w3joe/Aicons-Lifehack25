import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

const quizData = [
  {
    id: "1",
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    correctAnswer: "Paris",
  },
  {
    id: "2",
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "22"],
    correctAnswer: "4",
  },
  {
    id: "3",
    question: "Who wrote Hamlet?",
    options: ["Shakespeare", "Hemingway", "Tolkien", "Rowling"],
    correctAnswer: "Shakespeare",
  },
];

const confidenceLevels = ["No Idea", "Maybe", "I Think So", "Definitely"];

export default function QuizScreen() {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [confidenceLevelsPerQ, setConfidenceLevelsPerQ] = useState<{
    [key: string]: string;
  }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const question = quizData[currentQuestionIndex];

  const selectOption = (questionId: string, answer: string) => {
    if (submittedQuestions[questionId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const selectConfidence = (questionId: string, level: string) => {
    if (submittedQuestions[questionId]) return;
    setConfidenceLevelsPerQ((prev) => ({ ...prev, [questionId]: level }));
  };

  const submitCurrentQuestion = () => {
    if (!selectedAnswers[question.id]) {
      Alert.alert("Select an answer first.");
      return;
    }

    setSubmittedQuestions((prev) => ({ ...prev, [question.id]: true }));
  };

  const calculateFinalScore = () => {
    let score = 0;
    quizData.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    Alert.alert(
      "Quiz Completed",
      `You scored ${score} out of ${quizData.length}`
    );
    console.log("Confidence Levels:", confidenceLevelsPerQ);
  };

  const isSubmitted = submittedQuestions[question.id];
  const selected = selectedAnswers[question.id];
  const isCorrect = selected === question.correctAnswer;

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>

        {question.options.map((option) => {
          const isSelected = selected === option;
          const isAnswer = isSubmitted && option === question.correctAnswer;
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
                  selected !== question.correctAnswer &&
                  styles.incorrectOption,
              ]}
              onPress={() => selectOption(question.id, option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.confidenceContainer}>
          {confidenceLevels.map((level) => {
            const isSelected = confidenceLevelsPerQ[question.id] === level;
            return (
              <TouchableOpacity
                key={level}
                disabled={isSubmitted}
                onPress={() => selectConfidence(question.id, level)}
                style={[
                  styles.confidenceButton,
                  isSelected && styles.selectedConfidenceButton,
                ]}
              >
                <Text style={styles.confidenceButtonText}>{level}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isSubmitted && (
          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "500" }}>
            {isCorrect
              ? "✅ Correct!"
              : `❌ Incorrect. Correct Answer: ${question.correctAnswer}`}
          </Text>
        )}
      </View>

      <View style={styles.navContainer}>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentQuestionIndex((prev) => prev - 1)}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {!isSubmitted ? (
          <TouchableOpacity
            style={[styles.navButton, styles.submitButton]}
            onPress={submitCurrentQuestion}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
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
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginRight: 6,
    marginTop: 6,
  },
  selectedConfidenceButton: {
    backgroundColor: "#a5d6a7",
  },
  confidenceButtonText: {
    fontSize: 14,
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
