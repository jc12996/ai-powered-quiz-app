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
        $questionResults = [];

        foreach ($questions as $index => $question) {
            $userAnswer = $userAnswers[$index] ?? null;
            $isCorrect = $userAnswer === $question['correct_answer'];
            
            if ($isCorrect) {
                $score++;
            }

            $questionResults[] = [
                'question' => $question['question'],
                'user_answer' => $userAnswer,
                'correct_answer' => $question['correct_answer'],
                'is_correct' => $isCorrect,
                'options' => $question['options'],
                'explanation' => $isCorrect ? null : $this->generateExplanation($question, $userAnswer, $quiz->topic)
            ];
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
            'percentage' => round(($score / $totalQuestions) * 100, 2),
            'question_results' => $questionResults
        ]);
    }

    /**
     * Generate explanation for wrong answer using AI with Wikipedia context
     */
    private function generateExplanation($question, $userAnswer, $quizTopic)
    {
        try {
            // Use the enhanced explanation generation with Wikipedia context
            $response = $this->openAIService->generateExplanationWithContext(
                $question['question'],
                $question['correct_answer'],
                $userAnswer,
                $question['options'],
                $quizTopic
            );
            return $response;
        } catch (\Exception $e) {
            // Fallback to basic explanation if context retrieval fails
            $prompt = "Question: {$question['question']}\n";
            $prompt .= "Correct Answer: {$question['correct_answer']}\n";
            $prompt .= "User's Answer: {$userAnswer}\n";
            $prompt .= "Options: " . json_encode($question['options']) . "\n";
            $prompt .= "Please provide a brief explanation (1-2 sentences) of why the correct answer is right and why the user's answer is wrong. Be encouraging and educational.";

            try {
                return $this->openAIService->generateExplanation($prompt);
            } catch (\Exception $e2) {
                return "The correct answer is {$question['correct_answer']}. Please review the question and try to understand why this answer is correct.";
            }
        }
    }

    /**
     * Get quiz results for a specific quiz
     */
    public function getResults(string $id): JsonResponse
    {
        $quiz = Quiz::findOrFail($id);
        $results = QuizResult::where('quiz_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        // For each result, we need to reconstruct the question_results with explanations
        $resultsWithDetails = $results->map(function ($result) use ($quiz) {
            $questions = $quiz->questions;
            $userAnswers = $result->user_answers;
            $questionResults = [];

            foreach ($questions as $index => $question) {
                $userAnswer = $userAnswers[$index] ?? null;
                $isCorrect = $userAnswer === $question['correct_answer'];
                
                $questionResults[] = [
                    'question' => $question['question'],
                    'user_answer' => $userAnswer,
                    'correct_answer' => $question['correct_answer'],
                    'is_correct' => $isCorrect,
                    'options' => $question['options'],
                    'explanation' => $isCorrect ? null : $this->generateExplanation($question, $userAnswer, $quiz->topic)
                ];
            }

            return [
                'id' => $result->id,
                'quiz_id' => $result->quiz_id,
                'user_answers' => $result->user_answers,
                'score' => $result->score,
                'total_questions' => $result->total_questions,
                'percentage' => round(($result->score / $result->total_questions) * 100, 2),
                'question_results' => $questionResults,
                'created_at' => $result->created_at,
                'updated_at' => $result->updated_at
            ];
        });

        return response()->json(['results' => $resultsWithDetails]);
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
