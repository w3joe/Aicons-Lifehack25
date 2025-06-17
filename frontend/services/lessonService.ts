// src/services/courseService.ts
import api from "../api/api";

// export const getAllCourses = async () => {
//   const response = await api.get('/courses');
//   return response.data;
// };

export const getLessonById = async (lessonId: string) => {
  try {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch lesson details:", error);
    throw error;
  }
};

export const getCurrentLessonPackage = async (
  courseId: string,
  userId: string
) => {
  try {
    const response = await api.get(
      `/courses/${courseId}/current-lesson?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch lesson details:", error);
    throw error;
  }
};

export const getAttemptedLessonPackage = async (
  lessonId: string,
  userId: string
) => {
  try {
    const response = await api.get(
      `/student-progress/review-lesson?userId=${userId}&lessonId=${lessonId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch lesson details:", error);
    throw error;
  }
};
