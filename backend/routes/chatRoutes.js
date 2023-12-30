const express = require("express");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
} = require("../controllers/chatControllers");

const router = express.Router();
const groupRouter = express.Router({ mergeParams: true });
const protect = require("../middlewares/authMiddleware");

router.route("/").post(protect, accessChat).get(protect, fetchChats);
router.use("/group", groupRouter);
groupRouter.route("/").post(protect, createGroupChat);
groupRouter.route("/rename").put(protect, renameGroup);
groupRouter.route("/addMember").put(protect, addToGroup);
groupRouter.route("/removeMember").put(protect, removeFromGroup);

// router.route('/rename').put(createGroupChat)
module.exports = router;
