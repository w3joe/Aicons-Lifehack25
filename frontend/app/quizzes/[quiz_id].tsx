// QuizScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

const quizData = [
  {
    id: '1',
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Lisbon'],
    correctAnswer: 'Paris',
  },
  {
    id: '2',
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '22'],
    correctAnswer: '4',
  },
  {
    id: '3',
    question: 'Who wrote Hamlet?',
    options: ['Shakespeare', 'Hemingway', 'Tolkien', 'Rowling'],
    correctAnswer: 'Shakespeare',
  },
];

export default function QuizScreen() {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const selectOption = (questionId: string, answer: string) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let score = 0;
    quizData.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    Alert.alert('Quiz Submitted', `You scored ${score} out of ${quizData.length}`);
    setSubmitted(true);
  };

  const renderItem = ({ item }: { item: typeof quizData[0] }) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{item.question}</Text>
      {item.options.map(option => {
        const isSelected = selectedAnswers[item.id] === option;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.option, isSelected && styles.selectedOption]}
            onPress={() => selectOption(item.id, option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={quizData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <TouchableOpacity style={styles.submitButton} onPress={calculateScore} disabled={submitted}>
        <Text style={styles.submitButtonText}>
          {submitted ? 'Submitted' : 'Submit Quiz'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 12,
  },
  option: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedOption: {
    backgroundColor: '#d0e8ff',
    borderColor: '#007aff',
  },
  optionText: {
    fontSize: 16,
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007aff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
