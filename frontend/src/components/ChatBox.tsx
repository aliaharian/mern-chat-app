import { ChatState } from "../context/chatState.js";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat.js";
import PropTypes from "prop-types";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();
    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            flexDir={"column"}
            alignItems={"center"}
            p={3}
            bg={"white"}
            w={{ base: "100%", md: "68%" }}
            borderRadius={"lg"}
            borderWidth={"1px"}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

ChatBox.propTypes = {
    fetchAgain: PropTypes.bool.isRequired,
    setFetchAgain: PropTypes.func.isRequired,
};
export default ChatBox;
