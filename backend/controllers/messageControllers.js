const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

const fetchMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.query;
    if (!chatId) {
        throw new Error("provide chatId");
    }
    try {
        const chat = await Chat.findById(chatId);
        //check access of user
        if (!chat.users.includes(req.user._id)) {
            res.status(404);
            throw new Error("not found");
        }
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name pic")
            .sort({ updatedAt: -1 });

        res.send(messages);
    } catch (e) {
        throw new Error(e);
    }
});

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        throw new Error("invalid data");
    }
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        const chat = await Chat.findById(chatId);
        //check access of user
        if (!chat.users.includes(req.user._id)) {
            res.status(404);
            throw new Error("not found");
        }

        let message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        });
        res.json(message);
    } catch (e) {
        throw new Error(e);
    }
});
module.exports = {
    fetchMessages,
    sendMessage,
};
