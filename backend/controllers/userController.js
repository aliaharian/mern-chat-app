const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("please fill all fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("user already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            pic: user.pic,
        });
    } else {
        res.status(400);
        throw new Error("failed to create user");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            pic: user.pic,
        });
    } else {
        res.status(400);
        throw new Error("user not found");
    }
});

//api/user?search=ali
const allUsers = asyncHandler(async (req, res) => {
    let keyword;

    if (req.query.search) {
        keyword = {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                {
                    email: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
            ],
        };
    } else {
        keyword = {};
    }

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    return req.gql === true ? users : res.send(users);
    // return users;
});

module.exports = { registerUser, loginUser, allUsers };
