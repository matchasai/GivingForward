# GivingForward Microservices Architecture

## Overview
GivingForward is a modular fundraising platform built with Spring Boot microservices. Each service is independently deployable and communicates via REST APIs. The system is containerized with Docker and orchestrated using Docker Compose for local and cloud deployment.

## Microservices
- **auth-service**: User authentication, registration, JWT, user management
- **campaign-service**: Campaign CRUD, stats, public endpoints
- **donation-service**: Donation CRUD, stats, payment status
- **admin-service**: Admin dashboard, stats, bulk notification
- **upload-service**: File uploads, storage
- **notification-service**: SMTP/email notifications

## Inter-Service Communication
- REST APIs via service URLs (see `docker-compose.microservices.yml`)
- Admin-service calls auth-service and notification-service for bulk notifications

## Configuration
- Each service has its own `application.yml` or `application.properties` for DB, mail, JWT, etc.
- Environment variables are set in Docker Compose for secrets and service URLs

## Deployment
### Local
1. Build all services: `mvn clean package` in each microservice folder
2. Start with Docker Compose: `docker-compose -f docker-compose.microservices.yml up --build`

### Cloud (AWS)
- Push code to GitHub
- Use AWS ECS, EKS, or EC2 with Docker Compose
- Set environment variables/secrets in AWS (RDS, SMTP, JWT)
- Use health checks and restart policies in Docker Compose

## Endpoints
- See each microservice's controller classes for API endpoints
- Example: `/api/admin/notifyAllUsers` triggers bulk notification

## Testing
- Unit and integration tests should be added in each microservice (`src/test/java`)

## Error Handling
- Each service uses `GlobalExceptionHandler` for consistent error responses

## Notes
- Ensure all environment variables are set for production
- Review mail, JWT, and DB config before deployment
- For bulk notification, ensure notification-service SMTP is configured and reachable

---
For more details, see each microservice's README and source code.

# Fund Donation System

A full-stack web application for managing donation campaigns with user registration, campaign management, and real-time admin dashboard.

## Features

### Frontend (React + Vite)
- User registration and authentication
- Campaign browsing with animated UI
- Donation system with fake payment processing
- Notification center
- User dashboard
- Responsive design with glassmorphism effects

### Backend (Spring Boot)
- RESTful API with JWT authentication
- Campaign CRUD operations
- Donation processing
- Notification system
- Admin dashboard with real-time stats
- Image upload functionality

## Project Structure

```
GivingForward/
├── frontend/          # React + Vite application
├── backend/           # Spring Boot application
├── README.md          # This file
└── docker-compose.yml # Database setup (optional)
```

## Quick Start

### Prerequisites
- Node.js (v16+)
- Java 17+
- MySQL 8.0+

### Backend Setup
1. Navigate to backend directory
2. Configure `application.properties` with your database settings
3. Run: `./mvnw spring-boot:run`

### Frontend Setup
1. Navigate to frontend directory
2. Install dependencies: `npm install`
3. Run: `npm run dev`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Campaigns
- `GET /api/campaigns/active` - List active campaigns
- `GET /api/campaigns/{id}` - Get campaign details
- `POST /api/campaigns` - Create campaign (admin)
- `PUT /api/campaigns/{id}` - Update campaign (admin)

### Donations
- `POST /api/donations` - Make donation
- `GET /api/donations/my` - User's donations
- `GET /api/donations` - All donations (admin)

### Notifications
- `GET /api/notifications` - User notifications
- `PATCH /api/notifications/{id}/read` - Mark as read

### Admin
- `GET /api/admin/stats` - Site statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/activity` - Recent activity

## Technologies Used

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- React Router

### Backend
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- MySQL
- JWT Authentication
- Maven

## Development

The application uses a fake payment system for demonstration purposes. In production, integrate with real payment gateways like Stripe or PayPal.