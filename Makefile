.PHONY: start stop clean build-frontend build-backend setup-backend migrate

# Start all services
start:
	@echo "Starting AI-Powered Quiz App..."
	@echo "Cleaning up any existing containers..."
	@$(MAKE) stop
	@echo "Checking Laravel backend configuration..."
	@$(MAKE) setup-backend
	@echo "Installing Laravel backend dependencies..."
	cd backend && composer install
	@echo "Starting Laravel backend with MySQL..."
	cd backend && docker compose up -d
	@echo "Waiting for database to be ready..."
	@sleep 15
	@echo "Building and starting Angular frontend..."
	@echo "Removing any existing frontend image to ensure fresh build..."
	docker rmi quiz-frontend || true
	cd web-app && docker build -t quiz-frontend . && docker run -d -p 3000:80 --name quiz-frontend quiz-frontend
	@echo "All services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:8000"
	@echo "Database: localhost:3306"

# Stop all services
stop:
	@echo "Stopping all services..."
	cd backend && docker compose down
	docker stop quiz-frontend || true
	docker rm quiz-frontend || true
	@echo "All services stopped!"

# Clean up everything
clean: stop
	@echo "Cleaning up..."
	cd backend && docker compose down -v
	docker rmi quiz-frontend || true
	docker system prune -f
	@echo "Cleanup complete!"

# Build frontend only
build-frontend:
	@echo "Building Angular frontend..."
	cd web-app && npm run build

# Build backend only
build-backend:
	@echo "Building Laravel backend..."
	cd backend && docker compose build

# Setup Laravel backend
setup-backend:
	@if [ ! -f backend/.env ]; then \
		echo "No .env file found in backend directory."; \
		echo "Do you wish to create one? (y/n)"; \
		read -r response; \
		if [ "$$response" = "y" ] || [ "$$response" = "Y" ]; then \
			echo "Creating .env file from .env.example..."; \
			cp backend/.env.example backend/.env; \
			echo "Updating database configuration for Docker..."; \
			sed -i '' 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/' backend/.env; \
			sed -i '' 's/# DB_HOST=127.0.0.1/DB_HOST=mysql/' backend/.env; \
			sed -i '' 's/# DB_PORT=3306/DB_PORT=3306/' backend/.env; \
			sed -i '' 's/# DB_DATABASE=laravel/DB_DATABASE=quiz_app/' backend/.env; \
			sed -i '' 's/# DB_USERNAME=root/DB_USERNAME=quiz_user/' backend/.env; \
			sed -i '' 's/# DB_PASSWORD=/DB_PASSWORD=quiz_password/' backend/.env; \
			echo "Generating application key..."; \
			cd backend && php artisan key:generate; \
			echo ".env file created successfully!"; \
			echo "Please add your OpenAI API key to backend/.env file:"; \
			echo "OPENAI_API_KEY=your_openai_api_key_here"; \
		else \
			echo "Error: .env file is required. Please copy .env.example to .env and configure it."; \
			exit 1; \
		fi; \
	else \
		echo ".env file found. Checking if APP_KEY is set..."; \
		if ! grep -q "APP_KEY=base64:" backend/.env; then \
			echo "Generating application key..."; \
			cd backend && php artisan key:generate; \
		fi; \
	fi

# Run database migrations
migrate:
	@echo "Running database migrations..."
	cd backend && docker compose exec app php artisan migrate:fresh --seed

# Development mode (with live reload)
dev:
	@echo "Starting development environment..."
	cd backend && docker compose up -d
	@sleep 15
	@echo "Starting Angular dev server..."
	cd web-app && npm start

# Show logs
logs:
	docker compose -f backend/docker-compose.yml logs -f
	docker logs -f quiz-frontend

# Help
help:
	@echo "Available commands:"
	@echo "  start        - Start all services"
	@echo "  stop         - Stop all services"
	@echo "  clean        - Stop and clean up everything"
	@echo "  build-frontend - Build Angular frontend only"
	@echo "  build-backend  - Build Laravel backend only"
	@echo "  setup-backend - Setup Laravel backend (.env, key generation)"
	@echo "  migrate      - Run database migrations"
	@echo "  dev          - Start development environment"
	@echo "  logs         - Show all service logs"
	@echo "  help         - Show this help message"
