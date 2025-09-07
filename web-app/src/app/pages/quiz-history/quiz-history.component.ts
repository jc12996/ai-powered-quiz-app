import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectAvailableQuizzes,
  selectQuizLoading,
  selectQuizResults,
} from '../../store/quiz.selectors';
import {
  loadAvailableQuizzes,
  loadQuiz,
  loadQuizResults,
} from '../../store/quiz.actions';
import { Quiz, QuizResult } from '../../models/quiz.model';
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
  quizResults$: Observable<QuizResult[]>;
  selectedQuizId: number | null = null;
  showResults = false;

  constructor(private store: Store) {
    this.availableQuizzes$ = this.store.select(selectAvailableQuizzes);
    this.loading$ = this.store.select(selectQuizLoading);
    this.quizResults$ = this.store.select(selectQuizResults);
  }

  ngOnInit() {
    this.store.dispatch(loadAvailableQuizzes());
  }

  onQuizSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const quizId = parseInt(target.value);

    if (quizId && !isNaN(quizId)) {
      this.selectedQuizId = quizId;
      this.showResults = false;
      // Load both the quiz and its results
      this.store.dispatch(loadQuiz({ id: quizId }));
      this.store.dispatch(loadQuizResults({ quizId }));
    } else {
      this.selectedQuizId = null;
      this.showResults = false;
    }
  }

  toggleView() {
    this.showResults = !this.showResults;
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

  getOptionClass(questionResult: any, option: string): string {
    let classes = 'option';
    if (option === questionResult.correct_answer) {
      classes += ' correct';
    }
    if (option === questionResult.user_answer && !questionResult.is_correct) {
      classes += ' incorrect';
    }
    return classes;
  }

  getOptionText(questionResult: any, option: string): string {
    return questionResult.options[
      option as keyof typeof questionResult.options
    ];
  }
}
