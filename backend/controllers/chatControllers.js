const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        res.status(400);
        throw new Error("user not found");
    }
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password -createdAt -updatedAt")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findById(createdChat._id).populate(
                "users",
                "-password",
            );
            res.status(200).send(fullChat);
        } catch (e) {
            res.status(400);
            throw new Error(e.message);
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    let isChat = await Chat.find({
        users: { $elemMatch: { $eq: req.user._id } },
    })
        .populate("users", "-password -createdAt -updatedAt")
        .populate("groupAdmin", "-password -createdAt -updatedAt")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });
    return req.gql ? isChat : res.status(200).send(isChat);
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        res.status(400);
        throw new Error("fill all the fields");
    }
    let users = JSON.parse(req.body.users);
    if (users.length < 1) {
        res.status(400);
        throw new Error("at least one user must be present in a group");
    }
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findById(groupChat._id)
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.send(fullGroupChat);
    } catch (e) {
        throw new Error(e);
    }
});

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    try {
        const chat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName,
            },
            {
                new: true,
            },
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.send(chat);
    } catch (e) {
        throw new Error(e);
    }
});
const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    try {
        let chat = await Chat.findById(chatId);
        if (chat) {
            console.log(chat.groupAdmin);
            console.log(req.user._id);
            if (chat.groupAdmin.toString() !== req.user._id.toString()) {
                res.status(400);
                throw new Error("only admin can add user");
            }
            await chat.updateOne(
                {
                    $push: { users: userId },
                },
                { new: true },
            );

            chat = await Chat.findById(chatId)
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            res.send(chat);
        }
    } catch (e) {
        throw new Error(e);
    }
});

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    try {
        let chat = await Chat.findById(chatId);
        if (chat) {
            if (chat.groupAdmin.toString() !== req.user._id.toString()) {
                res.status(400);
                throw new Error("only admin can remove user");
            }
            await chat.updateOne(
                {
                    $pull: { users: userId },
                },
                { new: true },
            );

            chat = await Chat.findById(chatId)
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            res.send(chat);
        }
    } catch (e) {
        throw new Error(e);
    }
});

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
};
