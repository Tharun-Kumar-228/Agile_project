// Routes/DonationRoutes.js
import express from "express";
import Donation from "../modals/donationModal.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Set storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

router.post("/add-donation", upload.array("photos"), async (req, res) => {
  try {
    let { userId, foods, location } = req.body;

    if (!userId || !foods || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize foods into an array
    if (typeof foods === "string") {
      try {
        foods = JSON.parse(foods);
      } catch (err) {
        return res.status(400).json({ message: "Invalid foods format" });
      }
    }

    // If single object, wrap in array
    if (!Array.isArray(foods)) {
      foods = [foods];
    }

    // Parse location if it's a string
    if (typeof location === "string") {
      location = JSON.parse(location);
    }

    // Initialize each food's photo, status, expiryDuration
    const foodsList = foods.map((food, idx) => ({
      name: food.name,
      quantity: food.quantity,
      unit: food.unit,
      photo: null,
      status: food.status || "Pending",
      expiryDuration: food.expiryDuration || 0,
    }));

    // Attach uploaded images
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, idx) => {
        if (foodsList[idx]) foodsList[idx].photo = `uploads/${file.filename}`;
      });
    }

    const donation = new Donation({
      userId,
      foods: foodsList,
      location,
    });

    await donation.save();

    res.status(201).json({ message: "Donation added successfully", donation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user-donations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const donations = await Donation.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ donations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all-donations", async (req, res) => {
  try {
    const now = new Date();

    // Fetch donations with status Pending
    const donations = await Donation.find({ status: "Pending" }).lean();

    // Filter foods inside each donation that are not expired
    const validDonations = donations
      .map((donation) => {
        const validFoods = donation.foods.filter((food) => {
          const expiryTime = new Date(donation.createdAt);
          expiryTime.setHours(expiryTime.getHours() + food.expiryDuration);
          return expiryTime > now; // not expired
        });
        if (validFoods.length > 0) {
          return { ...donation, foods: validFoods };
        }
        return null;
      })
      .filter((d) => d !== null);

    res.status(200).json({ donations: validDonations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
