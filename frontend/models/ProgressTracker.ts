import { Difficulty } from "./Difficulty";

export interface ProgressTracker {
  progress_id?: string;
  user_id: string;
  course_id: string;
  current_lesson_number?: number;
  current_difficulty?: Difficulty;
}
