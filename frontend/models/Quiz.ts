import { Question } from "./Question";

export interface Quiz {
  quiz_id: string;
  title: string;
  description: string;
  created_at: Date;
  questions?: Question[];
}
