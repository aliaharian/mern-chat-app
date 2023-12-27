import PropTypes from "prop-types";
import { ChatState } from "../context/chatState.js";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowLeft } from "iconsax-react";
import { getSender } from "../config/chatLogics.js";
import ProfileModal from "./misc/ProfileModal.jsx";
import UpdateGroupChatModal from "./misc/UpdateGroupChatModal.jsx";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w={"100%"}
                        fontFamily={"Work Sans"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowLeft />}
                            onClick={() => setSelectedChat(null)}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users).name}
                                <ProfileModal
                                    user={getSender(user, selectedChat.users)}
                                />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display={"flex"}
                        flexDir={"column"}
                        justifyContent={"flex-end"}
                        p={3}
                        bg={"#e8e8e8"}
                        h={"100%"}
                        w={"100%"}
                        borderRadius={"lg"}
                        overflowY={"hidden"}
                    ></Box>
                </>
            ) : (
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    h={"100%"}
                >
                    <Text fontSize={"3xl"} pb={3} fontFamily={"Work Sans"}>
                        click on a chat to start conversation
                    </Text>
                </Box>
            )}
        </>
    );
};

SingleChat.propTypes = {
    fetchAgain: PropTypes.bool.isRequired,
    setFetchAgain: PropTypes.func.isRequired,
};
export default SingleChat;
