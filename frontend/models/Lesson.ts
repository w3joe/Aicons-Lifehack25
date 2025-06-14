export interface Lesson {
  lesson_id: string;
  course_id: string;
  quiz_id?: string; // Optional
  title: string;
  time_taken: string;
}
