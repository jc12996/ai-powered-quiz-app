import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { QuizGeneratorComponent } from '../../components/quiz-generator/quiz-generator.component';
import { QuizDisplayComponent } from '../../components/quiz-display/quiz-display.component';
import { QuizResultsComponent } from '../../components/quiz-results/quiz-results.component';
import { clearAllState } from '../../store/quiz.actions';

@Component({
  selector: 'app-home',
  imports: [QuizGeneratorComponent, QuizDisplayComponent, QuizResultsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    // Clear all quiz state when navigating to home page
    this.store.dispatch(clearAllState());
  }
}
