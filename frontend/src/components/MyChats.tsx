import { useEffect, useState } from "react";
import { ChatState } from "../context/chatState";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { Add } from "iconsax-react";
import ChatLoading from "./ChatLoading.tsx";
import { getSender } from "../config/chatLogics";
import GroupChatModal from "./misc/GroupChatModal";
import PropTypes from "prop-types";
import { User } from "../types/types.ts";
import { useFetchChats } from "../query/chat/hooks.ts";

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState<User>();
    const { selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();
    const { data: chats, isError } = useFetchChats();

    useEffect(() => {
        isError &&
            toast({
                title: "error Occurred!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
    }, [isError, toast]);

    useEffect(() => {
        chats &&
            setLoggedUser(
                JSON.parse(localStorage.getItem("userInfo") ?? "{}") as User,
            );
    }, [chats]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir={"column"}
            alignItems={"center"}
            p={3}
            bg={"white"}
            w={{ base: "100%", md: "31%" }}
            borderRadius={"lg"}
            borderWidth={"1px"}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily={"Work Sans"}
                display={"flex"}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display={"flex"}
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<Add />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display={"flex"}
                flexDir={"column"}
                p={3}
                bg={"#f8f8f8"}
                width={"100%"}
                h={"100%"}
                borderRadius={"lg"}
                overflowY={"hidden"}
            >
                {chats ? (
                    <Stack overflowY={"scroll"}>
                        {chats.map((chat) => (
                            <Box
                                onClick={() => {
                                    setSelectedChat(chat);
                                }}
                                cursor={"pointer"}
                                bg={
                                    selectedChat?._id === chat._id
                                        ? "#38B2AC"
                                        : "#E8E8E8"
                                }
                                color={
                                    selectedChat?._id === chat._id
                                        ? "white"
                                        : "black"
                                }
                                px={3}
                                py={2}
                                borderRadius={"lg"}
                                key={chat._id}
                            >
                                <Text>
                                    {loggedUser && !chat.isGroupChat
                                        ? getSender(loggedUser, chat.users).name
                                        : chat.chatName}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
};

MyChats.propTypes = {
    fetchAgain: PropTypes.bool.isRequired,
};

export default MyChats;
