# GivingForward Frontend

[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-4+-yellow?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3+-teal?logo=tailwindcss)](https://tailwindcss.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

> **GivingForward** is a modern, responsive web app for fundraising and donations. Built with React, Vite, and Tailwind CSS, it connects seamlessly to the GivingForward microservices backend, empowering donors, campaign managers, and admins with a beautiful, intuitive experience.

---

## 🚀 Quick Links
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---
# GivingForward Frontend

A modern web application for the GivingForward platform, built with React and Vite. This frontend provides a user-friendly interface for donors, campaign managers, and administrators to interact with the GivingForward microservices backend.


## ✨ Features
- Secure user authentication & registration
- Browse, search, and filter fundraising campaigns
- Make donations with real-time feedback
- View donation history and campaign details
- Admin dashboard for campaign & user management
- Bulk notifications for admins
- Responsive, mobile-friendly design
- Fast performance with Vite & Tailwind CSS


## 🛠️ Tech Stack
- **React** (18+)
- **Vite** (4+)
- **Tailwind CSS** (3+)
- **Context API** for global state
- **REST API** integration with microservices backend


## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
$ git clone https://github.com/your-org/givingforward-frontend.git
$ cd givingforward/frontend

# Install dependencies
$ npm install
# or
yarn install
```

### Configuration
- Edit the `.env` file to set your API base URL and other settings.

### Development
```bash
npm run dev
# or
yarn dev
```
App runs at [http://localhost:5173](http://localhost:5173) by default.

### Build for Production
```bash
npm run build
# or
yarn build
```
Output is in the `dist/` folder.

### Deployment
- Serve the `dist/` folder with any static file server (Nginx, Vercel, Netlify, etc.)
- Ensure `.env` is set for your production API endpoints


## 📁 Project Structure
```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React Contexts for global state
│   ├── pages/             # Route-based pages
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Project metadata & scripts
├── tailwind.config.js     # Tailwind CSS config
├── vite.config.js         # Vite config
└── README.md              # Project documentation
```


## ⚙️ Environment Variables
| Variable              | Description                                      | Example                        |
|-----------------------|--------------------------------------------------|--------------------------------|
| VITE_API_BASE_URL     | Base URL for backend API                         | http://localhost:8081/api      |
| VITE_APP_NAME         | Application name                                 | GivingForward                  |
| VITE_APP_VERSION      | App version                                      | 1.0.0                          |
| VITE_ENABLE_DEBUG     | Enable debug mode (true/false)                   | true                           |
| GENERATE_SOURCEMAP    | Disable React DevTools source maps in development| false                          |


## 🤝 Contributing
We welcome contributions! Please open an issue to discuss major changes before submitting a pull request.

## 📄 License
This project is licensed under the MIT License.
