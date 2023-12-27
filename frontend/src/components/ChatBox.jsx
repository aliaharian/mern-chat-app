import { ChatState } from "../context/ChatState.js";
import { Box } from "@chakra-ui/react";

const ChatBox = () => {
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
        ></Box>
    );
};
export default ChatBox;
