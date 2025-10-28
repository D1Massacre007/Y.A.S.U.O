import Chat from "../models/Chat.js"; 
import User from "../models/User.js";
import axios from "axios";
import imagekit from "../configs/imagekit.js";
import { GoogleGenAI } from "@google/genai"; // Node.js SDK

// Initialize Google Gemini client
const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Text message controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 1)
            return res.json({ success: false, message: "You dont have enough credits" });

        const { chatId, prompt } = req.body;
        const chat = await Chat.findById(chatId);
        if (!chat) return res.json({ success: false, message: "Chat not found" });

        // User message
        chat.messages.push({
            sender: req.user._id.toString(),
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            isPublished: false
        });

        // Generate content with Google Gemini
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const replyText = response.text || "No response from Gemini";

        // Assistant message
        const reply = {
            sender: "assistant",
            role: "assistant",
            content: replyText,
            timestamp: Date.now(),
            isImage: false,
            isPublished: false
        };

        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

        // Return reply as single object
        res.json({ success: true, reply });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Image message controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 2)
            return res.json({ success: false, message: "You dont have enough credits" });

        const { prompt, chatId, isPublished } = req.body;
        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) return res.json({ success: false, message: "Chat not found" });

        // User message
        chat.messages.push({
            sender: req.user._id.toString(),
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            isPublished: false
        });

        const encodedPrompt = encodeURIComponent(prompt);
        const generateImageUrl = `${process.env.IMAGE_KIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/Y.A.S.U.O/${Date.now()}.png?tr=w-800,h-800`;

        const aiImageResponse = await axios.get(generateImageUrl, { responseType: "arraybuffer" });
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

        // Make folder name URL-safe
        const folderName = "Y.A.S.U.O".replace(/[^a-zA-Z0-9_-]/g, "_"); // Y_A_S_U_O

        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: folderName,
        });

        // Assistant message
        const reply = {
            sender: "assistant",
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        };

        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

        // Return reply as single object
        res.json({ success: true, reply });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
