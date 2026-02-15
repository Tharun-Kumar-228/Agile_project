import mongoose from "mongoose";

// Food item sub-schema
const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true }, // kg or persons
  unit: { type: String, enum: ["kg", "persons"], required: true },
  photo: { type: String }, // optional: URL/path
  expiryDuration: { type: Number, required: true }, // in hours
}, { _id: false });

// Location sub-schema
const locationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String, default: "" },
}, { _id: false });

/**
 * Donation Schema (Donor Side)
 */
const donationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foods: [foodItemSchema],
  location: locationSchema,
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Collected", "Distributed"],
    default: "Pending",
  },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // volunteer/receiver
  createdAt: { type: Date, default: Date.now },
}, { collection: "Donations" });

/**
 * Receive Schema (Receiver Side)
 */
const receiveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requestedFoods: [foodItemSchema],
  location: locationSchema,
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed"],
    default: "Pending",
  },
  linkedDonation: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", default: null },
  needsSupport: { type: Boolean, default: false }, // volunteer required
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now },
}, { collection: "Receives" });

// Models
const Donation = mongoose.model("Donation", donationSchema);
const Receive = mongoose.model("Receive", receiveSchema);

export { Donation, Receive };
