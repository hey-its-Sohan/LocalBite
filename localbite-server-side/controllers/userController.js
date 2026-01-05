const User = require("../models/userModel");

const createUser = async (req, res) => {
  try {
    const { fullName, email, role, uid } = req.body;

    const user = await User.create({
      fullName,
      email,
      role,
      uid,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create or update user",
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find();
    if (!allUsers || allUsers.length === 0) {
      return res.json({
        message: "There is no user.",
      });
    }
    res.status(200).json({
      success: true,
      users: allUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const singleUser = await User.findOne({ uid });
    res.status(200).json({
      users: singleUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserRoleByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      role: user.role,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { fullName, locationLabel, avatar } = req.body;

    const user = await User.findOne({ uid });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (locationLabel) user.locationLabel = locationLabel;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      users: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOneAndDelete({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUser,
  getUserRoleByEmail,
  getSingleUser,
  updateUser,
  deleteUser,
};
