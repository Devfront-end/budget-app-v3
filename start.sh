#!/bin/bash
# Smart Budget - Quick Start Script

echo "🚀 Starting Smart Budget..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start all services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check service status
docker-compose ps

echo ""
echo "✅ Smart Budget is ready!"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:3000"
echo "   Database: localhost:5432 (user: postgres, db: budget_app)"
echo "   Redis:    localhost:6379"
echo ""
echo "📝 Useful commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop services:    docker-compose down"
echo "   Restart:          docker-compose restart"
echo "   Access DB:        docker-compose exec postgres psql -U postgres -d budget_app"
echo ""
