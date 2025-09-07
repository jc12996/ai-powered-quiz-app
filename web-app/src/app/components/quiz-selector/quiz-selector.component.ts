import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectAvailableQuizzes,
  selectQuizLoading,
} from '../../store/quiz.selectors';
import { loadAvailableQuizzes, loadQuiz } from '../../store/quiz.actions';
import { Quiz } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-selector',
  imports: [CommonModule],
  templateUrl: './quiz-selector.component.html',
  styleUrl: './quiz-selector.component.css',
})
export class QuizSelectorComponent implements OnInit {
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
