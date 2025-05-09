import express from "express";
import { signup, login, logout } from "../controller/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

// Protected route example
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

export default router;
