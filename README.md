# 🏠 Rentifi - Modern Property Rental Platform

![Rentifi Banner](https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=Rentifi+-+Your+Perfect+Rental+Awaits)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg)](https://www.mongodb.com/)

A full-stack property rental platform built with the MERN stack, offering seamless booking experiences for guests and comprehensive property management for hosts.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## ✨ Features

### For Guests
- 🔍 **Advanced Property Search** - Filter by location, price, amenities, and property type
- 📅 **Smart Booking Calendar** - Visual date picker with disabled booked dates
- 💳 **Secure Payments** - Integrated payment processing
- 📱 **Responsive Design** - Seamless experience across all devices
- ⭐ **Reviews & Ratings** - Read and leave property reviews
- 🔔 **Real-time Notifications** - Stay updated on booking status
- 👤 **User Dashboard** - Manage bookings, favorites, and profile

### For Hosts
- 🏡 **Property Management** - Create, edit, and manage property listings
- 📊 **Analytics Dashboard** - Track bookings, revenue, and occupancy rates
- 📸 **Multi-Image Upload** - Showcase properties with multiple photos
- 💰 **Dynamic Pricing** - Set custom pricing and availability
- 📅 **Booking Management** - Approve, decline, or manage reservations
- 📈 **Performance Metrics** - View detailed statistics and insights

### Platform Features
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 🚀 **RESTful API** - Well-documented backend API
- 📱 **Progressive Web App** - Install as mobile/desktop app
- 🌐 **Multi-language Support** (Coming Soon)
- 🔄 **Real-time Updates** - Live booking status updates
- 🛡️ **Data Validation** - Comprehensive input validation and sanitization

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **React Day Picker** - Date selection with disabled dates
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Express Validator** - Input validation

### DevOps & Tools
- **Git** - Version control
- **Nodemon** - Development auto-restart
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rentifi.git
cd rentifi
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

4. **Configure Environment Variables**

Create `.env` file in the `server` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/rentifi

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# File Upload (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

Create `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

5. **Start MongoDB**
```bash
# Windows (if installed as service)
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

6. **Run the Application**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

7. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 📁 Project Structure

```
rentifi/
├── client/                    # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── server/                   # Backend Node.js application
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # MongoDB models (Mongoose schemas)
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── server.js            # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
└── README.md                # Project documentation
```
<p align="center">Made with ❤️ by the Rentifi Team</p>

<p align="center">
  <a href="#-table-of-contents">Back to Top ⬆️</a>
</p>
