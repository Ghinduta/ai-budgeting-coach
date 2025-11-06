# AI Budgeting Coach Development Environment Setup (Windows)

Write-Host "🚀 Starting AI Budgeting Coach development environment..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Error: Docker is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again" -ForegroundColor Yellow
    exit 1
}

# Navigate to repository root
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptPath\..\.."

# Start Docker Compose services
Write-Host "📦 Starting infrastructure services..." -ForegroundColor Cyan
docker-compose up -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✅ Development environment ready!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Service URLs:" -ForegroundColor Cyan
Write-Host "  PostgreSQL:   localhost:5432 (user: budgetcoach, password: budgetcoach)"
Write-Host "  RabbitMQ UI:  http://localhost:15672 (user: guest, password: guest)"
Write-Host "  Prometheus:   http://localhost:9090"
Write-Host "  Grafana:      http://localhost:3000 (user: admin, password: admin)"
Write-Host ""
Write-Host "💡 To stop services: docker-compose down" -ForegroundColor Yellow
