import express from "express";
import User from "../modals/userModal.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role)
    return res.status(400).json({ message: "All fields are required" });

  const user = await User.findOne({ username, role });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    message: "Login successful",
    userId: user._id,
    username: user.username,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
  });
});

// SIGNUP
router.post("/signup", async (req, res) => {
  const { username, email, mobile, role, password } = req.body;
  if (!username || !email || !mobile || !role || !password)
    return res.status(400).json({ message: "All fields are required" });

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser)
    return res.status(409).json({ message: "Username or email already exists" });

  const user = new User({ username, email, mobile, role, password });
  await user.save();

  res.status(201).json({
    message: "User registered successfully",
    userId: user._id,
    username: user.username,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
  });
});

export default router;
