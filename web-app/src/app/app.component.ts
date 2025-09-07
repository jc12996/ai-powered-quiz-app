import { Component } from '@angular/core';
import { QuizGeneratorComponent } from './components/quiz-generator/quiz-generator.component';
import { QuizDisplayComponent } from './components/quiz-display/quiz-display.component';
import { QuizResultsComponent } from './components/quiz-results/quiz-results.component';

@Component({
  selector: 'app-root',
  imports: [QuizGeneratorComponent, QuizDisplayComponent, QuizResultsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'AI-Powered Quiz Builder';
}
