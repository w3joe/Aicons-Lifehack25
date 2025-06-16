
import api from '../api/api';

export const getTopicById = async (topicId: string) => {
  try {
    const response = await api.get(`/topic/${topicId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch topic details:', error);
    throw error;
  }
};