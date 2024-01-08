import { useCallback, useEffect, useState } from "react";
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
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import PropTypes from "prop-types";
import { ChatState } from "../../context/chatState";
import { Eye } from "iconsax-react";
import { Chat, User } from "../../types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchUser } from "../../query/user/hooks";
import {
    useAddUserToGroup,
    useRemoveUserFromGroup,
    useRenameGroup,
} from "../../query/chat/hooks";

const UpdateGroupChatModal = () =>
    // { fetchAgain, setFetchAgain }
    {
        const { user, selectedChat, setSelectedChat } = ChatState();
        const { isOpen, onOpen, onClose } = useDisclosure();
        const [groupChatName, setGroupChatName] = useState<string>(
            selectedChat?.chatName ?? "",
        );
        const queryClient = useQueryClient();
        const chats: Chat[] = queryClient.getQueryData(["chats"]) ?? [];
        const [selectedUsers, setSelectedUsers] = useState<User[]>(
            selectedChat
                ? [
                      ...selectedChat.users.filter(
                          (cUser) => cUser._id !== user?._id,
                      ),
                  ]
                : [],
        );
        const [search, setSearch] = useState("");
        const [searchResult, setSearchResult] = useState<User[]>([]);
        const [loading, setLoading] = useState(false);
        const { mutate: searchUserMutation } = useSearchUser();
        const { mutate: renameGroupMutation } = useRenameGroup();
        const { mutate: addUserMutation } = useAddUserToGroup();
        const { mutate: removeUserMutation } = useRemoveUserFromGroup();
        const toast = useToast();

        const handleSearch = (value: string) => {
            if (!value) {
                setSearchResult([]);
                return;
            }
            setLoading(true);
            searchUserMutation(value, {
                onSuccess: (data) => {
                    setSearchResult(data);
                },
                onError: () => {
                    toast({
                        title: "error Occurred!",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top-left",
                    });
                },
                onSettled: () => {
                    setLoading(false);
                },
            });
        };
        const handleSearchCallback = useCallback(handleSearch, [
            searchUserMutation,
            toast,
        ]);

        useEffect(() => {
            const timeout = setTimeout(() => {
                handleSearchCallback(search);
            }, 500);
            return () => {
                clearTimeout(timeout);
            };
        }, [search, handleSearchCallback]);

        const handleLeaveGroup = () => {
            setLoading(true);
            user &&
                selectedChat &&
                removeUserMutation(
                    {
                        chatId: selectedChat._id,
                        userId: user._id,
                    },
                    {
                        onSuccess: () => {
                            const tmp = [...chats];
                            const chatIndex = tmp.findIndex(
                                (t) => t._id === selectedChat._id,
                            );
                            tmp.splice(chatIndex, 1);
                            console.log(tmp);
                            queryClient.setQueryData(["chats"], [...tmp]);
                            setSelectedChat(undefined);
                            onClose();
                            toast({
                                title: "You left group successfully!",
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                                position: "top-left",
                            });
                        },
                        onError: () => {
                            toast({
                                title: "error Occurred!",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "top-left",
                            });
                        },
                        onSettled: () => {
                            setLoading(false);
                        },
                    },
                );
        };
        const handleAddUser = (user: User) => {
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
            setLoading(true);
            selectedChat &&
                addUserMutation(
                    {
                        chatId: selectedChat._id,
                        userId: user._id,
                    },
                    {
                        onSuccess: () => {
                            setSelectedUsers([...selectedUsers, user]);
                        },
                        onError: (e: unknown) => {
                            const errorMessage =
                                (
                                    e as {
                                        response?: {
                                            data?: { message?: string };
                                        };
                                    }
                                ).response?.data?.message ?? "error Occurred!";

                            toast({
                                title: errorMessage,
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "top-left",
                            });
                        },
                        onSettled: () => {
                            setLoading(false);
                        },
                    },
                );
        };

        const handleDeleteUser = (user: User) => {
            setLoading(true);
            selectedChat &&
                removeUserMutation(
                    {
                        chatId: selectedChat._id,
                        userId: user._id,
                    },
                    {
                        onSuccess: () => {
                            const tmp = selectedUsers;
                            tmp.splice(selectedUsers.indexOf(user), 1);
                            setSelectedUsers([...tmp]);
                            toast({
                                title: "deleted successfully",
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                                position: "top-left",
                            });
                        },
                        onError: (e: unknown) => {
                            const errorMessage =
                                (
                                    e as {
                                        response?: {
                                            data?: { message?: string };
                                        };
                                    }
                                ).response?.data?.message ?? "error Occurred!";
                            toast({
                                title: errorMessage,
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "top-left",
                            });
                        },
                        onSettled: () => {
                            setLoading(false);
                        },
                    },
                );
        };

        const handleRename = () => {
            if (!groupChatName) {
                return;
            }
            setLoading(true);
            selectedChat &&
                renameGroupMutation(
                    {
                        chatId: selectedChat._id,
                        chatName: groupChatName,
                    },
                    {
                        onSuccess: (data) => {
                            setSelectedChat(data);
                            let chatsTmp = [...chats];
                            chatsTmp = chatsTmp.map((chat) =>
                                chat._id === selectedChat._id
                                    ? { ...chat, chatName: groupChatName }
                                    : { ...chat },
                            );
                            queryClient.setQueryData(["chats"], [...chatsTmp]);

                            toast({
                                title: "successfully updated!",
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                                position: "top-left",
                            });
                        },
                        onError: () => {
                            toast({
                                title: "error Occurred!",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "top-left",
                            });
                        },
                        onSettled: () => {
                            setLoading(false);
                        },
                    },
                );
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
                            {selectedChat?.chatName}
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
                                        handleDeleteUser={() => {
                                            handleDeleteUser(user);
                                        }}
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
                                        onChange={(e) => {
                                            setGroupChatName(e.target.value);
                                        }}
                                    />
                                    <InputRightElement width={"4.5em"}>
                                        <Button
                                            onClick={() => {
                                                handleRename();
                                            }}
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
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                />
                            </FormControl>

                            {loading ? (
                                <Spinner />
                            ) : (
                                searchResult.slice(0, 4).map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => {
                                            handleAddUser(user);
                                        }}
                                    />
                                ))
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                isLoading={loading}
                                colorScheme="red"
                                mr={3}
                                onClick={() => {
                                    handleLeaveGroup();
                                }}
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
