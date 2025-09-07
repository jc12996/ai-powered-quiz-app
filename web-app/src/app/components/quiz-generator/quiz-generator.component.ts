import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectQuizState } from '../../store/quiz.selectors';
import { generateQuiz, clearError } from '../../store/quiz.actions';
import { QuizState } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-generator',
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-generator.component.html',
  styleUrl: './quiz-generator.component.css',
})
export class QuizGeneratorComponent {
  topic = '';
  quizState$: Observable<QuizState>;

  constructor(private store: Store) {
    this.quizState$ = this.store.select(selectQuizState);
  }

  generateQuiz() {
    console.log('Generate quiz button clicked!', this.topic);
    if (this.topic.trim()) {
      console.log(
        'Dispatching generateQuiz action with topic:',
        this.topic.trim()
      );
      this.store.dispatch(clearError());
      this.store.dispatch(generateQuiz({ topic: this.topic.trim() }));
    } else {
      console.log('Topic is empty, not dispatching action');
    }
  }
}
