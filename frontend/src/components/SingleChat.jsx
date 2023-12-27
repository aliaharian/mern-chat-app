import PropTypes from "prop-types";
import { ChatState } from "../context/chatState.js";
import {
    Box,
    FormControl,
    IconButton,
    Input,
    Spinner,
    Text,
    useToast,
} from "@chakra-ui/react";
import { ArrowLeft } from "iconsax-react";
import { getSender } from "../config/chatLogics.js";
import ProfileModal from "./misc/ProfileModal.jsx";
import UpdateGroupChatModal from "./misc/UpdateGroupChatModal.jsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./styles.css";
import ScrollableChats from "./ScrollableChats.jsx";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const toast = useToast();
    const config = useMemo(
        () => ({
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        }),
        [user.token],
    );

    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.get(
                `/api/message?chatId=${selectedChat._id}`,
                config,
            );
            setMessages(data);
            console.log(data);
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
            toast({
                title: "error Occurred!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
        }
    };

    const fetchMessagesCallback = useCallback(fetchMessages, [
        config,
        selectedChat,
        toast,
    ]);

    useEffect(() => {
        selectedChat && fetchMessagesCallback();
    }, [selectedChat, fetchMessagesCallback]);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config,
                );
                console.log(data);
                setNewMessage("");
                setMessages([...messages, data]);
            } catch (e) {
                toast({
                    title: "error Occurred!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-left",
                });
            }
        }
    };
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    };
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
                    >
                        {loading ? (
                            <Spinner
                                size={"xl"}
                                h={20}
                                w={20}
                                alignSelf={"center"}
                                margin={"auto"}
                            />
                        ) : (
                            <div className={"messages"}>
                                <ScrollableChats messages={messages} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            <Input
                                variant={"filled"}
                                bg={"#e0e0e0"}
                                value={newMessage}
                                placeholder={"enter a message..."}
                                onChange={typingHandler}
                            />
                        </FormControl>
                    </Box>
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
