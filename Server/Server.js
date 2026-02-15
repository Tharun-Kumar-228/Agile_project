import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import LoginRoutes from "./Routes/LoginRoutes.js";
import DonateRoutes from "./Routes/donationRoutes.js";
import path from "path";
import ReceiveRoutes from "./Routes/recieveRoutes.js";
import { Receive } from "./modals/donationModal.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
// Connect DB
connectDB();

// Use routes
app.use("/api", LoginRoutes); // Make sure LoginRoutes is imported correctly as default
app.use("/api",DonateRoutes);
app.use("/api",ReceiveRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
