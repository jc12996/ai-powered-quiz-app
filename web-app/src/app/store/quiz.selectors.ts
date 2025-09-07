import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuizState } from '../models/quiz.model';

export const selectQuizState = createFeatureSelector<QuizState>('quiz');

export const selectCurrentQuiz = createSelector(
  selectQuizState,
  (state) => state.currentQuiz
);

export const selectQuizLoading = createSelector(
  selectQuizState,
  (state) => state.loading
);

export const selectQuizError = createSelector(
  selectQuizState,
  (state) => state.error
);

export const selectQuizResults = createSelector(
  selectQuizState,
  (state) => state.quizResults
);

export const selectAvailableQuizzes = createSelector(
  selectQuizState,
  (state) => state.availableQuizzes
);
