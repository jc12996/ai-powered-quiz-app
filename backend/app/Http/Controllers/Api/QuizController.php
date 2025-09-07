<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizResult;
use App\Services\OpenAIService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class QuizController extends Controller
{
    protected $openAIService;

    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }

    /**
     * Generate a new quiz based on topic
     */
    public function generate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'topic' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            $topic = $request->input('topic');
            $questions = $this->openAIService->generateQuiz($topic);

            $quiz = Quiz::create([
                'topic' => $topic,
                'questions' => $questions
            ]);

            return response()->json([
                'success' => true,
                'quiz' => $quiz
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate quiz: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific quiz
     */
    public function show(string $id): JsonResponse
    {
        $quiz = Quiz::findOrFail($id);
        return response()->json(['quiz' => $quiz]);
    }

    /**
     * Submit quiz answers and get results
     */
    public function submit(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'answers' => 'required|array',
            'answers.*' => 'required|string|in:A,B,C,D'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $quiz = Quiz::findOrFail($id);
        $userAnswers = $request->input('answers');
        $questions = $quiz->questions;

        $score = 0;
        $totalQuestions = count($questions);

        foreach ($questions as $index => $question) {
            if (isset($userAnswers[$index]) && $userAnswers[$index] === $question['correct_answer']) {
                $score++;
            }
        }

        $result = QuizResult::create([
            'quiz_id' => $quiz->id,
            'user_answers' => $userAnswers,
            'score' => $score,
            'total_questions' => $totalQuestions
        ]);

        return response()->json([
            'success' => true,
            'result' => $result,
            'score' => $score,
            'total_questions' => $totalQuestions,
            'percentage' => round(($score / $totalQuestions) * 100, 2)
        ]);
    }

    /**
     * Get all quizzes
     */
    public function index(): JsonResponse
    {
        $quizzes = Quiz::orderBy('created_at', 'desc')->get();
        return response()->json(['quizzes' => $quizzes]);
    }
}
