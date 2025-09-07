import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectQuizResults,
  selectCurrentQuiz,
} from '../../store/quiz.selectors';
import { clearAllState } from '../../store/quiz.actions';
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

  constructor(private store: Store, private router: Router) {
    this.currentQuiz$ = this.store.select(selectCurrentQuiz);
    this.quizResults$ = this.store.select(selectQuizResults);
  }

  ngOnInit() {
    this.quizResults$.subscribe((results) => {
      console.log('QuizResultsComponent: Results changed:', results);
      if (results.length > 0) {
        this.latestResult = results[results.length - 1];
        console.log('QuizResultsComponent: Latest result:', this.latestResult);
        // Trigger scroll to results when they are first loaded
        setTimeout(() => {
          if ((window as any).scrollToQuizResults) {
            console.log('QuizResultsComponent: Calling scrollToQuizResults');
            (window as any).scrollToQuizResults();
          } else {
            console.log(
              'QuizResultsComponent: scrollToQuizResults not available on window'
            );
          }
        }, 1000);
      } else {
        // Reset when results are cleared
        this.latestResult = null;
      }
    });
  }

  generateNewQuiz() {
    // Clear all state and navigate to home page
    this.store.dispatch(clearAllState());
    this.router.navigate(['/home']);
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
