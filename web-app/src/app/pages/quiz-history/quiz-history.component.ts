import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectAvailableQuizzes,
  selectQuizLoading,
} from '../../store/quiz.selectors';
import { loadAvailableQuizzes, loadQuiz } from '../../store/quiz.actions';
import { Quiz } from '../../models/quiz.model';
import { QuizDisplayComponent } from '../../components/quiz-display/quiz-display.component';
import { QuizResultsComponent } from '../../components/quiz-results/quiz-results.component';

@Component({
  selector: 'app-quiz-history',
  imports: [
    CommonModule,
    RouterModule,
    QuizDisplayComponent,
    QuizResultsComponent,
  ],
  templateUrl: './quiz-history.component.html',
  styleUrl: './quiz-history.component.css',
})
export class QuizHistoryComponent implements OnInit {
  availableQuizzes$: Observable<Quiz[]>;
  loading$: Observable<boolean>;
  selectedQuizId: number | null = null;

  constructor(private store: Store) {
    this.availableQuizzes$ = this.store.select(selectAvailableQuizzes);
    this.loading$ = this.store.select(selectQuizLoading);
  }

  ngOnInit() {
    this.store.dispatch(loadAvailableQuizzes());
  }

  onQuizSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const quizId = parseInt(target.value);

    if (quizId && !isNaN(quizId)) {
      this.selectedQuizId = quizId;
      this.store.dispatch(loadQuiz({ id: quizId }));
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
