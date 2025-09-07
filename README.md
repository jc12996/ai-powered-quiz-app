# AI-Powered Quiz Builder

A full-stack web application that generates intelligent multiple-choice quizzes using AI. Built with Angular 19, Laravel, and MySQL, all containerized with Docker. Written by John Christiansen, with the help of AI assitants (Cursor), Wikipedia, OpenAI API.
9/7/2025

## Features

- 🤖 **AI-Powered Quiz Generation**: Uses OpenAI API to generate 5-question multiple-choice quizzes on any topic
- 🎯 **Interactive Quiz Interface**: Clean, modern UI for taking quizzes with real-time feedback
- 📊 **Results & Scoring**: Detailed results with percentage scores, performance feedback, and explanations for incorrect answers
- 🕵️ **Wikipedia-Powered RAG**: Uses Retrieval-Augmented Generation (RAG) to search Wikipedia for quiz content and explanations, with a smooth fallback if Wikipedia is unavailable
- 🗂️ **Quiz History**: View your past submitted quizzes and results at any time
- 🏗️ **Modern Architecture**: Angular 19 with NgRx state management, Laravel API, MySQL database
- 🐳 **Dockerized**: All services containerized for easy deployment and development
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- **Angular 19** - Modern web framework
- **NgRx** - State management
- **TypeScript** - Type-safe development
- **CSS3** - Modern styling with gradients and animations

### Backend

- **Laravel 12** - PHP framework
- **MySQL 8.0** - Database
- **OpenAI API** - AI quiz generation

### Infrastructure

- **Docker** - Containerization
- **Nginx** - Web server
- **Make** - Build automation

## Quick Start

### Prerequisites

- **Docker Desktop** - For containerization and running all services
  - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **OpenAI API Key with credits added** - Required for AI quiz generation and explanations
  - [Generate OpenAI API Key](https://platform.openai.com/api-keys)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd quiz-app
   ```

2. **Configure Environment Variables**

   ```bash
   # Copy .env.example to .env if it doesn't exist
   cd backend
   cp .env.example .env

   # Edit backend/.env file with localhost configuration
   # Database configuration for localhost
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=quiz_app
   DB_USERNAME=quiz_user
   DB_PASSWORD=quiz_password

   # OpenAI API Key (you'll need to add this)
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Configure OpenAI API Key**

   ```bash
   # Edit backend/.env file and add your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start all services**

   ```bash
   make start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database: localhost:3306

## Development

### Available Commands

```bash
# Start all services
make start

# Stop all services
make stop

# Clean up everything
make clean

# Development mode with live reload
make dev

# Run database migrations
make migrate

# View logs
make logs

# Build specific services
make build-frontend
make build-backend
```

### Project Structure

```
quiz-app/
├── web-app/                 # Angular 19 frontend
│   ├── src/app/
│   │   ├── components/      # Quiz components
│   │   ├── store/          # NgRx store
│   │   ├── services/       # API services
│   │   └── models/         # TypeScript models
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/migrations/
│   ├── Dockerfile
│   └── docker-compose.yml
├── database/               # MySQL configuration
│   └── docker-compose.yml
└── Makefile               # Build automation
```

## API Endpoints

### Quiz Generation

- `POST /api/quizzes/generate` - Generate a new quiz
  ```json
  {
  	"topic": "Photosynthesis"
  }
  ```

### Quiz Management

- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/{id}` - Get specific quiz
- `POST /api/quizzes/{id}/submit` - Submit quiz answers
  ```json
  {
  	"answers": ["A", "B", "C", "D", "A"]
  }
  ```

## Database Schema

### Quizzes Table

- `id` - Primary key
- `topic` - Quiz topic
- `questions` - JSON array of questions
- `created_at`, `updated_at` - Timestamps

### Quiz Results Table

- `id` - Primary key
- `quiz_id` - Foreign key to quizzes
- `user_answers` - JSON array of user answers
- `score` - Number of correct answers
- `total_questions` - Total number of questions
- `created_at`, `updated_at` - Timestamps

## Configuration

### Environment Variables

#### Backend (.env)

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=quiz_app
DB_USERNAME=quiz_user
DB_PASSWORD=quiz_password
OPENAI_API_KEY=your_openai_api_key_here
```

#### Database

- **Host**: localhost:3306
- **Database**: quiz_app
- **Username**: quiz_user
- **Password**: quiz_password

## Features in Detail

### AI Quiz Generation

- Uses OpenAI GPT-3.5-turbo for intelligent quiz generation
- Generates 5 multiple-choice questions with 4 options each
- Ensures only one correct answer per question
- Handles various topics and difficulty levels

### State Management

- NgRx store for centralized state management
- Actions, reducers, effects, and selectors
- Real-time UI updates based on state changes
- Error handling and loading states

### User Experience

- Clean, modern interface with gradient backgrounds
- Responsive design for all screen sizes
- Real-time feedback during quiz taking
- Visual indicators for correct/incorrect answers
- Score visualization with color-coded performance

## Troubleshooting

### Common Issues

1. **Database connection failed**

   ```bash
   # Check if MySQL is running
   docker ps
   # Restart database
   cd database && docker-compose restart
   ```

2. **OpenAI API errors**

   - Verify API key is correct
   - Check API quota and billing
   - Ensure network connectivity

3. **Frontend not loading**

   ```bash
   # Rebuild frontend
   make build-frontend
   # Check nginx logs
   docker logs quiz-frontend
   ```

4. **Backend API errors**
   ```bash
   # Check Laravel logs
   cd backend && docker-compose logs app
   # Run migrations
   make migrate
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
