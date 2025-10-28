import Chat from "../models/Chat.js";

// API Controller for creating a new chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;

        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name,
        };
        await Chat.create(chatData);
        res.json({ success: true, message: "Chat created" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API Controller for fetching all chats
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
        res.json({ success: true, message: chats });
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
        res.json({ success: true, message: "Chat Deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};