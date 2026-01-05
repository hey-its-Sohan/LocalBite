const mongoose = require("mongoose");

const verificationRequestSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true, // one request per user
    },

    fullName: String,
    email: String,
    role: String,

    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "VerificationRequest",
  verificationRequestSchema
);
