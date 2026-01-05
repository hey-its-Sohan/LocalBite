const VerificationRequest = require("../models/verificationRequestModel");
const User = require("../models/userModel");

/* =========================
   Create Verification Request (User)
========================= */
exports.createRequest = async (req, res) => {
  try {
    const { uid } = req.body;

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const existing = await VerificationRequest.findOne({ uid });
    if (existing)
      return res.status(400).json({ message: "Request already submitted" });

    const request = await VerificationRequest.create({
      uid,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Get All Requests (Admin)
========================= */
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await VerificationRequest.find().sort({
      createdAt: -1,
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Approve Request (Admin)
========================= */
exports.approveRequest = async (req, res) => {
  try {
    const request = await VerificationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const user = await User.findOne({ uid: request.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    request.status = "approved";
    await request.save();

    res.json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Decline Request (Admin)
========================= */
exports.declineRequest = async (req, res) => {
  try {
    const request = await VerificationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "declined";
    await request.save();

    res.json({ message: "Request declined" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
