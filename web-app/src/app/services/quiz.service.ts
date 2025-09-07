import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Quiz, QuizResult } from '../models/quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  generateQuiz(topic: string): Observable<Quiz> {
    console.log(
      'QuizService: Making HTTP request to generate quiz for topic:',
      topic
    );
    console.log('QuizService: Topic type:', typeof topic);
    console.log(
      'QuizService: Topic length:',
      topic ? topic.length : 'null/undefined'
    );
    console.log(
      'QuizService: Topic trimmed:',
      topic ? topic.trim() : 'null/undefined'
    );
    console.log('QuizService: API URL:', `${this.apiUrl}/quizzes/generate`);

    const requestBody = { topic };
    console.log('QuizService: Request body:', requestBody);

    return this.http
      .post<{ success: boolean; quiz: Quiz }>(
        `${this.apiUrl}/quizzes/generate`,
        requestBody
      )
      .pipe(
        map((response) => {
          console.log('QuizService: Received response:', response);
          return response.quiz;
        })
      );
  }

  getQuiz(id: number): Observable<Quiz> {
    return this.http
      .get<{ quiz: Quiz }>(`${this.apiUrl}/quizzes/${id}`)
      .pipe(map((response) => response.quiz));
  }

  submitQuiz(quizId: number, answers: string[]): Observable<QuizResult> {
    return this.http
      .post<{
        success: boolean;
        result: QuizResult;
        score: number;
        total_questions: number;
        percentage: number;
        question_results: any[];
      }>(`${this.apiUrl}/quizzes/${quizId}/submit`, { answers })
      .pipe(
        map((response) => ({
          ...response.result,
          percentage: response.percentage,
          question_results: response.question_results,
        }))
      );
  }

  getAvailableQuizzes(): Observable<Quiz[]> {
    return this.http
      .get<{ quizzes: Quiz[] }>(`${this.apiUrl}/quizzes`)
      .pipe(map((response) => response.quizzes));
  }

  getQuizResults(quizId: number): Observable<QuizResult[]> {
    return this.http
      .get<{ results: QuizResult[] }>(
        `${this.apiUrl}/quizzes/${quizId}/results`
      )
      .pipe(map((response) => response.results));
  }
}
