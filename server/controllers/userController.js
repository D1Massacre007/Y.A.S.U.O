import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Chat from '../models/Chat.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ✅ REGISTER USER — always start with a blank chat
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    // 🧹 Ensure brand new users have a clean chat space
    await Chat.deleteMany({ userId: user._id });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      message: "Registration successful — fresh chat initialized",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ LOGIN USER — keeps old chats
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = generateToken(user._id);
        return res.json({ success: true, token });
      }
    }
    return res.json({ success: false, message: "Invalid email or password" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ GET USER
export const getUser = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ GET PUBLISHED IMAGES
export const getPublishedImages = async (req, res) => {
  try {
    const getPublishedImages = await Chat.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isImage": true,
          "messages.isPublished": true,
        },
      },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName",
        },
      },
    ]);

    res.json({ success: true, images: getPublishedImages.reverse() });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
