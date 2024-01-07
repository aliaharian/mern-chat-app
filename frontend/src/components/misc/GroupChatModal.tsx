import { ReactNode, useCallback, useEffect, useState } from "react";
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
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import PropTypes from "prop-types";
import { ChatState } from "../../context/chatState";
import { Chat, User } from "../../types/types";
import { useCreateGroup } from "../../query/chat/hooks";
import { useSearchUser } from "../../query/user/hooks";
import { useQueryClient } from "@tanstack/react-query";

const GroupChatModal = ({ children }: { children?: ReactNode }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const toast = useToast();
    const { setSelectedChat } = ChatState();
    const { mutate: createGroupMutation, loading } = useCreateGroup();
    const { mutate: searchUserMutation, loading: searchUserLoading } =
        useSearchUser();
    const queryClient = useQueryClient();
    const chats: Chat[] = queryClient.getQueryData(["chats"]) ?? [];
    const handleSearch = (value: string) => {
        if (!value) {
            setSearchResult([]);
            return;
        }
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

    const handleSubmit = (): void => {
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
        createGroupMutation(
            {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((x: User) => x._id)),
            },
            {
                onSuccess: (data) => {
                    queryClient.setQueryData(["chats"], [data, ...chats]);
                    setSelectedChat(data);
                    onClose();
                    toast({
                        title: "Group created successfully!",
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
            },
        );
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
                        {loading || searchUserLoading ? (
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
                            isLoading={loading || searchUserLoading}
                            colorScheme="blue"
                            mr={3}
                            onClick={() => {
                                handleSubmit();
                            }}
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
