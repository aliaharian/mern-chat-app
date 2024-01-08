import { ChatState } from "../context/chatState";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { Dispatch, SetStateAction } from "react";

interface ChatboxProps {
    fetchAgain: boolean;
    setFetchAgain: Dispatch<SetStateAction<boolean>>;
}
const ChatBox = ({ fetchAgain, setFetchAgain }: ChatboxProps) => {
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

export default ChatBox;
