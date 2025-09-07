import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectCurrentQuiz,
  selectQuizLoading,
} from '../../store/quiz.selectors';
import { submitQuiz } from '../../store/quiz.actions';
import { Quiz, Question } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-display',
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-display.component.html',
  styleUrl: './quiz-display.component.css',
})
export class QuizDisplayComponent implements OnInit {
  currentQuiz$: Observable<Quiz | null>;
  loading$: Observable<boolean>;
  userAnswers: string[] = [];
  isSubmitted = false;

  constructor(private store: Store) {
    this.currentQuiz$ = this.store.select(selectCurrentQuiz);
    this.loading$ = this.store.select(selectQuizLoading);
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
  }

  selectAnswer(questionIndex: number, answer: string) {
    this.userAnswers[questionIndex] = answer;
  }

  getOptionText(question: Question, option: string): string {
    return question.options[option as keyof typeof question.options];
  }

  submitQuiz() {
    this.currentQuiz$.subscribe((quiz) => {
      if (quiz && this.userAnswers.every((answer) => answer !== '')) {
        this.store.dispatch(
          submitQuiz({
            quizId: quiz.id,
            answers: this.userAnswers,
          })
        );
        this.isSubmitted = true;
      }
    });
  }

  canSubmit(): boolean {
    return (
      this.userAnswers.every((answer) => answer !== '') && !this.isSubmitted
    );
  }
}
