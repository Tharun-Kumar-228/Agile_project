// Routes/DonationRoutes.js
import express from "express";
import { Donation } from "../modals/donationModal.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * @route POST /api/donations
 * @desc Create a new donation with multiple foods and photos
 */
router.post("/donations", upload.any(), async (req, res) => {
  try {
    const { userId, lat, lng, address } = req.body;

    if (!userId || !lat || !lng) {
      return res.status(400).json({ message: "userId, latitude, and longitude are required" });
    }

    // Parse foods array from req.body
    let foods = [];
    if (req.body.foods) {
      // If foods comes as a string (from FormData), parse it
      foods = typeof req.body.foods === "string" ? JSON.parse(req.body.foods) : req.body.foods;

      // Attach uploaded photos to corresponding food item
      foods = foods.map((food, index) => {
        const fileField = `foods[${index}][photo]`;
        const file = req.files.find((f) => f.fieldname === fileField);
        if (file) food.photo = `/uploads/${file.filename}`;
        return food;
      });
    }

    const donation = new Donation({
      userId,
      location: { lat, lng, address },
      foods,
    });

    await donation.save();

    return res.status(201).json({ message: "Donation created successfully ✅", donation });
  } catch (err) {
    console.error("Donation creation error:", err);
    return res.status(500).json({ message: "Server error ❌" });
  }
});


/**
 * @route GET /api/donations/requests/:donorId
 * @desc Get all Receive requests for donations of a specific donor
 */
router.get("donations/requests/:donorId", async (req, res) => {
  try {
    const { donorId } = req.params;

    // Step 1: Get all donations by this donor
    const donations = await Donation.find({ userId: donorId });
    const donationIds = donations.map(d => d._id);

    if (donationIds.length === 0) {
      return res.json({ requests: [] });
    }

    // Step 2: Get all Receive requests linked to these donations
    const requests = await Receive.find({ linkedDonation: { $in: donationIds } })
      .populate("userId", "name email")       // receiver info
      .populate("linkedDonation");            // donation info

    res.json({ requests });
  } catch (err) {
    console.error("Error fetching donor requests:", err);
    res.status(500).json({ message: "Server error ❌" });
  }
});
export default router;
