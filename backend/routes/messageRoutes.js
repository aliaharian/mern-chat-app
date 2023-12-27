const express = require("express");

const {
    fetchMessages,
    sendMessage,
} = require("../controllers/messageControllers");

const router = express.Router();

router.route("/").get(fetchMessages).post(sendMessage);

// router.route('/rename').put(createGroupChat)
module.exports = router;
