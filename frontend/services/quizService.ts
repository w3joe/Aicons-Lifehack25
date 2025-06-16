// src/services/courseService.ts
import api from '../api/api';

export const getQuizWithQuestions = async (quizId: string) => {
  try {
    const response = await api.get(`/quizzes/${quizId}/details`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch quiz details:', error);
    throw error;
  }
};