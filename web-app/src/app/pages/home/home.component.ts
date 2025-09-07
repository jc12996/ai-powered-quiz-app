import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { QuizGeneratorComponent } from '../../components/quiz-generator/quiz-generator.component';
import { QuizDisplayComponent } from '../../components/quiz-display/quiz-display.component';
import { QuizResultsComponent } from '../../components/quiz-results/quiz-results.component';
import { clearAllState } from '../../store/quiz.actions';
import {
  selectCurrentQuiz,
  selectQuizResults,
} from '../../store/quiz.selectors';
import { Quiz, QuizResult } from '../../models/quiz.model';

@Component({
  selector: 'app-home',
  imports: [QuizGeneratorComponent, QuizDisplayComponent, QuizResultsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('quizDisplay', { static: false }) quizDisplay!: ElementRef;
  @ViewChild('quizResults', { static: false }) quizResults!: ElementRef;

  currentQuiz$: Observable<Quiz | null>;
  quizResults$: Observable<QuizResult[]>;

  constructor(private store: Store) {
    this.currentQuiz$ = this.store.select(selectCurrentQuiz);
    this.quizResults$ = this.store.select(selectQuizResults);
  }

  ngOnInit() {
    // Clear all quiz state when navigating to home page
    this.store.dispatch(clearAllState());
  }

  ngAfterViewInit() {
    console.log('HomeComponent: ngAfterViewInit called');
    console.log('HomeComponent: quizDisplay element:', this.quizDisplay);
    console.log('HomeComponent: quizResults element:', this.quizResults);

    // Expose scroll methods globally for components to use
    (window as any).scrollToQuizDisplay = () => this.scrollToQuizDisplay();
    (window as any).scrollToQuizResults = () => this.scrollToQuizResults();
    console.log('HomeComponent: Scroll methods exposed to window');

    // Subscribe to quiz state changes to auto-scroll
    this.currentQuiz$.subscribe((quiz) => {
      if (quiz) {
        // Longer delay to ensure DOM is updated and elements are available
        setTimeout(() => this.scrollToQuizDisplay(), 500);
      }
    });

    // Subscribe to quiz results changes to auto-scroll
    this.quizResults$.subscribe((results) => {
      console.log('HomeComponent: Results changed:', results);
      if (results && results.length > 0) {
        console.log('HomeComponent: Triggering scroll to results');
        // Much longer delay to ensure DOM is fully updated and results are rendered
        setTimeout(() => this.scrollToQuizResults(), 1000);
      }
    });
  }

  scrollToQuizDisplay() {
    console.log('HomeComponent: scrollToQuizDisplay called');
    if (this.quizDisplay && this.quizDisplay.nativeElement) {
      console.log('HomeComponent: Scrolling to quiz display via ViewChild');
      this.quizDisplay.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      console.log(
        'HomeComponent: quizDisplay element not found, trying fallback'
      );
      // Fallback: try to find the quiz display element by ID
      const quizDisplayElement = document.getElementById('quiz-display');
      if (quizDisplayElement) {
        console.log('HomeComponent: Found quiz display element via ID');
        quizDisplayElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else {
        // Final fallback: try by component selector
        const quizDisplayElementBySelector =
          document.querySelector('app-quiz-display');
        if (quizDisplayElementBySelector) {
          console.log('HomeComponent: Found quiz display element via selector');
          quizDisplayElementBySelector.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else {
          console.log('HomeComponent: No quiz display element found');
        }
      }
    }
  }

  scrollToQuizResults() {
    console.log('HomeComponent: scrollToQuizResults called');
    if (this.quizResults && this.quizResults.nativeElement) {
      console.log('HomeComponent: Scrolling to quiz results via ViewChild');
      this.quizResults.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      console.log(
        'HomeComponent: quizResults element not found, trying fallback'
      );
      // Fallback: try to find the results element by ID
      const resultsElement = document.getElementById('quiz-results');
      if (resultsElement) {
        console.log('HomeComponent: Found results element via ID');
        resultsElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else {
        // Second fallback: try by component selector
        const resultsElementBySelector =
          document.querySelector('app-quiz-results');
        if (resultsElementBySelector) {
          console.log('HomeComponent: Found results element via selector');
          resultsElementBySelector.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else {
          console.log(
            'HomeComponent: No results element found, scrolling to bottom'
          );
          // Final fallback: scroll to the bottom of the page
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
        }
      }
    }
  }
}
