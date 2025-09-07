<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\WikipediaService;

class OpenAIService
{
    protected $apiKey;
    protected $baseUrl;
    protected $wikipediaService;

    public function __construct(WikipediaService $wikipediaService)
    {
        $this->apiKey = env('OPENAI_API_KEY');
        $this->baseUrl = 'https://api.openai.com/v1';
        $this->wikipediaService = $wikipediaService;
    }

    public function generateQuiz(string $topic): array
    {
        if (!$this->apiKey) {
            throw new \Exception('OpenAI API key not configured');
        }

        // Retrieve factual context from Wikipedia
        $context = $this->wikipediaService->getRelatedContext($topic);
        $contextText = $this->wikipediaService->formatContextForPrompt($context);
        
        $prompt = $this->buildQuizPromptWithContext($topic, $contextText);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert quiz generator. Generate exactly 5 multiple-choice questions about the given topic using the provided factual context. Each question should have 4 options (A, B, C, D) with only one correct answer. Ensure all questions and answers are factually accurate based on the provided context. Return the response as a valid JSON array.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => 2500,
                'temperature' => 0.7
            ]);

            if ($response->failed()) {
                throw new \Exception('OpenAI API request failed: ' . $response->body());
            }

            $data = $response->json();
            $content = $data['choices'][0]['message']['content'];

            // Parse the JSON response
            $questions = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Failed to parse OpenAI response as JSON: ' . json_last_error_msg());
            }

            // Validate the structure
            if (!is_array($questions) || count($questions) !== 5) {
                throw new \Exception('Invalid quiz structure returned from OpenAI');
            }

            return $questions;

        } catch (\Exception $e) {
            Log::error('OpenAI API Error: ' . $e->getMessage());
            throw $e;
        }
    }

    private function buildQuizPrompt(string $topic): string
    {
        return "Generate 5 multiple-choice questions about '{$topic}'. Each question should have 4 options (A, B, C, D) with only one correct answer. Return the response as a JSON array with this exact structure:

[
  {
    \"question\": \"Question text here?\",
    \"options\": {
      \"A\": \"Option A text\",
      \"B\": \"Option B text\", 
      \"C\": \"Option C text\",
      \"D\": \"Option D text\"
    },
    \"correct_answer\": \"A\"
  }
]

Make sure the questions are educational, clear, and appropriate for the topic. The correct answers should be factual and well-reasoned.";
    }

    private function buildQuizPromptWithContext(string $topic, string $context): string
    {
        return "Generate 5 multiple-choice questions about '{$topic}' using the following factual context:

{$context}

Each question should have 4 options (A, B, C, D) with only one correct answer. Return the response as a JSON array with this exact structure:

[
  {
    \"question\": \"Question text here?\",
    \"options\": {
      \"A\": \"Option A text\",
      \"B\": \"Option B text\", 
      \"C\": \"Option C text\",
      \"D\": \"Option D text\"
    },
    \"correct_answer\": \"A\"
  }
]

Make sure the questions are educational, clear, and factually accurate based on the provided context. The correct answers should be grounded in the factual information provided.";
    }

    public function generateExplanation(string $prompt): string
    {
        if (!$this->apiKey) {
            throw new \Exception('OpenAI API key not configured');
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a helpful tutor. Provide clear, encouraging explanations for quiz answers based on factual information. Be educational, supportive, and ensure your explanations are factually accurate.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => 300,
                'temperature' => 0.5
            ]);

            if ($response->failed()) {
                throw new \Exception('OpenAI API request failed: ' . $response->body());
            }

            $data = $response->json();
            return trim($data['choices'][0]['message']['content']);

        } catch (\Exception $e) {
            Log::error('OpenAI Explanation Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Generate explanation with Wikipedia context for better accuracy
     */
    public function generateExplanationWithContext(string $question, string $correctAnswer, string $userAnswer, array $options, string $topic): string
    {
        if (!$this->apiKey) {
            throw new \Exception('OpenAI API key not configured');
        }

        // Get relevant context for the topic
        $context = $this->wikipediaService->getRelatedContext($topic);
        $contextText = $this->wikipediaService->formatContextForPrompt($context);

        $prompt = "Question: {$question}\n";
        $prompt .= "Correct Answer: {$correctAnswer}\n";
        $prompt .= "User's Answer: {$userAnswer}\n";
        $prompt .= "Options: " . json_encode($options) . "\n\n";
        $prompt .= "Context: {$contextText}\n\n";
        $prompt .= "Please provide a brief explanation (1-2 sentences) of why the correct answer is right and why the user's answer is wrong. Use the provided context to ensure factual accuracy. Be encouraging and educational.";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a helpful tutor. Provide clear, encouraging explanations for quiz answers based on the provided factual context. Be educational, supportive, and ensure your explanations are factually accurate based on the context provided.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => 300,
                'temperature' => 0.5
            ]);

            if ($response->failed()) {
                throw new \Exception('OpenAI API request failed: ' . $response->body());
            }

            $data = $response->json();
            return trim($data['choices'][0]['message']['content']);

        } catch (\Exception $e) {
            Log::error('OpenAI Explanation with Context Error: ' . $e->getMessage());
            // Fallback to basic explanation if context retrieval fails
            return $this->generateExplanation($prompt);
        }
    }
}
