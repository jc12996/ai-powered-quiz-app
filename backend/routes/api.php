<?php

use App\Http\Controllers\Api\QuizController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Quiz API routes
Route::prefix('quizzes')->group(function () {
    Route::post('/generate', [QuizController::class, 'generate']);
    Route::get('/', [QuizController::class, 'index']);
    Route::get('/{id}', [QuizController::class, 'show']);
    Route::post('/{id}/submit', [QuizController::class, 'submit']);
});
