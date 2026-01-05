const express = require("express");
const router = express.Router();

const {
  createRequest,
  getAllRequests,
  approveRequest,
  declineRequest,
} = require("../controllers/verificationController");

// user
router.post("/", createRequest);

// admin
router.get("/", getAllRequests);
router.patch("/:id/approve", approveRequest);
router.patch("/:id/decline", declineRequest);

module.exports = router;
