<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('OPENAI_API_KEY');
        $this->baseUrl = 'https://api.openai.com/v1';
    }

    public function generateQuiz(string $topic): array
    {
        if (!$this->apiKey) {
            throw new \Exception('OpenAI API key not configured');
        }

        $prompt = $this->buildQuizPrompt($topic);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert quiz generator. Generate exactly 5 multiple-choice questions about the given topic. Each question should have 4 options (A, B, C, D) with only one correct answer. Return the response as a valid JSON array.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => 2000,
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
}
