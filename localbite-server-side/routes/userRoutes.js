const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserRoleByEmail,
  getSingleUser,
  getAllUser,
  deleteUser,
} = require("../controllers/userController");

router.post("/users", createUser);
router.get("/users", getAllUser);

router.get("/users/role/:email", getUserRoleByEmail);

router.get("/users/:uid", getSingleUser);
router.put("/users/:uid", require("../controllers/userController").updateUser);

router.delete("/users/:uid", deleteUser);

module.exports = router;
