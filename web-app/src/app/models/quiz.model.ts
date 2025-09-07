export interface Question {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
}

export interface Quiz {
  id: number;
  topic: string;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

export interface QuestionResult {
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  explanation?: string;
}

export interface QuizResult {
  id: number;
  quiz_id: number;
  user_answers: string[];
  score: number;
  total_questions: number;
  percentage: number;
  question_results?: QuestionResult[];
  created_at: string;
  updated_at: string;
}

export interface QuizState {
  currentQuiz: Quiz | null;
  quizResults: QuizResult[];
  availableQuizzes: Quiz[];
  loading: boolean;
  error: string | null;
}
