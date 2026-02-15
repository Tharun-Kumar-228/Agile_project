import express from "express";
import { Donation,Receive } from "../modals/donationModal.js";
const router = express.Router();


//For Recieve page Display pending not expired 
router.get("/donations/pending", async (req, res) => {
  try {
    const donations = await Donation.find({ status: "Pending" }).sort({ createdAt: -1 });
    res.json({ donations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


//Request Logic

// Routes/DonationRoutes.js
router.post("/recievers/donations/request/:donationId", async (req, res) => {
  try {
    const { donationId } = req.params;
    const { receiverId } = req.body;

    if (!receiverId) return res.status(400).json({ message: "receiverId is required" });

    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    // Only allow if donation has foods and is Pending
    if (!donation.foods.length) return res.status(400).json({ message: "Donation has no available foods" });

    // Create Receive record
    const receive = new Receive({
      userId: receiverId,
      requestedFoods: donation.foods, // you can select specific foods if needed
      location: donation.location,
      linkedDonation: donation._id,
      status: "Pending",
    });

    await receive.save();

    res.status(200).json({ message: "Donation requested successfully ✅", receive });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});


export default router;