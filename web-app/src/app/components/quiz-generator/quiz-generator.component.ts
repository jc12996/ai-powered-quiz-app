import { Component, OnInit } from '@angular/core';
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
export class QuizGeneratorComponent implements OnInit {
  topic = '';
  quizState$: Observable<QuizState>;

  constructor(private store: Store) {
    this.quizState$ = this.store.select(selectQuizState);
  }

  ngOnInit() {
    // Listen for state changes to clear the topic input when state is cleared
    this.quizState$.subscribe((state) => {
      // Only clear the topic input when the state is completely reset (no quiz, no loading, no error)
      // This happens when "Generate New Quiz" is clicked from the results page
      if (
        !state.currentQuiz &&
        !state.loading &&
        !state.error &&
        state.quizResults.length === 0
      ) {
        this.topic = '';
      }
    });
  }

  generateQuiz() {
    console.log('Generate quiz button clicked!', this.topic);
    console.log('Topic length:', this.topic.length);
    console.log('Topic trimmed:', this.topic.trim());
    console.log('Topic trimmed length:', this.topic.trim().length);

    if (this.topic.trim()) {
      const topicToSend = this.topic.trim();
      console.log('Dispatching generateQuiz action with topic:', topicToSend);
      this.store.dispatch(clearError());
      this.store.dispatch(generateQuiz({ topic: topicToSend }));
    } else {
      console.log('Topic is empty, not dispatching action');
    }
  }
}
