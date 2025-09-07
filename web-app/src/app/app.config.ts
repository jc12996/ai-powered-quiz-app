import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { quizReducer } from './store/quiz.reducer';
import { QuizEffects } from './store/quiz.effects';
import { QuizService } from './services/quiz.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ quiz: quizReducer }),
    provideEffects([QuizEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    QuizService,
  ],
};
