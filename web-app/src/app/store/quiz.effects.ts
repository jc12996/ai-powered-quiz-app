import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { QuizService } from '../services/quiz.service';
import * as QuizActions from './quiz.actions';

@Injectable()
export class QuizEffects {
  private actions$ = inject(Actions);
  private quizService = inject(QuizService);

  generateQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.generateQuiz),
      switchMap(({ topic }) => {
        console.log(
          'QuizEffects: generateQuiz effect triggered for topic:',
          topic
        );
        console.log('QuizEffects: Topic type:', typeof topic);
        console.log(
          'QuizEffects: Topic length:',
          topic ? topic.length : 'null/undefined'
        );
        console.log(
          'QuizEffects: Topic trimmed:',
          topic ? topic.trim() : 'null/undefined'
        );
        return this.quizService.generateQuiz(topic).pipe(
          map((quiz) => {
            console.log('QuizEffects: Quiz generation successful:', quiz);
            return QuizActions.generateQuizSuccess({ quiz });
          }),
          catchError((error) => {
            console.log('QuizEffects: Quiz generation failed:', error);
            return of(
              QuizActions.generateQuizFailure({ error: error.message })
            );
          })
        );
      })
    )
  );

  loadQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.loadQuiz),
      switchMap(({ id }) =>
        this.quizService.getQuiz(id).pipe(
          map((quiz) => QuizActions.loadQuizSuccess({ quiz })),
          catchError((error) =>
            of(QuizActions.loadQuizFailure({ error: error.message }))
          )
        )
      )
    )
  );

  submitQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.submitQuiz),
      switchMap(({ quizId, answers }) =>
        this.quizService.submitQuiz(quizId, answers).pipe(
          map((result) => QuizActions.submitQuizSuccess({ result })),
          catchError((error) =>
            of(QuizActions.submitQuizFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadAvailableQuizzes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.loadAvailableQuizzes),
      switchMap(() =>
        this.quizService.getAvailableQuizzes().pipe(
          map((quizzes) =>
            QuizActions.loadAvailableQuizzesSuccess({ quizzes })
          ),
          catchError((error) =>
            of(
              QuizActions.loadAvailableQuizzesFailure({ error: error.message })
            )
          )
        )
      )
    )
  );
}
