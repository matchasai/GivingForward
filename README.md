# GivingForward Backend

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3+-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-blue?logo=java)](https://www.java.com/)
[![Microservices](https://img.shields.io/badge/Microservices-Architecture-orange)]()
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

> **GivingForward Backend** is a robust, scalable microservices architecture for fundraising and donation management. Built with Spring Boot, it powers the GivingForward platform with secure authentication, campaign management, donation processing, notifications, and more.

---

## 🚀 Quick Links
- [Microservices Overview](#microservices-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 🏗️ Microservices Overview
- **auth-service**: User authentication, registration, JWT security
- **campaign-service**: Campaign CRUD, search, statistics
- **donation-service**: Donation processing, payment status, history
- **admin-service**: Admin dashboard, bulk notifications, user management
- **upload-service**: File/image uploads for campaigns
- **notification-service**: Email/SMS notifications, SMTP integration

## ✨ Features
- Secure user authentication & role-based access
- Campaign creation, management, and analytics
- Donation processing with payment status tracking
- Bulk notifications for admins
- File uploads for campaign media
- Global exception handling
- Inter-service REST communication
- Environment-based configuration (.env)
- Dockerized for easy deployment

## 🛠️ Tech Stack
- **Java 21**
- **Spring Boot 3+**
- **Spring Data JPA**
- **Spring Security (JWT)**
- **RESTful APIs**
- **MySQL/PostgreSQL** (configurable)
- **Docker & Docker Compose**
- **SMTP/Email Integration**

## 🏁 Getting Started

### Prerequisites
- [Java 21+](https://www.oracle.com/java/technologies/downloads/)
- [Maven](https://maven.apache.org/)
- [Docker](https://www.docker.com/) (for containerized deployment)

### Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/givingforward-backend.git
   cd givingforward/backend
   ```
2. Configure environment variables:
   - Edit the `.env` files in each microservice for DB, SMTP, JWT, etc.
3. Build and run with Maven:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
4. Or run all microservices with Docker Compose:
   ```bash
   docker-compose up --build
   ```

### API Documentation
- Each microservice exposes REST endpoints (see controller classes for details)
- Swagger/OpenAPI integration can be added for interactive docs

## 📁 Project Structure
```
backend/
├── microservices/
│   ├── auth-service/
│   ├── campaign-service/
│   ├── donation-service/
│   ├── admin-service/
│   ├── upload-service/
│   └── notification-service/
├── docker-compose.yml
├── README.md
└── ...
```

## ⚙️ Environment Variables
| Service              | Variable                | Description                  |
|----------------------|------------------------|------------------------------|
| All                  | DB_URL, DB_USER, DB_PASS| Database connection details  |
| All                  | JWT_SECRET             | JWT signing key              |
| notification-service | SMTP_HOST, SMTP_USER, SMTP_PASS | SMTP email config   |
| All                  | SERVICE_PORT           | Microservice port            |

> **Note:** All credentials should be stored in `.env` files and never hardcoded.

## 🤝 Contributing
We welcome contributions! Please open an issue to discuss major changes before submitting a pull request.

## 📄 License
This project is licensed under the MIT License.
