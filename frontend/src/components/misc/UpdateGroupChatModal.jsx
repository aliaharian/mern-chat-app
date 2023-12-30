import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem.jsx";
import UserBadgeItem from "../userAvatar/UserBadgeItem.jsx";
import PropTypes from "prop-types";
import { ChatState } from "../../context/ChatState.js";
import { Eye } from "iconsax-react";

const UpdateGroupChatModal = () =>
    // { fetchAgain, setFetchAgain }
    {
        const { user, chats, setChats, selectedChat, setSelectedChat } =
            ChatState();
        const { isOpen, onOpen, onClose } = useDisclosure();
        const [groupChatName, setGroupChatName] = useState(
            selectedChat.chatName,
        );
        const [selectedUsers, setSelectedUsers] = useState([
            ...selectedChat.users.filter((cUser) => cUser._id !== user._id),
        ]);
        const [search, setSearch] = useState("");
        const [searchResult, setSearchResult] = useState([]);
        const [loading, setLoading] = useState(false);
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
        const handleSearch = async (value) => {
            if (!value) {
                setSearchResult(null);
                return;
            }
            try {
                setLoading(true);
                const { data } = await axios.get(
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
                handleSearchCallback(search);
            }, 500);
            return () => clearTimeout(timeout);
        }, [search, handleSearchCallback]);

        const handleLeaveGroup = async () => {
            try {
                setLoading(true);
                await axios.put(
                    "/api/chat/group/removeMember",
                    {
                        chatId: selectedChat._id,
                        userId: user._id,
                    },
                    config,
                );
                const tmp = [...chats];
                const chatIndex = tmp.findIndex(
                    (t) => t._id === selectedChat._id,
                );
                tmp.splice(chatIndex, 1);
                console.log(tmp);
                setChats([...tmp]);
                setSelectedChat(null);
                onClose();
                setLoading(false);
                toast({
                    title: "You left group successfully!",
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
        const handleAddUser = async (user) => {
            if (selectedUsers.findIndex((x) => x._id === user._id) > -1) {
                toast({
                    title: "user already selected!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-left",
                });
                return;
            }
            try {
                setLoading(true);
                await axios.put(
                    "api/chat/group/addMember",
                    {
                        chatId: selectedChat._id,
                        userId: user._id,
                    },
                    config,
                );
                setSelectedUsers([...selectedUsers, user]);
                setLoading(false);
            } catch (e) {
                console.log(e);
                toast({
                    title: e?.response?.data?.message || "error Occurred!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-left",
                });
                setLoading(false);
            }
        };

        const handleDeleteUser = async (user) => {
            try {
                setLoading(true);
                await axios.put(
                    "api/chat/group/removeMember",
                    {
                        chatId: selectedChat._id,
                        userId: user._id,
                    },
                    config,
                );
                let tmp = selectedUsers;
                tmp.splice(selectedUsers.indexOf(user), 1);
                setSelectedUsers([...tmp]);
                setLoading(false);
                toast({
                    title: "deleted successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top-left",
                });
            } catch (e) {
                console.log(e);
                toast({
                    title: e?.response?.data?.message || "error Occurred!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-left",
                });
                setLoading(false);
            }
        };

        const handleRename = async () => {
            if (!groupChatName) {
                return;
            }
            try {
                setLoading(true);
                const { data } = await axios.put(
                    "/api/chat/group/rename",
                    {
                        chatId: selectedChat._id,
                        chatName: groupChatName,
                    },
                    config,
                );
                setSelectedChat(data);
                let chatsTmp = [...chats];
                chatsTmp = chatsTmp.map((chat) =>
                    chat._id === selectedChat._id
                        ? { ...chat, chatName: groupChatName }
                        : { ...chat },
                );
                setChats([...chatsTmp]);
                toast({
                    title: "successfully updated!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top-left",
                });
                setLoading(false);
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
        return (
            <>
                <IconButton
                    aria-label={"edit chat gorup"}
                    icon={<Eye />}
                    onClick={onOpen}
                />
                <Modal size={"lg"} isCentered isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader
                            display={"flex"}
                            fontSize={"40px"}
                            fontFamily={"Work Sans"}
                            justifyContent={"center"}
                        >
                            {selectedChat.chatName}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <Box
                                display={"flex"}
                                flexWrap={"wrap"}
                                alignItems={"flex-start"}
                                w={"100%"}
                                mb={4}
                            >
                                {selectedUsers.map((user) => (
                                    <UserBadgeItem
                                        handleDeleteUser={() =>
                                            handleDeleteUser(user)
                                        }
                                        user={user}
                                        key={user._id}
                                    />
                                ))}
                            </Box>
                            <FormControl>
                                <InputGroup>
                                    <Input
                                        placeholder={"chat name"}
                                        mb={3}
                                        value={groupChatName}
                                        onChange={(e) =>
                                            setGroupChatName(e.target.value)
                                        }
                                    />
                                    <InputRightElement width={"4.5em"}>
                                        <Button
                                            onClick={handleRename}
                                            bg={"#02898e"}
                                            color={"white"}
                                            _hover={{ bg: "#01767a" }}
                                            isLoading={loading}
                                        >
                                            <Text>update</Text>
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <Input
                                    placeholder={"add users"}
                                    mb={1}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </FormControl>

                            {loading ? (
                                <Spinner />
                            ) : (
                                searchResult
                                    ?.slice(0, 4)
                                    .map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() =>
                                                handleAddUser(user)
                                            }
                                        />
                                    ))
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                isLoading={loading}
                                colorScheme="red"
                                mr={3}
                                onClick={handleLeaveGroup}
                            >
                                Leave Group
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    };
UpdateGroupChatModal.propTypes = {
    fetchAgain: PropTypes.bool.isRequired,
    setFetchAgain: PropTypes.func.isRequired,
};

export default UpdateGroupChatModal;
