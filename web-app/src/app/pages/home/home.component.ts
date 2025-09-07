import { Component } from '@angular/core';
import { QuizGeneratorComponent } from '../../components/quiz-generator/quiz-generator.component';
import { QuizDisplayComponent } from '../../components/quiz-display/quiz-display.component';
import { QuizResultsComponent } from '../../components/quiz-results/quiz-results.component';

@Component({
  selector: 'app-home',
  imports: [QuizGeneratorComponent, QuizDisplayComponent, QuizResultsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
