export interface Lesson {
  lesson_id: string;
  course_id: string;
  quiz_id?: string; // Optional
  title: string;
  lesson_number: number;
  time_taken: string;
  description: string;
}
