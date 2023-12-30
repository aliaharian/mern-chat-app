const express = require("express");

const {
    fetchMessages,
    sendMessage,
} = require("../controllers/messageControllers");

const router = express.Router();
const protect = require("../middlewares/authMiddleware");

router.route("/").get(protect, fetchMessages).post(protect, sendMessage);

module.exports = router;
