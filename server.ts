import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./configs/connectToDb";
import { errorHandler, notFound } from "./middlewares/error";
import compression from "compression";

// .env
dotenv.config();

// routes import
import routeStudent from "./routes/users/students/Student.route";

// Validate required environment variables
const requiredEnvVars = [
  "MONGO_URL",
  "JWT_SECRET_KEY",
  "NODE_ENV",
  "PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
  "OTP_PEPPER",
  "JWT_SECRET_KEY"
];

requiredEnvVars.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
});

// Connection To Db
connectDB();

// Init App
const app = express();

// middleware
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

//Cors Policy
app.use(
  cors({
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("API is running in Captal");
});
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("API is running in Hack it");
});
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.use("/api/hackit/ctrl/student", routeStudent);

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

//Running The Server
const PORT: number = parseInt(process.env.PORT || "5000");
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
