import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import propertyRouter from "./routes/properties.js";
// import messageRouter from "./routes/messageRoutes.js";


const app = express();
const server = http.createServer(app);

// middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

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

// test route
app.use("/api/status", (req, res) => res.send("Server is live"));

app.use("/api/auth",userRouter)
app.use("/api/properties",propertyRouter)
// app.use("/api/messages",messageRouter)

const PORT = process.env.PORT || 5000;

// connect to mongodb
await connectDB();

// start server only after DB is connected
if(process.env.NODE_ENV !=="production"){
  server.listen(PORT, () => {
    console.log("✅ Server is running on port: " + PORT);
  });
}
//export server for vercel
export default server;