import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectCurrentQuiz,
  selectQuizLoading,
  selectQuizResults,
} from '../../store/quiz.selectors';
import { submitQuiz } from '../../store/quiz.actions';
import { Quiz, Question, QuizResult } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-display',
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-display.component.html',
  styleUrl: './quiz-display.component.css',
})
export class QuizDisplayComponent implements OnInit {
  currentQuiz$: Observable<Quiz | null>;
  loading$: Observable<boolean>;
  quizResults$: Observable<QuizResult[]>;
  userAnswers: string[] = [];
  isSubmitted = false;

  constructor(private store: Store) {
    this.currentQuiz$ = this.store.select(selectCurrentQuiz);
    this.loading$ = this.store.select(selectQuizLoading);
    this.quizResults$ = this.store.select(selectQuizResults);
  }

  ngOnInit() {
    this.currentQuiz$.subscribe((quiz) => {
      if (quiz) {
        this.userAnswers = new Array(quiz.questions.length).fill('');
        this.isSubmitted = false;
      } else {
        // Reset state when quiz is cleared
        this.userAnswers = [];
        this.isSubmitted = false;
      }
    });

    // Subscribe to quiz results to trigger scroll when results are loaded
    this.quizResults$.subscribe((results) => {
      console.log('QuizDisplayComponent: Results changed:', results);
      console.log('QuizDisplayComponent: isSubmitted:', this.isSubmitted);
      if (results && results.length > 0 && this.isSubmitted) {
        console.log('QuizDisplayComponent: Triggering scroll to results');
        // Much longer delay to ensure DOM is fully updated and results are rendered
        setTimeout(() => {
          if ((window as any).scrollToQuizResults) {
            console.log('QuizDisplayComponent: Calling scrollToQuizResults');
            (window as any).scrollToQuizResults();
          } else {
            console.log(
              'QuizDisplayComponent: scrollToQuizResults not available on window'
            );
          }
        }, 1000);
      }
    });
  }

  selectAnswer(questionIndex: number, answer: string) {
    this.userAnswers[questionIndex] = answer;
  }

  getOptionText(question: Question, option: string): string {
    return question.options[option as keyof typeof question.options];
  }

  submitQuiz() {
    console.log('QuizDisplayComponent: submitQuiz called');
    this.currentQuiz$.subscribe((quiz) => {
      if (quiz && this.userAnswers.every((answer) => answer !== '')) {
        console.log('QuizDisplayComponent: Dispatching submitQuiz action');
        this.store.dispatch(
          submitQuiz({
            quizId: quiz.id,
            answers: this.userAnswers,
          })
        );
        this.isSubmitted = true;
        console.log('QuizDisplayComponent: isSubmitted set to true');
      }
    });
  }

  canSubmit(): boolean {
    return (
      this.userAnswers.every((answer) => answer !== '') && !this.isSubmitted
    );
  }
}
