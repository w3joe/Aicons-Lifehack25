import api from "../api/api";

export const getResourceByLessonId = async (lessonId: string) => {
  try {
    const response = await api.get(`/resources/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch lesson resources:", error);
    throw error;
  }
};
