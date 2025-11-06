# Infrastructure

Infrastructure as code, deployment scripts, and monitoring configurations.

## Folders

### docker/
Docker Compose configurations for local development and production.
- `docker-compose.yml` - Development environment
- `docker-compose.prod.yml` - Production environment
- `init-databases.sql` - Database initialization script
- `.env.example` - Environment variables template

### scripts/
Utility scripts for development and operations.
- `setup-dev.sh` - Start development environment
- `run-migrations.sh` - Run database migrations
- `seed-data.sh` - Seed test data
- `backup-db.sh` - Backup databases
- `deploy.sh` - Deploy to production

### monitoring/
Monitoring and observability configurations.
- `prometheus.yml` - Prometheus scrape config
- `grafana/` - Grafana dashboards
- `alertmanager.yml` - Alert rules

## Quick Start

```bash
# Start development environment
cd infrastructure/docker
docker-compose up -d

# Check service health
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

See individual folder READMEs for detailed instructions.
