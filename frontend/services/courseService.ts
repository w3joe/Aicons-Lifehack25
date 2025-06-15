// src/services/courseService.ts
import api from '../api/api';

// export const getAllCourses = async () => {
//   const response = await api.get('/courses');
//   return response.data;
// };

export const getCourseById = async (courseId: string) => {
  try {
    const response = await api.get(`/courses/${courseId}/details`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch course details:', error);
    throw error;
  }
};