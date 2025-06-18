import { Difficulty } from "./Difficulty";

export interface StudentProgress {
  attempts?: number;
  completed_at?: Date;
  latest_proficiency_score?: number;
  proficiency_score?: number;
  progress_id?: string;
  quiz_score: number;
  user_id: string;
  lesson_id?: string;
  next_time_difficulty?: Difficulty;
}
