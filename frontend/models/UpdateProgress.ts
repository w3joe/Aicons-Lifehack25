export interface UpdateProgress {
  user_id: string;
  lesson_id?:string;
  quiz_id?: string;
  proficiency_score: number;
  quiz_score: number;
}
