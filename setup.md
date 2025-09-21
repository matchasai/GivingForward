# Fund Donation System - Setup Guide

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher (or Docker)

## Quick Start

### 1. Database Setup

**Option A: Using Docker (Recommended)**
```bash
# Start MySQL database
docker-compose up -d

# Wait for MySQL to be ready (about 30 seconds)
```

**Option B: Using Local MySQL**
- Install MySQL 8.0
- Create a database named `fundapp`
- Update `backend/src/main/resources/application.properties` with your MySQL credentials

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Run the Spring Boot application
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

**Default Users Created:**
- Admin: `admin@fundapp.com` / `admin123`
- User: `user@fundapp.com` / `user123`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Features

### User Features
- ✅ User registration and login
- ✅ Browse active campaigns
- ✅ View campaign details with progress
- ✅ Make donations (fake payment system)
- ✅ View donation history
- ✅ Receive notifications for new campaigns
- ✅ Responsive design with animations

### Admin Features
- ✅ Admin dashboard with real-time statistics
- ✅ View all users and their activities
- ✅ Monitor donation activities
- ✅ Create and manage campaigns
- ✅ Real-time updates with polling

### Technical Features
- ✅ JWT authentication
- ✅ Secure password hashing
- ✅ RESTful API design
- ✅ Glassmorphism UI design
- ✅ Smooth animations with Framer Motion
- ✅ Toast notifications
- ✅ Responsive design
- ✅ CORS configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Campaigns
- `GET /api/campaigns/active` - List active campaigns
- `GET /api/campaigns/{id}` - Get campaign details
- `POST /api/campaigns` - Create campaign (admin)
- `PUT /api/campaigns/{id}` - Update campaign (admin)
- `DELETE /api/campaigns/{id}` - Delete campaign (admin)

### Donations
- `POST /api/donations` - Make donation
- `GET /api/donations/my` - User's donations
- `GET /api/donations` - All donations (admin)

### Notifications
- `GET /api/notifications` - User notifications
- `GET /api/notifications/unread` - Unread notifications
- `PATCH /api/notifications/{id}/read` - Mark as read
- `GET /api/notifications/unread-count` - Unread count

### Admin
- `GET /api/admin/stats` - Site statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/activity` - Recent activity

## Development

### Backend Development
- The application uses Spring Boot 3.x with Spring Security
- JWT tokens are used for authentication
- Database is automatically created and populated with sample data
- All API endpoints are documented above

### Frontend Development
- Built with React 18 and Vite
- Uses Tailwind CSS for styling
- Framer Motion for animations
- Axios for API calls
- React Router for navigation

### Fake Payment System
- All donations are processed with a fake payment system
- Payments always succeed for demonstration purposes
- In production, integrate with real payment gateways like Stripe or PayPal

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `application.properties`
   - Verify database `fundapp` exists

2. **Frontend Can't Connect to Backend**
   - Ensure backend is running on port 8080
   - Check CORS configuration
   - Verify proxy settings in `vite.config.js`

3. **JWT Token Issues**
   - Clear browser localStorage
   - Check JWT secret in `application.properties`
   - Verify token expiration settings

### Logs
- Backend logs are displayed in the console
- Check for any error messages during startup
- Sample data creation messages will appear on first run

## Production Deployment

### Backend
- Build JAR: `./mvnw clean package`
- Run: `java -jar target/fundapp-0.0.1-SNAPSHOT.jar`
- Configure environment variables for database and JWT

### Frontend
- Build: `npm run build`
- Serve static files from a web server
- Configure API base URL for production

## Security Notes

- Change default passwords in production
- Use strong JWT secrets
- Enable HTTPS in production
- Implement rate limiting
- Add input validation and sanitization
- Use environment variables for sensitive data 