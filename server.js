import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { connectDB } from "./database/connectDB.js";
import userRouter from "./routes/userRoute.js";
import { routeNotFound, errorHandler } from "./middlewares/errorHandler.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_BASE = process.env.API_ENDPOINT || "/api/v1";
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: true,
    maxAge: 3600,
  })
);
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use(`${API_BASE}/users`, userRouter);

// Middlewares
app.use(routeNotFound);
app.use(errorHandler);

// Server
//
app.listen(PORT, async () => {
  await connectDB();
  console.log(`"Server is running on http://localhost:${PORT}"`);
});
