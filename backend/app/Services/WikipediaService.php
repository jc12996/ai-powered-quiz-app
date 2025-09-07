<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WikipediaService
{
    protected $baseUrl = 'https://en.wikipedia.org/api/rest_v1';

    /**
     * Search for Wikipedia articles related to a topic
     */
    public function searchArticles(string $topic): array
    {
        try {
            $response = Http::timeout(10)->get($this->baseUrl . '/page/summary/' . urlencode($topic));
            
            if ($response->successful()) {
                $data = $response->json();
                return [
                    'title' => $data['title'] ?? $topic,
                    'extract' => $data['extract'] ?? '',
                    'url' => $data['content_urls']['desktop']['page'] ?? '',
                    'thumbnail' => $data['thumbnail']['source'] ?? null,
                ];
            }
        } catch (\Exception $e) {
            Log::warning('Wikipedia search failed: ' . $e->getMessage());
        }

        return [];
    }

    /**
     * Get detailed content from Wikipedia for a specific topic
     */
    public function getArticleContent(string $topic): string
    {
        try {
            // First, search for the article
            $searchResponse = Http::timeout(10)->get('https://en.wikipedia.org/w/api.php', [
                'action' => 'query',
                'format' => 'json',
                'list' => 'search',
                'srsearch' => $topic,
                'srlimit' => 3,
                'srprop' => 'snippet'
            ]);

            if (!$searchResponse->successful()) {
                return '';
            }

            $searchData = $searchResponse->json();
            $articles = $searchData['query']['search'] ?? [];

            if (empty($articles)) {
                return '';
            }

            // Get the first article's content
            $firstArticle = $articles[0];
            $title = $firstArticle['title'];

            // Get the full article content
            $contentResponse = Http::timeout(15)->get('https://en.wikipedia.org/w/api.php', [
                'action' => 'query',
                'format' => 'json',
                'prop' => 'extracts',
                'titles' => $title,
                'exintro' => true,
                'explaintext' => true,
                'exsectionformat' => 'plain'
            ]);

            if ($contentResponse->successful()) {
                $contentData = $contentResponse->json();
                $pages = $contentData['query']['pages'] ?? [];
                
                foreach ($pages as $page) {
                    if (isset($page['extract'])) {
                        return $this->cleanContent($page['extract']);
                    }
                }
            }

        } catch (\Exception $e) {
            Log::warning('Wikipedia content retrieval failed: ' . $e->getMessage());
        }

        return '';
    }

    /**
     * Get multiple related articles for comprehensive context
     */
    public function getRelatedContext(string $topic): array
    {
        $context = [];
        
        try {
            // Get main article
            $mainContent = $this->getArticleContent($topic);
            if ($mainContent) {
                $context[] = [
                    'title' => $topic,
                    'content' => $mainContent,
                    'type' => 'main'
                ];
            }

            // Search for related terms
            $relatedTerms = $this->generateRelatedTerms($topic);
            
            foreach ($relatedTerms as $term) {
                $content = $this->getArticleContent($term);
                if ($content && strlen($content) > 100) { // Only include substantial content
                    $context[] = [
                        'title' => $term,
                        'content' => $content,
                        'type' => 'related'
                    ];
                }
                
                // Limit to 3 related articles to avoid overwhelming the context
                if (count($context) >= 4) {
                    break;
                }
            }

        } catch (\Exception $e) {
            Log::warning('Wikipedia related context retrieval failed: ' . $e->getMessage());
        }

        return $context;
    }

    /**
     * Generate related search terms for a topic
     */
    private function generateRelatedTerms(string $topic): array
    {
        $terms = [];
        
        // Add common related terms based on the topic
        $topicLower = strtolower($topic);
        
        if (strpos($topicLower, 'javascript') !== false) {
            $terms = ['JavaScript programming', 'ECMAScript', 'Web development'];
        } elseif (strpos($topicLower, 'python') !== false) {
            $terms = ['Python programming', 'Python syntax', 'Python libraries'];
        } elseif (strpos($topicLower, 'photosynthesis') !== false) {
            $terms = ['Chlorophyll', 'Plant biology', 'Carbon cycle'];
        } elseif (strpos($topicLower, 'history') !== false) {
            $terms = ['Historical events', 'Timeline', 'Historical figures'];
        } else {
            // Generic related terms
            $terms = [
                $topic . ' basics',
                $topic . ' fundamentals',
                $topic . ' concepts'
            ];
        }

        return $terms;
    }

    /**
     * Clean and format Wikipedia content
     */
    private function cleanContent(string $content): string
    {
        // Remove excessive whitespace and clean up the text
        $content = preg_replace('/\s+/', ' ', $content);
        $content = trim($content);
        
        // Limit content length to avoid overwhelming the context
        if (strlen($content) > 2000) {
            $content = substr($content, 0, 2000) . '...';
        }
        
        return $content;
    }

    /**
     * Format context for injection into AI prompts
     */
    public function formatContextForPrompt(array $context): string
    {
        if (empty($context)) {
            return '';
        }

        $formattedContext = "Here is factual information from Wikipedia to help generate accurate quiz questions:\n\n";
        
        foreach ($context as $item) {
            $formattedContext .= "**{$item['title']}**\n";
            $formattedContext .= "{$item['content']}\n\n";
        }
        
        $formattedContext .= "Please use this factual information to generate accurate, educational quiz questions. ";
        $formattedContext .= "Ensure all questions and answers are factually correct based on the provided context.";
        
        return $formattedContext;
    }
}
