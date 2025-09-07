.PHONY: start stop clean build-frontend build-backend migrate

# Start all services
start:
	@echo "Starting AI-Powered Quiz App..."
	@echo "Cleaning up any existing containers..."
	@$(MAKE) stop
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
	@echo "  migrate      - Run database migrations"
	@echo "  dev          - Start development environment"
	@echo "  logs         - Show all service logs"
	@echo "  help         - Show this help message"
