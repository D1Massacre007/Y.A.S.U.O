import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Chat from "../models/Chat.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ========================= REGISTER USER =========================
// Works for local signup and optional OAuth
export const registerUser = async (req, res) => {
  const { name, email, password, profilePic, oauthProvider } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic: profilePic || "", // can be Google/GitHub avatar
      oauthProvider: oauthProvider || "local",
    });

    // 🧹 Clean chat space
    await Chat.deleteMany({ userId: user._id });

    // 🆕 Create starter chat
    await Chat.create({
      userId: user._id,
      messages: [],
      name: "New Chat",
      userName: user.name,
    });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
      message: "Registration successful",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ========================= LOGIN USER =========================
// Local login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "Invalid email or password" });

    if (user.oauthProvider !== "local") {
      // OAuth user cannot login with password
      return res.json({
        success: false,
        message: `Please login with ${user.oauthProvider}`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
      message: "Login successful",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ========================= OAUTH LOGIN / REGISTER =========================
// Example: Google or GitHub login
export const oauthLogin = async (req, res) => {
  const { name, email, profilePic, provider } = req.body; // provider = "google" | "github"
  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Register new OAuth user
      user = await User.create({
        name,
        email,
        profilePic: profilePic || "",
        oauthProvider: provider,
      });

      // Create starter chat
      await Chat.create({
        userId: user._id,
        messages: [],
        name: "New Chat",
        userName: user.name,
      });
    } else {
      // Update profile pic if changed
      if (profilePic && profilePic !== user.profilePic) {
        user.profilePic = profilePic;
        await user.save();
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
      message: "Login successful",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ========================= GET USER =========================
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email profilePic oauthProvider credits"
    );
    if (!user)
      return res.json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ========================= GET PUBLISHED IMAGES =========================
export const getPublishedImages = async (req, res) => {
  try {
    const publishedImages = await Chat.aggregate([
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

    res.json({ success: true, images: publishedImages.reverse() });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
