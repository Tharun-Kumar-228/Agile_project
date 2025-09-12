import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    foods: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true }, // kg or persons
        unit: { type: String, enum: ["kg", "persons"], required: true },
        photo: { type: String }, // URL to uploaded photo
        expiryDuration: { type: Number, required: true }, // duration in hours
      },
    ],

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String }, // optional
    },

    status: {
      type: String,
      enum: ["Pending", "Collected", "Distributed"],
      default: "Pending",
    },

    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "Donations",
  }
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
