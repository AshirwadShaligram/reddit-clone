import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Protect routes - only for authenticated users
const protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token || token === "loggedout") {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId }, // Changed from decoded.id to decoded.userId
    });

    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }

    // 4) Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    console.error("Authentication error:", err); // More detailed error logging

    let message = "Invalid token or session expired. Please log in again.";
    if (err.name === "TokenExpiredError") {
      message = "Your session has expired. Please log in again.";
    } else if (err.name === "JsonWebTokenError") {
      message = "Invalid authentication token.";
    }

    res.status(401).json({
      status: "fail",
      message,
    });
  }
};

export default protect;
