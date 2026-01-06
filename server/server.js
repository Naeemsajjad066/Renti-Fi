import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import propertyRouter from "./routes/properties.js";
import bookingRouter from "./routes/bookings.js";
import reviewRouter from "./routes/reviews.js";
import adminRouter from "./routes/admin.js";
import paymentRouter from "./routes/payments.js";
import stripeConnectRouter from "./routes/stripeConnect.js";
import complaintRouter from "./routes/complaints.js";
// import messageRouter from "./routes/messageRoutes.js";


const app = express();
const server = http.createServer(app);

// Stripe webhook endpoint needs raw body - must be before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// middleware setup
app.use(express.json({ limit: "4mb" }));

// Security middleware - sanitize data to prevent NoSQL injection
app.use(mongoSanitize());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL,
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Referer',
    'token',
    'Accept-Language'
  ]
}));

// Add performance and security headers
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Performance headers
  res.setHeader('X-Powered-By', 'RentiFi');
  
  // Log requests in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  }
  
  next();
});

// Error handling middleware for payload too large
app.use((error, req, res, next) => {
  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'File too large. Please choose an image smaller than 4MB.',
    });
  }
  next(error);
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// test route
app.use("/api/status", (req, res) => res.send("Server is live"));

app.use("/api/auth",userRouter)
app.use("/api/properties",propertyRouter)
app.use("/api/bookings",bookingRouter)
app.use("/api/reviews",reviewRouter)
app.use("/api/admin",adminRouter)
app.use("/api/payments",paymentRouter)
app.use("/api/stripe-connect",stripeConnectRouter)
app.use("/api/complaints",complaintRouter)
// app.use("/api/messages",messageRouter)

const PORT = process.env.PORT || 5000;

// connect to mongodb
await connectDB();

// start server - bind to 0.0.0.0 for cloud deployment
server.listen(PORT, '0.0.0.0', () => {
  console.log("Server is running on port: " + PORT);
});

//export server for vercel
export default server;