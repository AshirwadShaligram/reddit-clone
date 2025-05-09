import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);

app.listen(3001, () => {
  console.log("Server is running");
});
