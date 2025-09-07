import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectAvailableQuizzes,
  selectQuizLoading,
  selectQuizResults,
  selectCurrentQuiz,
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
export class QuizHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('quizDisplay', { static: false }) quizDisplay!: ElementRef;
  @ViewChild('quizResults', { static: false }) quizResults!: ElementRef;
  @ViewChild('previousResults', { static: false }) previousResults!: ElementRef;

  availableQuizzes$: Observable<Quiz[]>;
  loading$: Observable<boolean>;
  quizResults$: Observable<QuizResult[]>;
  currentQuiz$: Observable<Quiz | null>;
  selectedQuizId: number | null = null;
  showResults = false;

  constructor(private store: Store) {
    this.availableQuizzes$ = this.store.select(selectAvailableQuizzes);
    this.loading$ = this.store.select(selectQuizLoading);
    this.quizResults$ = this.store.select(selectQuizResults);
    this.currentQuiz$ = this.store.select(selectCurrentQuiz);
  }

  ngOnInit() {
    this.store.dispatch(loadAvailableQuizzes());
  }

  ngAfterViewInit() {
    // Expose scroll methods globally for components to use
    (window as any).scrollToQuizDisplay = () => this.scrollToQuizDisplay();
    (window as any).scrollToQuizResults = () => this.scrollToQuizResults();

    // Subscribe to quiz state changes to auto-scroll
    this.currentQuiz$.subscribe((quiz) => {
      if (quiz && !this.showResults) {
        // Small delay to ensure DOM is updated
        setTimeout(() => this.scrollToQuizDisplay(), 100);
      }
    });

    // Subscribe to quiz results changes to auto-scroll
    this.quizResults$.subscribe((results) => {
      if (results && results.length > 0) {
        if (this.showResults) {
          // Longer delay to ensure DOM is fully updated and results are rendered
          setTimeout(() => this.scrollToPreviousResults(), 300);
        } else {
          // Longer delay to ensure DOM is fully updated and results are rendered
          setTimeout(() => this.scrollToQuizResults(), 300);
        }
      }
    });
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

    // Auto-scroll to the appropriate section after toggling
    setTimeout(() => {
      if (this.showResults) {
        this.scrollToPreviousResults();
      } else {
        this.scrollToQuizDisplay();
      }
    }, 100);
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

  scrollToQuizDisplay() {
    if (this.quizDisplay) {
      this.quizDisplay.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  scrollToQuizResults() {
    if (this.quizResults) {
      this.quizResults.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  scrollToPreviousResults() {
    if (this.previousResults) {
      this.previousResults.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
