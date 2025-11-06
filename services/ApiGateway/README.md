# API Gateway

YARP-based API Gateway providing single entry point for all microservices.

## Responsibilities

- Route management for all backend services
- JWT token validation
- Rate limiting
- Request logging with correlation IDs
- CORS configuration
- Global exception handling

## Technology

- ASP.NET Core 8
- YARP (Yet Another Reverse Proxy)

## Configuration

See `appsettings.json` for route configurations and service endpoints.
