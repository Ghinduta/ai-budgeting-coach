#!/bin/bash
set -e

echo "🚀 Starting AI Budgeting Coach development environment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

# Navigate to repository root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/../.." || exit 1

# Start Docker Compose services
echo "📦 Starting infrastructure services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Development environment ready!"
echo ""
echo "🔗 Service URLs:"
echo "  PostgreSQL:   localhost:5432 (user: budgetcoach, password: budgetcoach)"
echo "  RabbitMQ UI:  http://localhost:15672 (user: guest, password: guest)"
echo "  Prometheus:   http://localhost:9090"
echo "  Grafana:      http://localhost:3000 (user: admin, password: admin)"
echo ""
echo "💡 To stop services: docker-compose down"
