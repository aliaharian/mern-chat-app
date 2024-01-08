import PropTypes from "prop-types";
import { ChatState } from "../context/chatState";
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
import { getSender } from "../config/chatLogics";
import ProfileModal from "./misc/ProfileModal";
import UpdateGroupChatModal from "./misc/UpdateGroupChatModal";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./styles.css";
import ScrollableChats from "./ScrollableChats.tsx";
import io, { Socket } from "socket.io-client";
import { Chat, Message } from "../types/types.ts";
import { useFetchMessages, useSendMessage } from "../query/message/hooks.ts";
import { useQueryClient } from "@tanstack/react-query";

const ENDPOINT: string =
    (import.meta.env.VITE_SOCKET_URL as string | undefined) ??
    "http://localhost:5500";

let socket: Socket | undefined,
    selectedChatCompare: Chat | undefined,
    timeout: ReturnType<typeof setTimeout> | undefined;
interface SingleChatProps {
    fetchAgain: boolean;
    setFetchAgain: Dispatch<SetStateAction<boolean>>;
}
const SingleChat = ({ fetchAgain, setFetchAgain }: SingleChatProps) => {
    const {
        user,
        selectedChat,
        setSelectedChat,
        notifications,
        setNotifications,
    } = ChatState();
    const queryClient = useQueryClient();
    // const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>();
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const { data: messages, loading } = useFetchMessages(selectedChat);
    const toast = useToast();
    const { mutate: sendMessageMutation } = useSendMessage();
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => {
            setSocketConnected(true);
        });
        socket.on("typing", () => {
            setIsTyping(true);
        });
        socket.on("stop typing", () => {
            setIsTyping(false);
        });
    }, [user]);

    useEffect(() => {
        if (selectedChat) selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket?.on("message received", (newMessageReceived: Message) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !==
                    (newMessageReceived.chat as Chat)._id
            ) {
                if (!notifications?.includes(newMessageReceived)) {
                    setNotifications([
                        newMessageReceived,
                        ...(notifications ?? []),
                    ]);
                    queryClient
                        .invalidateQueries({ queryKey: ["chats"] })
                        .catch((e) => {
                            console.log(e);
                        });
                }
            } else {
                queryClient.setQueryData(
                    ["messages", { id: selectedChat?._id }],
                    [...(messages ?? []), newMessageReceived],
                );
            }
        });
    });

    const sendMessage = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === "Enter" && newMessage) {
            try {
                socket?.emit("stop typing", selectedChat?._id);
                setTyping(false);
                sendMessageMutation(
                    { message: newMessage, selectedChat },
                    {
                        onSuccess: (data?: Message) => {
                            console.log(data);
                            setNewMessage("");
                            queryClient.setQueryData(
                                ["messages", { id: selectedChat?._id }],
                                [...(messages ?? []), data],
                            );
                            socket?.emit("new message", data);
                        },
                    },
                );
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
    const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(newMessage);
        setNewMessage(e.target.value);
        if (!socketConnected) {
            return;
        }
        if (!typing) {
            setTyping(true);
            socket?.emit("typing", selectedChat?._id);
        }
        const lastTypingTime = new Date().getTime();
        const timerLength = 3000;
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket?.emit("stop typing", selectedChat?._id);
                setTyping(false);
            }
        }, timerLength);
    };
    console.log("noti", notifications);
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
                            aria-label="arrowLeft"
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowLeft />}
                            onClick={() => {
                                setSelectedChat(undefined);
                            }}
                        />
                        {user && !selectedChat.isGroupChat ? (
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
                        <FormControl
                            onKeyDown={(e) => {
                                sendMessage(e);
                            }}
                            isRequired
                            mt={3}
                        >
                            {isTyping ? (
                                <Text fontSize={"xl"}>is typing...</Text>
                            ) : (
                                <></>
                            )}
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
