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

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "guest"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Property Endpoints

#### Get All Properties
```http
GET /api/properties
Query Parameters:
  - location: string
  - minPrice: number
  - maxPrice: number
  - propertyType: string
  - page: number
  - limit: number
```

#### Get Property Details
```http
GET /api/properties/:id
```

#### Create Property (Protected - Host only)
```http
POST /api/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Modern Downtown Apartment",
  "description": "Beautiful 2BR apartment",
  "location": "New York, NY",
  "price": 150,
  "propertyType": "apartment",
  "bedrooms": 2,
  "bathrooms": 2,
  "maxGuests": 4,
  "amenities": ["wifi", "parking", "kitchen"],
  "images": ["url1", "url2"]
}
```

### Booking Endpoints

#### Check Availability (Public)
```http
GET /api/bookings/availability/:propertyId?checkIn=2025-10-20&checkOut=2025-10-25
```

#### Get Booked Dates (Public)
```http
GET /api/bookings/property/:propertyId/booked

Response:
{
  "success": true,
  "ranges": [
    {
      "from": "2025-10-20T00:00:00.000Z",
      "to": "2025-10-25T00:00:00.000Z"
    }
  ]
}
```

#### Create Booking (Protected)
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "propertyId": "68ecd6b21e6693754def1304",
  "checkIn": "2025-10-20",
  "checkOut": "2025-10-25",
  "guests": 2,
  "specialRequests": "Early check-in if possible"
}
```

#### Get User Bookings (Protected)
```http
GET /api/bookings
Authorization: Bearer {token}
```

#### Update Booking Status (Protected - Host only)
```http
PUT /api/bookings/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmed"
}
```

#### Cancel Booking (Protected)
```http
POST /api/bookings/:id/cancel
Authorization: Bearer {token}
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔐 Environment Variables

### Server (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Server port | No | 5000 |
| MONGODB_URI | MongoDB connection string | Yes | - |
| JWT_SECRET | Secret key for JWT tokens | Yes | - |
| JWT_EXPIRE | JWT expiration time | No | 7d |
| NODE_ENV | Environment mode | No | development |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | No | - |
| CLOUDINARY_API_KEY | Cloudinary API key | No | - |
| CLOUDINARY_API_SECRET | Cloudinary API secret | No | - |

### Client (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| VITE_BACKEND_URL | Backend API base URL | Yes | - |

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Home+Page+Preview)

### Property Details with Booking Calendar
![Property Details](https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Property+Details+%26+Calendar)

### Dashboard
![Dashboard](https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=User+Dashboard)

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. Create a new project on Railway or Render
2. Connect your GitHub repository
3. Set environment variables in the dashboard
4. Deploy automatically on push to main branch

### Frontend Deployment (Vercel/Netlify)

1. Create a new project on Vercel or Netlify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 🐛 Known Issues

- [ ] Image upload optimization for large files
- [ ] Email notifications pending SMTP configuration

## 📝 Roadmap

- [ ] Advanced search filters
- [ ] Map integration for property location
- [ ] Instant booking feature
- [ ] Property verification system
- [ ] Payment gateway integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing library
- MongoDB team for the database
- All contributors who helped with the project
- Open source community

## 📞 Contact

For questions or support, please reach out:

- **Email**: support@rentifi.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/rentifi/issues)
- **Discord**: [Join our community](https://discord.gg/rentifi)

---

<p align="center">Made with ❤️ by the Rentifi Team</p>

<p align="center">
  <a href="#-table-of-contents">Back to Top ⬆️</a>
</p>
