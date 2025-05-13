import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRoute.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // frontend domain IP
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);

app.listen(3001, () => {
  console.log("Server is running");
});
