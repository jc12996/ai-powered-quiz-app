import { createAction, props } from '@ngrx/store';
import { Quiz, QuizResult } from '../models/quiz.model';

export const generateQuiz = createAction(
  '[Quiz] Generate Quiz',
  props<{ topic: string }>()
);

export const generateQuizSuccess = createAction(
  '[Quiz] Generate Quiz Success',
  props<{ quiz: Quiz }>()
);

export const generateQuizFailure = createAction(
  '[Quiz] Generate Quiz Failure',
  props<{ error: string }>()
);

export const loadQuiz = createAction(
  '[Quiz] Load Quiz',
  props<{ id: number }>()
);

export const loadQuizSuccess = createAction(
  '[Quiz] Load Quiz Success',
  props<{ quiz: Quiz }>()
);

export const loadQuizFailure = createAction(
  '[Quiz] Load Quiz Failure',
  props<{ error: string }>()
);

export const submitQuiz = createAction(
  '[Quiz] Submit Quiz',
  props<{ quizId: number; answers: string[] }>()
);

export const submitQuizSuccess = createAction(
  '[Quiz] Submit Quiz Success',
  props<{ result: QuizResult }>()
);

export const submitQuizFailure = createAction(
  '[Quiz] Submit Quiz Failure',
  props<{ error: string }>()
);

export const clearQuiz = createAction('[Quiz] Clear Quiz');

export const clearError = createAction('[Quiz] Clear Error');

export const loadAvailableQuizzes = createAction(
  '[Quiz] Load Available Quizzes'
);

export const loadAvailableQuizzesSuccess = createAction(
  '[Quiz] Load Available Quizzes Success',
  props<{ quizzes: Quiz[] }>()
);

export const loadAvailableQuizzesFailure = createAction(
  '[Quiz] Load Available Quizzes Failure',
  props<{ error: string }>()
);
