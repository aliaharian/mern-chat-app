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

router.route("/").post(accessChat).get(fetchChats);
router.use("/group", groupRouter);
groupRouter.route("/").post(createGroupChat);
groupRouter.route("/rename").put(renameGroup);
groupRouter.route("/addMember").put(addToGroup);
groupRouter.route("/removeMember").delete(removeFromGroup);

// router.route('/rename').put(createGroupChat)
module.exports = router;
