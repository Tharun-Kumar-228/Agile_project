import express from "express";
import User from "../modals/userModal.js";
import multer from "multer";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.role !== role) return res.status(401).json({ message: "Role Mismatch" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Prepare response
    const responseData = {
      message: "Login successful",
      userId: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      accessLevel: user.accessLevel,
      generalType: user.generalType || null,
      proofDocument: user.proofDocument || null,
      volunteerInfo: user.volunteerInfo || null,
    };

    res.json(responseData);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save files in /uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Signup route
router.post("/signup", upload.single("proofDocument"), async (req, res) => {
  try {
    const { username, email, mobile, password, role, generalType, volunteerInfo } = req.body;

    const newUser = new User({
      username,
      email,
      mobile,
      password,
      role,
      accessLevel: role === "admin" ? "super" : role === "volunteer" ? "support" : "general",
      generalType: role === "general" ? generalType : null,
      volunteerInfo: role === "volunteer" ? JSON.parse(volunteerInfo) : {},
      proofDocument: req.file ? req.file.path : null,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

export default router;
