# AI Budgeting Coach - Deployment Plan

**Version:** 1.0
**Date:** 2025-01-06
**Status:** Draft
**Based on:** PRD v1.0, Architecture v1.0, Implementation Plan v1.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Deployment Architecture](#2-deployment-architecture)
3. [Infrastructure Requirements](#3-infrastructure-requirements)
4. [Pre-Deployment Checklist](#4-pre-deployment-checklist)
5. [Deployment Phases](#5-deployment-phases)
6. [Configuration Management](#6-configuration-management)
7. [Security Hardening](#7-security-hardening)
8. [Monitoring & Observability](#8-monitoring--observability)
9. [Backup & Disaster Recovery](#9-backup--disaster-recovery)
10. [Rollback Procedures](#10-rollback-procedures)
11. [Post-Deployment Validation](#11-post-deployment-validation)
12. [Maintenance & Operations](#12-maintenance--operations)

---

## 1. Executive Summary

### 1.1 Deployment Overview

**Goal:** Deploy AI Budgeting Coach MVP to production environment supporting 5-10 beta users.

**Deployment Strategy:** Self-hosted Docker Compose on single VM
**Infrastructure Provider:** DigitalOcean/Hetzner (recommended) or AWS EC2
**Deployment Method:** Automated scripts with CI/CD integration
**Target Environment:** Production single-node deployment
**Downtime Tolerance:** <5 minutes for maintenance windows

### 1.2 Key Success Criteria

- ✅ All 6 microservices running and healthy
- ✅ HTTPS enabled with valid SSL certificate
- ✅ Database backups automated (daily)
- ✅ Monitoring dashboards operational (Grafana)
- ✅ <500ms API response time (p95)
- ✅ >99% uptime SLA
- ✅ Zero critical security vulnerabilities
- ✅ Deployment automation tested and documented

### 1.3 Timeline

| Phase | Duration | Target Completion |
|-------|----------|-------------------|
| Infrastructure Provisioning | 1 day | Week 10, Day 1 |
| Environment Configuration | 1 day | Week 10, Day 2 |
| Initial Deployment | 1 day | Week 10, Day 3 |
| Monitoring Setup | 1 day | Week 10, Day 4 |
| Testing & Validation | 1 day | Week 10, Day 5 |
| Beta User Onboarding | Ongoing | Week 11+ |

**Total Deployment Time:** 5 days

---

## 2. Deployment Architecture

### 2.1 High-Level Architecture

```
                                    ┌────────────────────┐
                                    │   Internet         │
                                    └────────┬───────────┘
                                             │
                                    ┌────────▼───────────┐
                                    │  Cloudflare        │
                                    │  (DNS + CDN)       │
                                    └────────┬───────────┘
                                             │ HTTPS (443)
                    ┌────────────────────────▼─────────────────────────┐
                    │          Production VM (4 vCPU, 8GB RAM)         │
                    │  ┌────────────────────────────────────────────┐  │
                    │  │  Nginx Reverse Proxy (Let's Encrypt SSL)  │  │
                    │  └───┬────────────────────────────────────┬───┘  │
                    │      │                                    │       │
                    │  ┌───▼────────────────┐         ┌────────▼────┐  │
                    │  │  React Frontend    │         │  API Gateway│  │
                    │  │  (Static Files)    │         │  (YARP)     │  │
                    │  └────────────────────┘         └────┬────────┘  │
                    │                                      │            │
                    │  ┌───────────────────────────────────▼──────────┐│
                    │  │     6 Microservices (Docker Compose)         ││
                    │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐     ││
                    │  │  │ User     │ │Transaction│ │  AI      │     ││
                    │  │  │ Service  │ │ Service   │ │ Service  │     ││
                    │  │  └──────────┘ └──────────┘ └──────────┘     ││
                    │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐     ││
                    │  │  │ Budget   │ │Notification│              ││
                    │  │  │ Service  │ │ Service   │               ││
                    │  │  └──────────┘ └──────────┘                 ││
                    │  └────────┬──────────────────┬─────────────────┘│
                    │           │                  │                   │
                    │  ┌────────▼────────┐  ┌──────▼────────┐         │
                    │  │  PostgreSQL     │  │   RabbitMQ    │         │
                    │  │  (6 databases)  │  │   (Message    │         │
                    │  │                 │  │    Broker)    │         │
                    │  └─────────────────┘  └───────────────┘         │
                    │                                                  │
                    │  ┌──────────────────────────────────────────┐   │
                    │  │  Monitoring Stack (Prometheus + Grafana) │   │
                    │  └──────────────────────────────────────────┘   │
                    └──────────────────────────────────────────────────┘
```

### 2.2 Container Architecture

**Docker Compose Services:**
1. **nginx** - Reverse proxy and static file serving
2. **api-gateway** - YARP routing and authentication
3. **user-service** - User management and auth
4. **transaction-service** - Transaction CRUD and CSV import
5. **ai-service** - AI categorization and insights
6. **budget-service** - Budget tracking and alerts
7. **notification-service** - Email and in-app notifications
8. **postgres** - PostgreSQL database server (6 databases)
9. **rabbitmq** - Message broker
10. **prometheus** - Metrics collection
11. **grafana** - Monitoring dashboards

**Network Configuration:**
- Internal network: `budgetcoach-network` (bridge driver)
- Exposed ports: 80 (HTTP), 443 (HTTPS)
- Internal service-to-service communication only

### 2.3 Domain & DNS Configuration

**Production Domain:** `aibudgetcoach.com` (example)

**DNS Records:**
```
Type    Name                    Value                   TTL
────────────────────────────────────────────────────────────
A       @                       <VM_IP_ADDRESS>         300
A       www                     <VM_IP_ADDRESS>         300
CNAME   api                     aibudgetcoach.com       300
TXT     @                       "v=spf1 include:sendgrid.net ~all"
```

**Cloudflare Settings:**
- Proxy status: Enabled (orange cloud)
- SSL/TLS mode: Full (strict)
- Always use HTTPS: Enabled
- HTTP Strict Transport Security: Enabled
- Minimum TLS Version: 1.2

---

## 3. Infrastructure Requirements

### 3.1 VM Specifications

**Recommended Provider:** DigitalOcean or Hetzner Cloud

**Minimum Requirements:**
- **CPU:** 4 vCPU
- **RAM:** 8 GB
- **Storage:** 100 GB SSD
- **Network:** 4 TB transfer/month
- **OS:** Ubuntu 22.04 LTS (64-bit)
- **Cost:** ~$40/month

**Production VM Configuration:**
```bash
# Hostname
budgetcoach-prod-01

# Firewall Rules
Port 22   (SSH)   - Source: Your IP only
Port 80   (HTTP)  - Source: 0.0.0.0/0 (redirects to HTTPS)
Port 443  (HTTPS) - Source: 0.0.0.0/0
```

### 3.2 External Services

#### OpenAI API
- **Purpose:** AI categorization and insights
- **Plan:** Pay-as-you-go (GPT-4 Turbo)
- **Cost:** ~$20-50/month
- **Rate Limit:** 500 requests/min
- **Required:** API key with GPT-4 access

#### SendGrid (Email)
- **Purpose:** Budget alerts and notifications
- **Plan:** Free tier (100 emails/day)
- **Cost:** $0/month for MVP
- **Rate Limit:** 100 emails/day
- **Required:** API key and verified sender domain

#### Cloudflare
- **Purpose:** DNS, CDN, DDoS protection
- **Plan:** Free tier
- **Cost:** $0/month
- **Required:** Domain nameservers pointed to Cloudflare

### 3.3 Software Dependencies

**Installed on VM:**
- Docker Engine 24+
- Docker Compose v2.20+
- Certbot (Let's Encrypt)
- Git
- UFW (Uncomplicated Firewall)
- Fail2ban
- Unattended-upgrades

---

## 4. Pre-Deployment Checklist

### 4.1 Infrastructure Readiness

- [ ] VM provisioned with correct specifications
- [ ] Static IP address assigned
- [ ] Domain name registered and DNS configured
- [ ] SSH key-based authentication configured
- [ ] Firewall rules applied
- [ ] Docker and Docker Compose installed
- [ ] SSL certificate obtained (Let's Encrypt)

### 4.2 Code Readiness

- [ ] All Epic 1-9 stories completed
- [ ] Unit test coverage >80%
- [ ] Integration tests passing
- [ ] E2E tests passing for critical flows
- [ ] Security audit completed (OWASP checklist)
- [ ] Performance tests passing (<500ms p95)
- [ ] Code review completed
- [ ] Version tagged in Git (v1.0.0-rc1)

### 4.3 Configuration Readiness

- [ ] Production environment variables documented
- [ ] OpenAI API key obtained
- [ ] SendGrid API key obtained and sender verified
- [ ] JWT secret generated (256-bit random)
- [ ] Database passwords generated (32-char random)
- [ ] RabbitMQ credentials configured
- [ ] CORS origins configured for production domain
- [ ] Rate limiting thresholds configured

### 4.4 Documentation Readiness

- [ ] Deployment runbook completed
- [ ] Rollback procedures documented
- [ ] Monitoring alert runbook completed
- [ ] User documentation published
- [ ] API documentation (Swagger) accessible
- [ ] Privacy policy and terms of service finalized

---

## 5. Deployment Phases

### Phase 1: Initial VM Setup (Day 1)

**Duration:** 4 hours

#### 1.1 Provision VM

```bash
# Create VM via provider dashboard or CLI
# Example: DigitalOcean Droplet
doctl compute droplet create budgetcoach-prod-01 \
  --image ubuntu-22-04-x64 \
  --size s-4vcpu-8gb \
  --region nyc3 \
  --ssh-keys <YOUR_SSH_KEY_ID>

# Note the assigned IP address
export VM_IP=<assigned_ip>
```

#### 1.2 Initial Server Configuration

```bash
# SSH into server
ssh root@$VM_IP

# Update system packages
apt update && apt upgrade -y

# Set hostname
hostnamectl set-hostname budgetcoach-prod-01

# Create deployment user
adduser budgetcoach
usermod -aG sudo budgetcoach
mkdir -p /home/budgetcoach/.ssh
cp /root/.ssh/authorized_keys /home/budgetcoach/.ssh/
chown -R budgetcoach:budgetcoach /home/budgetcoach/.ssh
chmod 700 /home/budgetcoach/.ssh
chmod 600 /home/budgetcoach/.ssh/authorized_keys

# Disable root login
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd
```

#### 1.3 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Add budgetcoach user to docker group
usermod -aG docker budgetcoach

# Install Docker Compose
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Verify installation
docker --version
docker compose version
```

#### 1.4 Configure Firewall

```bash
# Install and configure UFW
apt install ufw -y

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (change port if using non-standard)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Verify rules
ufw status verbose
```

#### 1.5 Install Security Tools

```bash
# Install fail2ban (brute force protection)
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban

# Install unattended-upgrades (automatic security updates)
apt install unattended-upgrades -y
dpkg-reconfigure --priority=low unattended-upgrades
```

---

### Phase 2: Application Deployment (Day 2-3)

**Duration:** 8 hours

#### 2.1 Clone Repository

```bash
# Switch to deployment user
su - budgetcoach

# Clone repository
cd ~
git clone https://github.com/yourusername/ai-budgeting-coach.git
cd ai-budgeting-coach

# Checkout production tag
git checkout v1.0.0-rc1
```

#### 2.2 Configure Environment Variables

```bash
# Create production environment file
cat > .env.production <<EOF
# Application Environment
NODE_ENV=production
ASPNETCORE_ENVIRONMENT=Production

# Domain Configuration
DOMAIN=aibudgetcoach.com
API_BASE_URL=https://api.aibudgetcoach.com

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 64)
JWT_ISSUER=aibudgetcoach.com
JWT_AUDIENCE=aibudgetcoach.com
JWT_EXPIRES_IN=3600
REFRESH_TOKEN_EXPIRES_IN=604800

# Database Configuration
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=budgetcoach
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# RabbitMQ Configuration
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=budgetcoach
RABBITMQ_PASSWORD=$(openssl rand -base64 32)
RABBITMQ_VHOST=/budgetcoach

# OpenAI Configuration
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# SendGrid Configuration
SENDGRID_API_KEY=<YOUR_SENDGRID_API_KEY>
SENDGRID_FROM_EMAIL=noreply@aibudgetcoach.com
SENDGRID_FROM_NAME=AI Budgeting Coach

# CORS Configuration
CORS_ORIGINS=https://aibudgetcoach.com,https://www.aibudgetcoach.com

# Rate Limiting
RATE_LIMIT_GENERAL=10
RATE_LIMIT_AUTH=5
RATE_LIMIT_WINDOW=60

# Monitoring
PROMETHEUS_ENABLED=true
GRAFANA_ADMIN_PASSWORD=$(openssl rand -base64 32)

# Logging
LOG_LEVEL=Information
SERILOG_MINIMUM_LEVEL=Information
EOF

# Secure the environment file
chmod 600 .env.production
```

#### 2.3 Build Docker Images

```bash
# Build all service images
docker compose -f docker-compose.prod.yml build

# Verify images
docker images | grep budgetcoach
```

#### 2.4 Initialize Databases

```bash
# Start only PostgreSQL initially
docker compose -f docker-compose.prod.yml up -d postgres

# Wait for PostgreSQL to be ready
sleep 10

# Run database migrations for each service
docker compose -f docker-compose.prod.yml run --rm user-service \
  dotnet ef database update

docker compose -f docker-compose.prod.yml run --rm transaction-service \
  dotnet ef database update

docker compose -f docker-compose.prod.yml run --rm ai-service \
  dotnet ef database update

docker compose -f docker-compose.prod.yml run --rm budget-service \
  dotnet ef database update

docker compose -f docker-compose.prod.yml run --rm notification-service \
  dotnet ef database update

# Verify databases created
docker exec -it budgetcoach-postgres psql -U budgetcoach -l
```

#### 2.5 Deploy All Services

```bash
# Start all services
docker compose -f docker-compose.prod.yml up -d

# Verify all containers running
docker compose -f docker-compose.prod.yml ps

# Check logs for errors
docker compose -f docker-compose.prod.yml logs --tail=100
```

---

### Phase 3: SSL & Nginx Configuration (Day 3)

**Duration:** 2 hours

#### 3.1 Install Certbot

```bash
# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y
```

#### 3.2 Obtain SSL Certificate

```bash
# Stop nginx temporarily if running
docker compose -f docker-compose.prod.yml stop nginx

# Obtain certificate
sudo certbot certonly --standalone \
  -d aibudgetcoach.com \
  -d www.aibudgetcoach.com \
  -d api.aibudgetcoach.com \
  --non-interactive \
  --agree-tos \
  --email admin@aibudgetcoach.com

# Certificates stored at:
# /etc/letsencrypt/live/aibudgetcoach.com/fullchain.pem
# /etc/letsencrypt/live/aibudgetcoach.com/privkey.pem
```

#### 3.3 Configure Nginx

```bash
# Update nginx configuration with SSL paths
cat > infrastructure/nginx/nginx.prod.conf <<EOF
# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name aibudgetcoach.com www.aibudgetcoach.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS - Frontend
server {
    listen 443 ssl http2;
    server_name aibudgetcoach.com www.aibudgetcoach.com;

    ssl_certificate /etc/letsencrypt/live/aibudgetcoach.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aibudgetcoach.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend static files
    location / {
        root /usr/share/nginx/html;
        try_files \$uri \$uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}

# HTTPS - API Gateway
server {
    listen 443 ssl http2;
    server_name api.aibudgetcoach.com;

    ssl_certificate /etc/letsencrypt/live/aibudgetcoach.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aibudgetcoach.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to API Gateway
    location / {
        proxy_pass http://api-gateway:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # WebSocket support (if needed in future)
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Restart nginx
docker compose -f docker-compose.prod.yml restart nginx
```

#### 3.4 Configure Auto-Renewal

```bash
# Create renewal script
sudo cat > /usr/local/bin/renew-certs.sh <<EOF
#!/bin/bash
certbot renew --quiet --deploy-hook "docker compose -f /home/budgetcoach/ai-budgeting-coach/docker-compose.prod.yml restart nginx"
EOF

sudo chmod +x /usr/local/bin/renew-certs.sh

# Add to crontab (runs daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/renew-certs.sh") | crontab -
```

---

### Phase 4: Monitoring Setup (Day 4)

**Duration:** 4 hours

#### 4.1 Configure Prometheus

```bash
# Prometheus configuration already in repo at:
# infrastructure/prometheus/prometheus.yml

# Verify Prometheus targets
curl http://localhost:9090/api/v1/targets
```

#### 4.2 Configure Grafana Dashboards

```bash
# Access Grafana
open https://aibudgetcoach.com:3000

# Login with admin credentials from .env.production
# Username: admin
# Password: <GRAFANA_ADMIN_PASSWORD>

# Import pre-configured dashboards:
# 1. System Metrics Dashboard (infrastructure/grafana/dashboards/system.json)
# 2. API Metrics Dashboard (infrastructure/grafana/dashboards/api.json)
# 3. RabbitMQ Dashboard (infrastructure/grafana/dashboards/rabbitmq.json)

# Configure data source
# Add Prometheus data source: http://prometheus:9090
```

#### 4.3 Configure Alerting

```bash
# Configure Prometheus alert rules
cat > infrastructure/prometheus/alerts.yml <<EOF
groups:
  - name: budgetcoach_alerts
    interval: 30s
    rules:
      # High Error Rate
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "{{ \$labels.service }} has error rate above 5%"

      # High API Latency
      - alert: HighAPILatency
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High API latency detected"
          description: "P95 latency is {{ \$value }}s"

      # Service Down
      - alert: ServiceDown
        expr: up == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "{{ \$labels.job }} is unreachable"

      # High Memory Usage
      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "{{ \$labels.container }} using >90% memory"

      # Disk Space Low
      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space running low"
          description: "Less than 20% disk space remaining"

      # RabbitMQ Queue Backlog
      - alert: RabbitMQQueueBacklog
        expr: rabbitmq_queue_messages > 1000
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "RabbitMQ queue backlog"
          description: "Queue {{ \$labels.queue }} has {{ \$value }} messages"
EOF

# Configure Alertmanager (optional for MVP, can use Grafana alerts)
# For email alerts via SendGrid, configure in Grafana notification channels
```

#### 4.4 Setup Log Aggregation

```bash
# For MVP, use centralized Docker logging
# Configure Docker daemon for JSON file logging
sudo cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "5",
    "labels": "service"
  }
}
EOF

sudo systemctl restart docker

# View aggregated logs
docker compose -f docker-compose.prod.yml logs -f --tail=100

# For production Phase 2, consider ELK stack or Seq
```

---

### Phase 5: Backup Configuration (Day 4)

**Duration:** 2 hours

#### 5.1 Database Backup Script

```bash
# Create backup directory
mkdir -p /home/budgetcoach/backups

# Create backup script
cat > /home/budgetcoach/backups/backup-databases.sh <<'EOF'
#!/bin/bash
set -e

BACKUP_DIR="/home/budgetcoach/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Load environment variables
export $(cat /home/budgetcoach/ai-budgeting-coach/.env.production | xargs)

# Backup all databases
docker exec budgetcoach-postgres pg_dumpall -U budgetcoach | gzip > "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Backup RabbitMQ definitions
docker exec budgetcoach-rabbitmq rabbitmqctl export_definitions /tmp/rabbitmq_definitions.json
docker cp budgetcoach-rabbitmq:/tmp/rabbitmq_definitions.json "$BACKUP_DIR/rabbitmq_definitions_$TIMESTAMP.json"

# Delete old backups
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "rabbitmq_definitions_*.json" -mtime +$RETENTION_DAYS -delete

# Upload to cloud storage (optional)
# aws s3 sync "$BACKUP_DIR" s3://budgetcoach-backups/

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
EOF

chmod +x /home/budgetcoach/backups/backup-databases.sh
```

#### 5.2 Schedule Automated Backups

```bash
# Add to crontab (daily at 3 AM)
(crontab -l 2>/dev/null; echo "0 3 * * * /home/budgetcoach/backups/backup-databases.sh >> /home/budgetcoach/backups/backup.log 2>&1") | crontab -

# Verify crontab
crontab -l
```

#### 5.3 Restore Procedure Documentation

```bash
# Create restore script
cat > /home/budgetcoach/backups/restore-databases.sh <<'EOF'
#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -lh /home/budgetcoach/backups/backup_*.sql.gz
    exit 1
fi

BACKUP_FILE="$1"

# Stop services
cd /home/budgetcoach/ai-budgeting-coach
docker compose -f docker-compose.prod.yml stop api-gateway user-service transaction-service ai-service budget-service notification-service

# Restore database
gunzip -c "$BACKUP_FILE" | docker exec -i budgetcoach-postgres psql -U budgetcoach

# Start services
docker compose -f docker-compose.prod.yml start api-gateway user-service transaction-service ai-service budget-service notification-service

echo "Database restored from $BACKUP_FILE"
EOF

chmod +x /home/budgetcoach/backups/restore-databases.sh
```

---

## 6. Configuration Management

### 6.1 Environment-Specific Configurations

**Development (.env.development)**
```bash
NODE_ENV=development
ASPNETCORE_ENVIRONMENT=Development
DOMAIN=localhost
API_BASE_URL=http://localhost:8080
LOG_LEVEL=Debug
```

**Staging (.env.staging)**
```bash
NODE_ENV=staging
ASPNETCORE_ENVIRONMENT=Staging
DOMAIN=staging.aibudgetcoach.com
API_BASE_URL=https://api-staging.aibudgetcoach.com
LOG_LEVEL=Information
```

**Production (.env.production)**
```bash
NODE_ENV=production
ASPNETCORE_ENVIRONMENT=Production
DOMAIN=aibudgetcoach.com
API_BASE_URL=https://api.aibudgetcoach.com
LOG_LEVEL=Warning
```

### 6.2 Secrets Management

**Never commit secrets to Git:**
- JWT secrets
- Database passwords
- API keys (OpenAI, SendGrid)
- RabbitMQ credentials

**Storage Recommendations:**
1. **Development:** `.env` files (gitignored)
2. **Production:** Environment variables on server (secured with file permissions)
3. **Future:** HashiCorp Vault or AWS Secrets Manager

### 6.3 Feature Flags

```bash
# Add feature flags to environment
FEATURE_AI_INSIGHTS_ENABLED=true
FEATURE_CSV_IMPORT_ENABLED=true
FEATURE_EMAIL_NOTIFICATIONS_ENABLED=true
FEATURE_BUDGET_ALERTS_ENABLED=true
```

---

## 7. Security Hardening

### 7.1 Server Hardening Checklist

- [x] SSH key-based authentication only (no passwords)
- [x] Root login disabled
- [x] UFW firewall configured
- [x] Fail2ban installed and configured
- [x] Automatic security updates enabled
- [ ] Change default SSH port (optional but recommended)
- [ ] Configure SSH rate limiting
- [ ] Install and configure AppArmor or SELinux
- [ ] Disable unused services

#### 7.1.1 SSH Hardening

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Recommended changes:
Port 2222  # Change from default 22
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
MaxSessions 2
ClientAliveInterval 300
ClientAliveCountMax 2

# Restart SSH
sudo systemctl restart sshd

# Update firewall
sudo ufw delete allow 22/tcp
sudo ufw allow 2222/tcp
```

### 7.2 Application Security

#### 7.2.1 JWT Configuration

```bash
# Generate secure JWT secret (256-bit)
JWT_SECRET=$(openssl rand -base64 64)

# Token expiration
JWT_EXPIRES_IN=3600  # 1 hour
REFRESH_TOKEN_EXPIRES_IN=604800  # 7 days
```

#### 7.2.2 Database Security

```bash
# Strong database passwords
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# Restrict database access to internal network only
# In docker-compose.prod.yml:
postgres:
  networks:
    - internal
  # NO port exposure to host
```

#### 7.2.3 Rate Limiting

**Nginx Rate Limiting:**
```nginx
# Add to nginx.conf
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

server {
    location /api/v1/auth {
        limit_req zone=auth burst=5 nodelay;
    }

    location /api {
        limit_req zone=general burst=20 nodelay;
    }
}
```

**API Gateway Rate Limiting:**
```csharp
// In API Gateway Startup.cs
services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            }));
});
```

### 7.3 OWASP Top 10 Mitigations

| Vulnerability | Mitigation |
|---------------|------------|
| Injection | Parameterized queries (EF Core), input validation |
| Broken Authentication | JWT tokens, bcrypt hashing, MFA (Phase 2) |
| Sensitive Data Exposure | HTTPS only, encrypted passwords, secure cookies |
| XML External Entities | Not applicable (JSON only) |
| Broken Access Control | User ID from JWT, authorization policies |
| Security Misconfiguration | Security headers, secure defaults, regular updates |
| XSS | React default escaping, Content-Security-Policy header |
| Insecure Deserialization | JSON.NET with type handling restrictions |
| Using Components with Known Vulnerabilities | Dependabot alerts, regular dependency updates |
| Insufficient Logging & Monitoring | Structured logging, Grafana alerts |

### 7.4 Security Headers

```nginx
# Add to nginx.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.aibudgetcoach.com; frame-ancestors 'self';" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

---

## 8. Monitoring & Observability

### 8.1 Metrics Collection

**Prometheus Metrics Exposed:**
- HTTP request count and duration (per endpoint, status code)
- Database query performance
- RabbitMQ queue depth and message rate
- AI API call count and latency
- System resources (CPU, memory, disk)
- Custom business metrics (transactions imported, budgets created)

**Service Health Checks:**
```csharp
// In each service Startup.cs
services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>()
    .AddRabbitMQ()
    .AddCheck<OpenAIHealthCheck>("openai");
```

### 8.2 Grafana Dashboards

**Dashboard 1: System Overview**
- CPU usage per container
- Memory usage per container
- Disk I/O and space
- Network traffic
- Container restart count

**Dashboard 2: API Performance**
- Request rate (requests/sec)
- Response time (p50, p95, p99)
- Error rate (4xx, 5xx)
- Top 10 slowest endpoints
- Top 10 endpoints by traffic

**Dashboard 3: RabbitMQ**
- Queue depth
- Message rate (published/consumed)
- Consumer count
- Dead letter queue depth
- Connection count

**Dashboard 4: Business Metrics**
- Active users (DAU, MAU)
- Transactions created per day
- CSV imports per day
- AI categorizations per day
- Budget alerts triggered
- Average AI confidence score

### 8.3 Alerting Rules

**Critical Alerts (Immediate Action Required):**
- Any service down for >2 minutes
- Error rate >5% for >5 minutes
- P95 latency >1 second for >5 minutes
- Database connection failures
- RabbitMQ connection failures
- Disk space <10%

**Warning Alerts (Monitor Closely):**
- Error rate >2% for >10 minutes
- P95 latency >500ms for >10 minutes
- Memory usage >80% for >10 minutes
- RabbitMQ queue backlog >1000 messages
- Disk space <20%
- SSL certificate expiring in <30 days

**Notification Channels:**
- Email (via SendGrid)
- Slack (optional, configure webhook)
- PagerDuty (Phase 2, for on-call rotation)

### 8.4 Logging Strategy

**Log Levels:**
- **Trace:** Detailed debugging (development only)
- **Debug:** Diagnostic information (development/staging)
- **Information:** General application flow (production)
- **Warning:** Unexpected but handled situations
- **Error:** Errors and exceptions
- **Critical:** Critical failures requiring immediate attention

**Structured Logging Fields:**
```json
{
  "timestamp": "2025-01-06T10:30:45.123Z",
  "level": "Information",
  "message": "Transaction created successfully",
  "service": "transaction-service",
  "correlationId": "abc123-def456",
  "userId": "user-789",
  "transactionId": "txn-101112",
  "duration": 45
}
```

**Log Retention:**
- Development: 7 days
- Staging: 30 days
- Production: 90 days

---

## 9. Backup & Disaster Recovery

### 9.1 Backup Strategy

**What to Backup:**
1. PostgreSQL databases (all 6)
2. RabbitMQ definitions (exchanges, queues, bindings)
3. Application configuration files
4. SSL certificates
5. Grafana dashboards and data sources

**Backup Schedule:**
- Daily: Full database backup (3 AM)
- Weekly: Configuration files (Sunday 4 AM)
- Monthly: Archive to long-term storage

**Backup Retention:**
- Daily backups: 30 days
- Weekly backups: 90 days
- Monthly backups: 1 year

### 9.2 Disaster Recovery Plan

**RTO (Recovery Time Objective):** 4 hours
**RPO (Recovery Point Objective):** 24 hours (daily backups)

#### 9.2.1 Complete Server Failure

**Recovery Steps:**
1. Provision new VM with same specifications
2. Restore from latest backup
3. Update DNS A records to new IP
4. Wait for DNS propagation (5-60 minutes)
5. Verify all services healthy

**Estimated Time:** 3-4 hours

#### 9.2.2 Database Corruption

**Recovery Steps:**
1. Stop application services
2. Identify corrupted database
3. Restore from latest backup
4. Replay transaction logs if available
5. Restart application services
6. Verify data integrity

**Estimated Time:** 1-2 hours

#### 9.2.3 Accidental Data Deletion

**Recovery Steps:**
1. Identify affected data and timestamp
2. Stop writes to affected tables
3. Restore database to point-in-time before deletion
4. Export deleted records
5. Re-import records to production database
6. Verify data integrity

**Estimated Time:** 30 minutes - 2 hours

### 9.3 Backup Testing

**Quarterly Disaster Recovery Drills:**
- Q1: Test database restore
- Q2: Test full server recovery
- Q3: Test point-in-time recovery
- Q4: Test configuration restore

---

## 10. Rollback Procedures

### 10.1 Rollback Triggers

**When to Rollback:**
- Critical bugs affecting core functionality
- Security vulnerabilities discovered
- Performance degradation >50%
- Error rate >10%
- Database migration failures
- Service downtime >15 minutes

### 10.2 Rollback Procedure

#### 10.2.1 Application Rollback

```bash
# 1. Identify previous working version
git tag -l  # List all tags

# 2. Checkout previous version
cd /home/budgetcoach/ai-budgeting-coach
git fetch --all
git checkout v1.0.0-rc1  # Previous stable version

# 3. Rebuild images
docker compose -f docker-compose.prod.yml build

# 4. Stop current services
docker compose -f docker-compose.prod.yml down

# 5. Start services with previous version
docker compose -f docker-compose.prod.yml up -d

# 6. Verify health
docker compose -f docker-compose.prod.yml ps
curl https://api.aibudgetcoach.com/health

# 7. Monitor logs for errors
docker compose -f docker-compose.prod.yml logs -f --tail=100
```

**Estimated Time:** 5-10 minutes

#### 10.2.2 Database Migration Rollback

```bash
# If migration already applied, rollback to previous version
docker compose -f docker-compose.prod.yml exec user-service \
  dotnet ef database update <PreviousMigrationName>

# If migration not yet applied, cancel deployment
docker compose -f docker-compose.prod.yml down
git checkout v1.0.0-rc1
docker compose -f docker-compose.prod.yml up -d
```

**Estimated Time:** 2-5 minutes

### 10.3 Rollback Communication

**Incident Response Template:**
```
Subject: [INCIDENT] Rollback to v1.0.0-rc1

Severity: High
Status: Resolved
Affected Service: All services
Downtime: 5 minutes

Issue:
- [Brief description of issue]

Actions Taken:
- Rolled back to v1.0.0-rc1
- Verified all services healthy
- Monitoring for further issues

Next Steps:
- Root cause analysis
- Fix identified in development
- Deploy fix in next release

Timeline:
- 10:30 AM: Issue detected
- 10:35 AM: Rollback initiated
- 10:40 AM: Rollback completed
- 10:45 AM: Services verified healthy
```

---

## 11. Post-Deployment Validation

### 11.1 Smoke Tests

**Automated Smoke Test Script:**
```bash
#!/bin/bash
set -e

BASE_URL="https://api.aibudgetcoach.com"

echo "Running smoke tests..."

# Test 1: Health Check
echo "Test 1: Health Check"
curl -f "$BASE_URL/health" || exit 1

# Test 2: User Registration
echo "Test 2: User Registration"
REGISTER_RESPONSE=$(curl -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User"
  }')
echo $REGISTER_RESPONSE | jq .

# Test 3: User Login
echo "Test 3: User Login"
LOGIN_RESPONSE=$(curl -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }')
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
echo "Token: $TOKEN"

# Test 4: Get Profile
echo "Test 4: Get Profile"
curl -f "$BASE_URL/api/v1/users/profile" \
  -H "Authorization: Bearer $TOKEN" || exit 1

# Test 5: Create Transaction
echo "Test 5: Create Transaction"
curl -f -X POST "$BASE_URL/api/v1/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-06",
    "amount": -50.00,
    "merchant": "Test Store",
    "account": "Checking"
  }' || exit 1

echo "All smoke tests passed!"
```

### 11.2 Performance Validation

**Load Test Script (k6):**
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 10 },  // Ramp up to 10 users
    { duration: '5m', target: 10 },  // Stay at 10 users
    { duration: '2m', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],     // Error rate < 1%
  },
};

export default function () {
  // Test transaction list endpoint
  const res = http.get('https://api.aibudgetcoach.com/api/v1/transactions', {
    headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN}` },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

**Run Load Test:**
```bash
k6 run load-test.js
```

### 11.3 Security Validation

**OWASP ZAP Scan:**
```bash
# Pull OWASP ZAP Docker image
docker pull owasp/zap2docker-stable

# Run baseline scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://aibudgetcoach.com \
  -r zap-report.html

# Review report
open zap-report.html
```

**SSL Labs Test:**
```bash
# Manual test via browser
open https://www.ssllabs.com/ssltest/analyze.html?d=aibudgetcoach.com

# Expected Grade: A or A+
```

### 11.4 Monitoring Validation

**Checklist:**
- [ ] Prometheus scraping all targets
- [ ] Grafana dashboards displaying data
- [ ] Alert rules configured and testing
- [ ] Log aggregation working
- [ ] Health check endpoints returning 200
- [ ] RabbitMQ management UI accessible
- [ ] All containers showing as healthy

---

## 12. Maintenance & Operations

### 12.1 Regular Maintenance Tasks

**Daily:**
- Review monitoring dashboards (5 minutes)
- Check for critical alerts
- Verify backup completed successfully

**Weekly:**
- Review application logs for warnings/errors (30 minutes)
- Check disk space and resource usage
- Review Grafana metrics trends
- Update dependencies (if security patches available)

**Monthly:**
- Security audit (OWASP ZAP scan)
- Performance review and optimization
- Backup restore drill
- Update SSL certificates (if needed)
- Review and clean up old backups
- Database vacuum and reindex

**Quarterly:**
- Full disaster recovery drill
- Infrastructure cost review
- Capacity planning review
- Security penetration test
- Dependency major version updates

### 12.2 Scaling Considerations

**When to Scale:**
- CPU usage consistently >70%
- Memory usage consistently >75%
- API response time p95 >500ms
- RabbitMQ queue backlog >5000 messages
- User count >50 active users

**Horizontal Scaling Options (Phase 2):**
1. **Multi-node Docker Swarm** or **Kubernetes**
2. **Database read replicas** (PostgreSQL streaming replication)
3. **RabbitMQ cluster** (3-node cluster)
4. **CDN for frontend** (Cloudflare or CloudFront)
5. **Load balancer** (Nginx with multiple API Gateway instances)

### 12.3 Incident Response

**Severity Levels:**

**P0 - Critical (Response: Immediate)**
- All services down
- Data loss or corruption
- Security breach
- Response: Drop everything, all hands on deck

**P1 - High (Response: <1 hour)**
- Single service down affecting core features
- Elevated error rate (>5%)
- Performance degradation (>50% slower)
- Response: Prioritize investigation and fix

**P2 - Medium (Response: <4 hours)**
- Non-critical feature broken
- Moderate error rate (2-5%)
- Minor performance degradation
- Response: Fix in next deployment window

**P3 - Low (Response: <24 hours)**
- Minor bugs with workarounds
- UI issues
- Non-critical features
- Response: Add to backlog, fix in next sprint

**Incident Response Workflow:**
1. **Detect:** Alert triggered or user report
2. **Triage:** Assess severity and impact
3. **Communicate:** Notify stakeholders
4. **Investigate:** Identify root cause
5. **Mitigate:** Implement temporary fix or rollback
6. **Resolve:** Deploy permanent fix
7. **Document:** Write post-mortem
8. **Review:** Identify improvements to prevent recurrence

### 12.4 Cost Monitoring

**Monthly Cost Breakdown (Estimated):**
- VM hosting: $40
- Domain registration: $1.25/month ($15/year)
- OpenAI API: $20-50
- SendGrid: $0 (free tier)
- SSL certificate: $0 (Let's Encrypt)
- **Total:** ~$60-90/month

**Cost Optimization Tips:**
- Monitor OpenAI API usage, implement aggressive caching
- Use free tiers where possible (SendGrid, Cloudflare)
- Consider reserved VM instances for long-term (10-30% discount)
- Optimize Docker image sizes to reduce storage costs

---

## Appendix A: Docker Compose Production Configuration

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: budgetcoach-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infrastructure/nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./frontend/dist:/usr/share/nginx/html:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    networks:
      - budgetcoach-network
    depends_on:
      - api-gateway

  api-gateway:
    build:
      context: ./services/ApiGateway
      dockerfile: Dockerfile
    container_name: budgetcoach-api-gateway
    restart: unless-stopped
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    env_file:
      - .env.production
    networks:
      - budgetcoach-network
    depends_on:
      - user-service
      - transaction-service
      - ai-service
      - budget-service
      - notification-service

  user-service:
    build:
      context: ./services/UserService
      dockerfile: Dockerfile
    container_name: budgetcoach-user-service
    restart: unless-stopped
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    env_file:
      - .env.production
    networks:
      - budgetcoach-network
    depends_on:
      - postgres
      - rabbitmq

  transaction-service:
    build:
      context: ./services/TransactionService
      dockerfile: Dockerfile
    container_name: budgetcoach-transaction-service
    restart: unless-stopped
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    env_file:
      - .env.production
    networks:
      - budgetcoach-network
    depends_on:
      - postgres
      - rabbitmq

  ai-service:
    build:
      context: ./services/AIService
      dockerfile: Dockerfile
    container_name: budgetcoach-ai-service
    restart: unless-stopped
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    env_file:
      - .env.production
    networks:
      - budgetcoach-network
    depends_on:
      - postgres
      - rabbitmq

  budget-service:
    build:
      context: ./services/BudgetService
      dockerfile: Dockerfile
    container_name: budgetcoach-budget-service
    restart: unless-stopped
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    env_file:
      - .env.production
    networks:
      - budgetcoach-network
    depends_on:
      - postgres
      - rabbitmq

  notification-service:
    build:
      context: ./services/NotificationService
      dockerfile: Dockerfile
    container_name: budgetcoach-notification-service
    restart: unless-stopped
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    env_file:
      - .env.production
    networks:
      - budgetcoach-network
    depends_on:
      - postgres
      - rabbitmq

  postgres:
    image: postgres:16-alpine
    container_name: budgetcoach-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./infrastructure/postgres/init-databases.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - budgetcoach-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    container_name: budgetcoach-rabbitmq
    restart: unless-stopped
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
      RABBITMQ_DEFAULT_VHOST: ${RABBITMQ_VHOST}
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    networks:
      - budgetcoach-network
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  prometheus:
    image: prom/prometheus:latest
    container_name: budgetcoach-prometheus
    restart: unless-stopped
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    volumes:
      - ./infrastructure/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./infrastructure/prometheus/alerts.yml:/etc/prometheus/alerts.yml:ro
      - prometheus-data:/prometheus
    networks:
      - budgetcoach-network

  grafana:
    image: grafana/grafana:latest
    container_name: budgetcoach-grafana
    restart: unless-stopped
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_ADMIN_PASSWORD}
      GF_SERVER_ROOT_URL: https://aibudgetcoach.com/grafana
    volumes:
      - grafana-data:/var/lib/grafana
      - ./infrastructure/grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
      - ./infrastructure/grafana/datasources:/etc/grafana/provisioning/datasources:ro
    networks:
      - budgetcoach-network
    depends_on:
      - prometheus

volumes:
  postgres-data:
  rabbitmq-data:
  prometheus-data:
  grafana-data:

networks:
  budgetcoach-network:
    driver: bridge
```

---

## Appendix B: Deployment Automation Script

**deploy.sh:**
```bash
#!/bin/bash
set -e

# Deployment script for AI Budgeting Coach
# Usage: ./deploy.sh [version]

VERSION=${1:-latest}
DEPLOYMENT_DIR="/home/budgetcoach/ai-budgeting-coach"
BACKUP_DIR="/home/budgetcoach/backups"

echo "========================================="
echo "AI Budgeting Coach Deployment Script"
echo "Version: $VERSION"
echo "========================================="

# Pre-deployment checks
echo "Running pre-deployment checks..."

# Check if .env.production exists
if [ ! -f "$DEPLOYMENT_DIR/.env.production" ]; then
    echo "ERROR: .env.production not found"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker is not running"
    exit 1
fi

# Backup current database
echo "Creating backup before deployment..."
$BACKUP_DIR/backup-databases.sh

# Pull latest code
echo "Pulling latest code from Git..."
cd $DEPLOYMENT_DIR
git fetch --all --tags
git checkout $VERSION

# Build Docker images
echo "Building Docker images..."
docker compose -f docker-compose.prod.yml build --no-cache

# Run database migrations
echo "Running database migrations..."
docker compose -f docker-compose.prod.yml run --rm user-service dotnet ef database update
docker compose -f docker-compose.prod.yml run --rm transaction-service dotnet ef database update
docker compose -f docker-compose.prod.yml run --rm ai-service dotnet ef database update
docker compose -f docker-compose.prod.yml run --rm budget-service dotnet ef database update
docker compose -f docker-compose.prod.yml run --rm notification-service dotnet ef database update

# Deploy new version
echo "Deploying new version..."
docker compose -f docker-compose.prod.yml up -d --force-recreate

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 30

# Run smoke tests
echo "Running smoke tests..."
./tests/smoke-tests.sh || {
    echo "ERROR: Smoke tests failed! Rolling back..."
    docker compose -f docker-compose.prod.yml down
    git checkout HEAD~1
    docker compose -f docker-compose.prod.yml up -d
    exit 1
}

# Success
echo "========================================="
echo "Deployment completed successfully!"
echo "Version: $VERSION"
echo "========================================="

# Show running containers
docker compose -f docker-compose.prod.yml ps
```

---

## Appendix C: Monitoring Dashboard Screenshots

*To be added: Screenshots of Grafana dashboards after initial deployment*

1. System Overview Dashboard
2. API Performance Dashboard
3. RabbitMQ Dashboard
4. Business Metrics Dashboard

---

## Appendix D: Runbook

### Common Issues and Solutions

**Issue 1: Service Won't Start**
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs [service-name]

# Check if port is already in use
sudo netstat -tulpn | grep [port]

# Restart service
docker compose -f docker-compose.prod.yml restart [service-name]
```

**Issue 2: Database Connection Failure**
```bash
# Check if PostgreSQL is running
docker compose -f docker-compose.prod.yml ps postgres

# Check database logs
docker compose -f docker-compose.prod.yml logs postgres

# Restart PostgreSQL
docker compose -f docker-compose.prod.yml restart postgres
```

**Issue 3: RabbitMQ Queue Backlog**
```bash
# Check queue status
docker exec budgetcoach-rabbitmq rabbitmqctl list_queues

# Purge queue (use with caution!)
docker exec budgetcoach-rabbitmq rabbitmqctl purge_queue [queue-name]

# Increase consumer count (deploy additional service instances)
docker compose -f docker-compose.prod.yml up -d --scale ai-service=2
```

**Issue 4: High CPU Usage**
```bash
# Identify container using most CPU
docker stats --no-stream

# Check service logs for errors
docker compose -f docker-compose.prod.yml logs [service-name]

# Restart problematic service
docker compose -f docker-compose.prod.yml restart [service-name]
```

**Issue 5: SSL Certificate Expiring Soon**
```bash
# Check certificate expiration
sudo certbot certificates

# Manually renew
sudo certbot renew

# Restart nginx
docker compose -f docker-compose.prod.yml restart nginx
```

---

**End of Deployment Plan**
