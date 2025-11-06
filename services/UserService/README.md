# User Service

User authentication and profile management microservice.

## Responsibilities

- User registration and login
- JWT token generation (access + refresh tokens)
- Password hashing (BCrypt)
- User profile management
- User event publishing (UserRegistered, UserProfileUpdated)

## Technology

- ASP.NET Core 8 Web API
- Entity Framework Core 8
- PostgreSQL (user_db)
- MassTransit + RabbitMQ

## Database

- **Database Name:** user_db
- **Tables:** Users, RefreshTokens

## API Endpoints

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/refresh` - Refresh access token
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
