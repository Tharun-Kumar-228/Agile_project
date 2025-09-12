import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const donationSchema = new mongoose.Schema(
  {
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donation" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const receiveSchema = new mongoose.Schema(
  {
    receiveId: { type: mongoose.Schema.Types.ObjectId, ref: "Receive" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["donor", "ngo", "volunteer", "recipient", "admin"],
      required: true,
    },
    password: { type: String, required: true },
    donates: { type: [donationSchema], default: [] },
    receives: { type: [receiveSchema], default: [] },
  },
  { timestamps: true, collection: "Users" }
);

// 🔑 Hash password automatically before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
