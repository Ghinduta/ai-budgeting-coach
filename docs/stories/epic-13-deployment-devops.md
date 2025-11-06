# Epic 13: Deployment & DevOps

**Epic ID:** EPIC-13
**Priority:** P1 (High)
**Status:** Not Started
**Estimated Duration:** 4-5 days
**Owner:** Dev Team
**Depends On:** Epic 12 (Testing & Quality)

---

## Epic Overview

Prepare production deployment infrastructure with Docker Compose, Nginx reverse proxy, SSL certificates, database backups, monitoring dashboards, log aggregation, and deployment automation. This epic makes the application production-ready.

**Goal:** Deploy application to production VM with HTTPS, monitoring, backups, and zero-downtime updates.

---

## Stories

### Story 13.1: Create Production Docker Compose Configuration
**Story ID:** STORY-13-01
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Create production-ready Docker Compose configuration with security hardening.

**Acceptance Criteria:**
- [ ] docker-compose.prod.yml separate from development config
- [ ] All services configured with resource limits (CPU, memory)
- [ ] Environment variables loaded from .env.prod file
- [ ] Secrets management (database passwords, JWT keys, API keys)
- [ ] Health checks configured for all services
- [ ] Restart policies: always or unless-stopped
- [ ] Logging drivers configured (json-file with rotation)
- [ ] Networks configured (separate networks for security)
- [ ] Volumes configured for data persistence (PostgreSQL, RabbitMQ)
- [ ] No ports exposed except Nginx (80, 443)

**Implementation Notes:**
- Use Docker secrets or environment variables for sensitive data
- Configure log rotation (max-size: 10m, max-file: 3)
- Resource limits: API services (512MB RAM, 0.5 CPU), databases (1GB RAM, 1 CPU)
- Separate network for database (not accessible from outside)

**Testing:**
```bash
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml ps  # All healthy
```

**Dependencies:**
- Epic 1: Development Docker Compose

---

### Story 13.2: Configure Nginx Reverse Proxy with SSL (Let's Encrypt)
**Story ID:** STORY-13-02
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Setup Nginx as reverse proxy with automatic SSL certificate management.

**Acceptance Criteria:**
- [ ] Nginx container in Docker Compose
- [ ] Nginx config file with reverse proxy to API Gateway
- [ ] Static file serving for React frontend
- [ ] SSL certificates from Let's Encrypt (Certbot)
- [ ] HTTP to HTTPS redirect
- [ ] SSL configuration: TLS 1.2+, strong ciphers
- [ ] Certificates auto-renew (Certbot renewal cron job)
- [ ] HSTS header configured (max-age 1 year)
- [ ] Security headers: X-Frame-Options, X-Content-Type-Options, CSP
- [ ] Gzip compression enabled
- [ ] Request size limits (10MB max)

**Implementation Notes:**
- Use nginx:alpine image
- Mount nginx.conf from host
- Use certbot/certbot image for certificate management
- Configure webroot for certificate validation
- Test certificate renewal: `certbot renew --dry-run`

**Testing:**
- Access app via HTTPS (https://aibudgetcoach.com)
- Verify SSL certificate valid
- Test HTTP redirect to HTTPS
- Check security headers (securityheaders.com)

**Dependencies:**
- Story 13.1

---

### Story 13.3: Setup Domain and DNS
**Story ID:** STORY-13-03
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Register domain and configure DNS records.

**Acceptance Criteria:**
- [ ] Domain registered (e.g., aibudgetcoach.com)
- [ ] DNS A record points to production VM IP
- [ ] DNS www subdomain configured (CNAME to apex)
- [ ] DNS propagation verified (nslookup, dig)
- [ ] Domain accessible via browser
- [ ] SSL certificate issued for domain

**Implementation Notes:**
- Use Namecheap, Google Domains, or Cloudflare for registration
- Configure DNS at registrar or use Cloudflare DNS
- DNS TTL: 3600 seconds (1 hour)
- Wait 24-48 hours for full propagation

**Testing:**
```bash
nslookup aibudgetcoach.com
ping aibudgetcoach.com
curl -I https://aibudgetcoach.com  # Should return 200 OK
```

**Dependencies:**
- Story 13.2
- Production VM provisioned

---

### Story 13.4: Implement Database Backup Scripts
**Story ID:** STORY-13-04
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Create automated database backup scripts with retention policy.

**Acceptance Criteria:**
- [ ] Backup script: pg_dump for all 6 databases
- [ ] Backups compressed (gzip)
- [ ] Backup naming: {database}_{timestamp}.sql.gz
- [ ] Backups stored locally and remotely (S3 or similar)
- [ ] Backup retention: 7 daily, 4 weekly, 3 monthly
- [ ] Backup verification: test restore on separate environment
- [ ] Cron job: daily backups at 2 AM UTC
- [ ] Backup failures logged and alerted
- [ ] Restore script documented

**Implementation Notes:**
- Use pg_dump with custom format for flexibility
- Use rclone or aws-cli for remote backups
- Test restore procedure regularly (monthly)
- Encrypt backups for security

**Testing:**
```bash
./backup-databases.sh
./restore-database.sh user_db backups/user_db_20250105.sql.gz
# Verify data restored correctly
```

**Dependencies:**
- Story 13.3

---

### Story 13.5: Create Deployment Automation Scripts
**Story ID:** STORY-13-05
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Create scripts for automated deployment with zero downtime.

**Acceptance Criteria:**
- [ ] deploy.sh script pulls latest images, updates containers
- [ ] Deployment uses rolling update strategy (no downtime)
- [ ] Deployment runs database migrations automatically
- [ ] Deployment verifies health checks before completing
- [ ] Rollback script for failed deployments
- [ ] Deployment logs captured
- [ ] Deployment notifications (Slack/email on success/failure)
- [ ] Deployment tagged with version (Git tag or commit SHA)

**Implementation Notes:**
- Use `docker-compose pull && docker-compose up -d`
- Run migrations in init container or separate step
- Wait for health checks to pass before considering deployment successful
- Tag images with version (latest, v1.0.0, commit SHA)

**Testing:**
- Test deployment on staging environment first
- Test rollback procedure
- Verify zero downtime during deployment

**Dependencies:**
- Story 13.4

---

### Story 13.6: Setup Prometheus Metrics Collection
**Story ID:** STORY-13-06
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Configure Prometheus to scrape metrics from all services.

**Acceptance Criteria:**
- [ ] Prometheus container in Docker Compose
- [ ] Prometheus configuration (prometheus.yml)
- [ ] Scrape jobs for all services (UserService, TransactionService, AIService, BudgetService, NotificationService)
- [ ] Scrape job for API Gateway
- [ ] Scrape job for RabbitMQ (via rabbitmq_exporter)
- [ ] Scrape job for PostgreSQL (via postgres_exporter)
- [ ] Scrape job for Node Exporter (system metrics)
- [ ] Metrics retention: 30 days
- [ ] Prometheus UI accessible (internal only)

**Implementation Notes:**
- Use prometheus:latest image
- Configure scrape intervals: 15 seconds
- Mount prometheus.yml from host
- Add /metrics endpoint to all ASP.NET services (App.Metrics or Prometheus.NET)

**Testing:**
- Access Prometheus UI (http://localhost:9090)
- Verify targets are up (Status → Targets)
- Query metrics (rate(http_requests_total[1m]))

**Dependencies:**
- Story 13.5
- Epic 1: Prometheus container

---

### Story 13.7: Create Grafana Dashboards (System, API, RabbitMQ)
**Story ID:** STORY-13-07
**Priority:** P0
**Estimated:** 5 hours

**Description:**
Create comprehensive Grafana dashboards for monitoring.

**Acceptance Criteria:**
- [ ] System Dashboard: CPU, memory, disk usage, network I/O (via Node Exporter)
- [ ] API Dashboard: request rate, response time (p50, p95, p99), error rate, by endpoint
- [ ] RabbitMQ Dashboard: queue depths, message rates, consumer count, error rates
- [ ] PostgreSQL Dashboard: connection count, query duration, database size
- [ ] Business Metrics Dashboard: user registrations, transactions created, CSV imports, budgets created
- [ ] Dashboards exported as JSON (version controlled)
- [ ] Dashboards auto-imported on Grafana startup
- [ ] Alerts configured (covered in Story 13.9)

**Implementation Notes:**
- Import community dashboards where available
- Customize for application-specific metrics
- Use template variables for filtering (service, endpoint, etc.)
- Organize dashboards in folders

**Testing:**
- Verify all dashboards load correctly
- Test with realistic load (use test data)
- Verify visualizations accurate

**Dependencies:**
- Story 13.6
- Epic 1: Grafana container

---

### Story 13.8: Configure Log Aggregation (ELK or Seq)
**Story ID:** STORY-13-08
**Priority:** P1
**Estimated:** 4 hours

**Description:**
Setup centralized logging for all services (choose ELK Stack or Seq).

**Acceptance Criteria:**
- [ ] Log aggregation solution deployed (Elasticsearch + Logstash + Kibana OR Seq)
- [ ] All services send logs to aggregation system
- [ ] Logs searchable by correlation ID, service, level, timestamp
- [ ] Log retention: 30 days
- [ ] Kibana/Seq UI accessible (internal only)
- [ ] Log dashboards created (error trends, top errors, slow requests)
- [ ] Structured logging (JSON format)

**Implementation Notes:**
- Option A: ELK Stack (heavier, more powerful)
- Option B: Seq (lighter, .NET-friendly)
- Use Serilog sinks (Elasticsearch or Seq)
- Configure log enrichment (service name, environment, version)

**Testing:**
- Generate logs from services
- Search logs in Kibana/Seq
- Test filtering by correlation ID

**Dependencies:**
- Story 13.7

---

### Story 13.9: Setup Alerting Rules (Disk Space, Memory, Errors)
**Story ID:** STORY-13-09
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Configure alerting for critical system issues.

**Acceptance Criteria:**
- [ ] Alert: Disk space <10% free
- [ ] Alert: Memory usage >90%
- [ ] Alert: CPU usage >80% for 5 minutes
- [ ] Alert: API error rate >5% for 1 minute
- [ ] Alert: RabbitMQ queue depth >1000
- [ ] Alert: PostgreSQL connection pool exhausted
- [ ] Alert: Service health check failing
- [ ] Alert: SSL certificate expiring within 7 days
- [ ] Alerts sent via email and/or Slack
- [ ] Alert rules documented in runbook

**Implementation Notes:**
- Use Prometheus Alertmanager
- Configure alert routing (email, Slack webhook)
- Set alert thresholds appropriate for MVP scale
- Test alerts by triggering conditions

**Testing:**
- Trigger each alert condition manually
- Verify alert notifications received
- Test alert resolution notifications

**Dependencies:**
- Story 13.8

---

### Story 13.10: Create Runbook Documentation
**Story ID:** STORY-13-10
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Document operational procedures for common scenarios.

**Acceptance Criteria:**
- [ ] Runbook covers: deployment procedure, rollback procedure, database restore, log troubleshooting, alert handling
- [ ] Common issues documented with solutions
- [ ] Service restart procedures
- [ ] Scaling procedures (when needed)
- [ ] Incident response process
- [ ] Contact information for emergencies
- [ ] Runbook accessible (docs/runbook.md)

**Implementation Notes:**
- Use simple markdown format
- Include command examples
- Link to relevant dashboards and logs
- Keep updated as issues discovered

**Testing:**
- Review runbook with team
- Test procedures documented
- Update based on feedback

**Dependencies:**
- Story 13.9

---

### Story 13.11: Perform Dry-Run Deployment
**Story ID:** STORY-13-11
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Test complete deployment procedure on staging environment.

**Acceptance Criteria:**
- [ ] Staging environment configured (separate VM or namespace)
- [ ] Deploy application to staging using deployment script
- [ ] Verify all services healthy
- [ ] Run smoke tests (manual or automated)
- [ ] Test rollback procedure
- [ ] Verify monitoring and logging working
- [ ] Document any issues and fixes
- [ ] Staging deployment successful

**Implementation Notes:**
- Use production-like environment for staging
- Test with production Docker Compose config
- Seed staging with test data
- Invite team to test staging environment

**Testing:**
- Manual testing of all features
- Verify data persistence after restart
- Test SSL certificates (use staging Let's Encrypt)

**Dependencies:**
- Story 13.10

---

### Story 13.12: Deploy to Production VM
**Story ID:** STORY-13-12
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Execute production deployment.

**Acceptance Criteria:**
- [ ] Production VM provisioned (4 vCPU, 8GB RAM, 100GB SSD)
- [ ] Docker and Docker Compose installed
- [ ] SSH access configured (key-based, no password)
- [ ] Firewall configured (allow 80, 443, SSH only)
- [ ] Deploy application using deployment script
- [ ] Verify all services healthy
- [ ] Run smoke tests
- [ ] Monitoring and logging operational
- [ ] Domain accessible via HTTPS
- [ ] Production deployment successful

**Implementation Notes:**
- Use DigitalOcean, Hetzner, or AWS for VM
- Harden VM security (fail2ban, automatic updates)
- Configure backup schedule
- Document production credentials securely

**Testing:**
- Access application via production domain
- Test all critical flows
- Verify monitoring dashboards
- Verify SSL certificate

**Dependencies:**
- Story 13.11

---

## Epic Acceptance Criteria

- ✅ Production environment accessible via HTTPS
- ✅ SSL certificates auto-renew
- ✅ Database backups run daily
- ✅ Deployment script performs zero-downtime updates
- ✅ Grafana dashboards show all metrics
- ✅ Alerts sent for critical issues
- ✅ Logs searchable and retained for 30 days
- ✅ Runbook covers common scenarios
- ✅ Production deployment successful

---

## Dependencies

**Blocks:**
- Epic 14: Documentation & Beta Prep

**Depends On:**
- Epic 12: Testing & Quality (tests must pass)

**Enables:**
- Production readiness
- Beta user access
- Reliable operations

---

## Notes

- Production deployment is milestone - celebrate it!
- Start small (single VM) and scale as needed
- Monitor costs closely (VM, bandwidth, AI API)
- Future: Kubernetes for orchestration (Phase 3)
- Future: Multi-region deployment for redundancy
- Future: CDN for static assets (Cloudflare)
- Document all production changes in changelog
- Maintain production environment separate from development
- Test backup restore procedure monthly
- Review monitoring dashboards weekly during beta

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
