import { Lesson } from "./Lesson";

export interface Course {
  course_id: string;
  topic_id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  like_count?: number; // Default to 0 when used
  lessons?: Lesson[]; // Array of lessons
}
