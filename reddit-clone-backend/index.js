import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRoute.js";
import communityRouter from "./routes/communityRoute.js";
import postRoutes from "./routes/postRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import { uploadMiddleware } from "./middleware/uploadMiddleware.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // frontend domain IP
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Global file upload middleware configuration
app.use(uploadMiddleware);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/communities", communityRouter);
app.use("/api/posts", postRoutes);
app.use("/api/vote", voteRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
