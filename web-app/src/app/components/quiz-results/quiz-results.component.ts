import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectQuizResults,
  selectCurrentQuiz,
} from '../../store/quiz.selectors';
import { clearQuiz } from '../../store/quiz.actions';
import { Quiz, QuizResult } from '../../models/quiz.model';
import { QuizReviewComponent } from '../quiz-review/quiz-review.component';

@Component({
  selector: 'app-quiz-results',
  imports: [CommonModule, QuizReviewComponent],
  templateUrl: './quiz-results.component.html',
  styleUrl: './quiz-results.component.css',
})
export class QuizResultsComponent implements OnInit {
  currentQuiz$: Observable<Quiz | null>;
  quizResults$: Observable<QuizResult[]>;
  latestResult: QuizResult | null = null;

  constructor(private store: Store) {
    this.currentQuiz$ = this.store.select(selectCurrentQuiz);
    this.quizResults$ = this.store.select(selectQuizResults);
  }

  ngOnInit() {
    this.quizResults$.subscribe((results) => {
      if (results.length > 0) {
        this.latestResult = results[results.length - 1];
      }
    });
  }

  generateNewQuiz() {
    this.store.dispatch(clearQuiz());
  }

  getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'fair';
    return 'poor';
  }

  getScoreMessage(percentage: number): string {
    if (percentage >= 80) return 'Excellent work!';
    if (percentage >= 60) return 'Good job!';
    if (percentage >= 40) return 'Not bad, keep studying!';
    return 'Keep practicing!';
  }
}
