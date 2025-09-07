import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizResult, QuestionResult } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-review',
  imports: [CommonModule],
  templateUrl: './quiz-review.component.html',
  styleUrl: './quiz-review.component.css',
})
export class QuizReviewComponent {
  @Input() result: QuizResult | null = null;

  getOptionText(questionResult: QuestionResult, option: string): string {
    return (
      questionResult.options[option as keyof typeof questionResult.options] ||
      ''
    );
  }

  getOptionClass(questionResult: QuestionResult, option: string): string {
    if (option === questionResult.correct_answer) {
      return 'correct-answer';
    } else if (
      option === questionResult.user_answer &&
      !questionResult.is_correct
    ) {
      return 'incorrect-answer';
    }
    return '';
  }
}
