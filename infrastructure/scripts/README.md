# Development Scripts

Utility scripts to simplify common development tasks.

## Prerequisites

- Docker Desktop installed and running
- Bash shell (macOS/Linux) or PowerShell (Windows)
- .NET 8 SDK (for migration scripts - future)
- PostgreSQL client (for data seeding - future)

## Available Scripts

### setup-dev.sh / setup-dev.ps1

Starts the development infrastructure (PostgreSQL, RabbitMQ, Prometheus, Grafana).

**Usage (Linux/macOS):**
```bash
./infrastructure/scripts/setup-dev.sh
```

**Usage (Windows):**
```powershell
.\infrastructure\scripts\setup-dev.ps1
```

**What it does:**
1. Checks if Docker is running
2. Starts all Docker Compose services
3. Waits for services to be healthy
4. Displays service status and access URLs

## Service Access URLs

| Service | URL | Default Credentials |
|---------|-----|---------------------|
| PostgreSQL | localhost:5432 | budgetcoach / budgetcoach |
| RabbitMQ AMQP | localhost:5672 | guest / guest |
| RabbitMQ Management UI | http://localhost:15672 | guest / guest |
| Prometheus | http://localhost:9090 | (no auth) |
| Grafana | http://localhost:3000 | admin / admin |

## Troubleshooting

### Docker not running
**Error:** `Docker is not running`
**Solution:** Start Docker Desktop and wait for it to fully initialize

### Port conflicts
**Error:** `port is already allocated`
**Solution:** Stop any services using ports 5432, 5672, 15672, 9090, 3000
```bash
# Check what's using a port (Linux/macOS)
lsof -i :5432

# Check what's using a port (Windows)
netstat -ano | findstr :5432
```

### Services unhealthy
**Error:** Services show as unhealthy in `docker-compose ps`
**Solution:** Check logs for specific service
```bash
docker-compose logs [service-name]
```

## Common Commands

```bash
# Start services
./infrastructure/scripts/setup-dev.sh

# Stop services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```
