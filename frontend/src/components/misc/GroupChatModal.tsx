import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem.js";
import UserBadgeItem from "../userAvatar/UserBadgeItem.js";
import PropTypes from "prop-types";
import { ChatState } from "../../context/chatState.js";
import { Chat, User } from "../../types/types.js";

const GroupChatModal = ({ children }: { children?: ReactNode }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { user, chats, setChats, setSelectedChat } = ChatState();
    const config = useMemo(
        () => ({
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
            },
        }),
        [user?.token],
    );
    const handleSearch = async (value: string) => {
        if (!value) {
            setSearchResult([]);
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.get<User[]>(
                `/api/user?search=${value}`,
                config,
            );
            setLoading(false);
            setSearchResult(data);
        } catch (e) {
            console.log(e);
            toast({
                title: "error Occurred!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
        }
    };
    const handleSearchCallback = useCallback(handleSearch, [config, toast]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            handleSearchCallback(search).catch((e: unknown) => {
                console.log(e);
            });
        }, 500);
        return () => {
            clearTimeout(timeout);
        };
    }, [search, handleSearchCallback]);

    const handleSubmit = async (): Promise<void> => {
        if (!groupChatName || selectedUsers.length < 1) {
            toast({
                title: "fill all fields!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.post<Chat>(
                "/api/chat/group",
                {
                    name: groupChatName,
                    users: JSON.stringify(
                        selectedUsers.map((x: User) => x._id),
                    ),
                },
                config,
            );
            setChats([data, ...(chats ?? [])]);
            setSelectedChat(data);
            onClose();
            setLoading(false);
            toast({
                title: "Group created successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
        } catch (e) {
            console.log(e);
            toast({
                title: "error Occurred!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            setLoading(false);
        }
    };
    const handleSelectUser = (user: User) => {
        if (selectedUsers.includes(user)) {
            toast({
                title: "user already selected!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, user]);
    };

    const handleDeleteUser = (user: User) => {
        const tmp = selectedUsers;
        tmp.splice(selectedUsers.indexOf(user), 1);
        setSelectedUsers([...tmp]);
    };
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal size={"lg"} isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display={"flex"}
                        fontSize={"40px"}
                        fontFamily={"Work Sans"}
                        justifyContent={"center"}
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        flexDirection={"column"}
                    >
                        <FormControl>
                            <Input
                                placeholder={"chat name"}
                                mb={3}
                                onChange={(e) => {
                                    setGroupChatName(e.target.value);
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder={"add users"}
                                mb={1}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                            />
                        </FormControl>
                        <Box
                            display={"flex"}
                            flexWrap={"wrap"}
                            alignItems={"flex-start"}
                            w={"100%"}
                        >
                            {selectedUsers.map((user) => (
                                <UserBadgeItem
                                    handleDeleteUser={() => {
                                        handleDeleteUser(user);
                                    }}
                                    user={user}
                                    key={user._id}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            <Spinner />
                        ) : (
                            searchResult.slice(0, 4).map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => {
                                        handleSelectUser(user);
                                    }}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            isLoading={loading}
                            colorScheme="blue"
                            mr={3}
                            onClick={() => void handleSubmit()}
                        >
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
GroupChatModal.propTypes = {
    children: PropTypes.node,
};

export default GroupChatModal;
