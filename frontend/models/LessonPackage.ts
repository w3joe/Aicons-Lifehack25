import { Lesson } from "./Lesson";
import { Quiz } from "./Quiz";
import { Resource } from "./Resource";

export interface LessonPackage {
  lessonDetails: Lesson;
  resources?: Resource;
  quiz?: Quiz;
}
