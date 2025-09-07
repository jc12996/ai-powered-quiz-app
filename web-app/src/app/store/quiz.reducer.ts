import { createReducer, on } from '@ngrx/store';
import { QuizState } from '../models/quiz.model';
import * as QuizActions from './quiz.actions';

export const initialState: QuizState = {
  currentQuiz: null,
  quizResults: [],
  availableQuizzes: [],
  loading: false,
  error: null,
};

export const quizReducer = createReducer(
  initialState,

  on(QuizActions.generateQuiz, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuizActions.generateQuizSuccess, (state, { quiz }) => ({
    ...state,
    currentQuiz: quiz,
    loading: false,
    error: null,
  })),

  on(QuizActions.generateQuizFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(QuizActions.loadQuiz, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuizActions.loadQuizSuccess, (state, { quiz }) => ({
    ...state,
    currentQuiz: quiz,
    loading: false,
    error: null,
  })),

  on(QuizActions.loadQuizFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(QuizActions.submitQuiz, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuizActions.submitQuizSuccess, (state, { result }) => ({
    ...state,
    quizResults: [...state.quizResults, result],
    loading: false,
    error: null,
  })),

  on(QuizActions.submitQuizFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(QuizActions.clearQuiz, (state) => ({
    ...state,
    currentQuiz: null,
  })),

  on(QuizActions.clearAllState, () => ({
    ...initialState,
  })),

  on(QuizActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  on(QuizActions.loadAvailableQuizzes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuizActions.loadAvailableQuizzesSuccess, (state, { quizzes }) => ({
    ...state,
    availableQuizzes: quizzes,
    loading: false,
    error: null,
  })),

  on(QuizActions.loadAvailableQuizzesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
