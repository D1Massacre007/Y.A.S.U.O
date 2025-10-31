import Chat from "../models/Chat.js";

// API Controller for creating a new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      name: "New Chat", // always "New Chat"
      userName: req.user.name,
    };

    const newChat = await Chat.create(chatData);
    // ✅ Remove 'message' to prevent accidental toasts
    res.json({ success: true, chat: newChat });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API Controller for fetching all chats
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, chats }); // ⚡ return as "chats" not "message"
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API Controller for deleting a chat
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;
    await Chat.findOneAndDelete({ _id: chatId, userId });
    res.json({ success: true }); // ✅ remove message here too if you want
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
