import {
    Avatar,
    Badge,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { Alarm, ArrowDown2, SearchNormal } from "iconsax-react";
import { useState } from "react";
import { ChatState } from "../../context/chatState";
import ProfileModal from "./ProfileModal.tsx";
import { useHistory } from "react-router-dom";
import ChatLoading from "../ChatLoading.tsx";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/chatLogics";
import { Chat, Message, User } from "../../types/types";
import { useAccessChat } from "../../query/chat/hooks.ts";
import { useSearchUser } from "../../query/user/hooks.ts";
import { useQueryClient } from "@tanstack/react-query";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const { mutate: accessChatMutation, loading: loadingChat } =
        useAccessChat();
    const { mutate: searchUserMutation, loading: loading } = useSearchUser();
    const { user, setSelectedChat, notifications, setNotifications } =
        ChatState();
    const queryClient = useQueryClient();
    const chats: Chat[] = queryClient.getQueryData(["chats"]) ?? [];
    console.log("chaaaa", chats);
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };
    const handleSearch = () => {
        if (!search) {
            toast({
                title: "please enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        searchUserMutation(search, {
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

    const accessChat = (userId: string) => {
        accessChatMutation(userId, {
            onSuccess: (data) => {
                setSelectedChat(data);
                if (!chats.find((x) => x._id === data._id))
                    queryClient.setQueryData(["chats"], [data, ...chats]);
                onClose();
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
    return (
        <>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                bg={"white"}
                alignItems={"center"}
                w={"100%"}
                p={"5px 10px"}
                borderWidth={"5px"}
            >
                <Tooltip
                    label={"search user to chat"}
                    hasArrow
                    placement={"bottom-end"}
                >
                    <Button variant={"ghost"} onClick={onOpen}>
                        <SearchNormal />
                        <Text
                            fontFamily={"Work Sans"}
                            display={{ base: "none", md: "flex" }}
                            px={4}
                        >
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize={"2xl"} fontFamily={"Work Sans"}>
                    Echo Talk!
                </Text>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Menu>
                        <MenuButton p={1}>
                            {notifications && notifications.length > 0 && (
                                <Badge
                                    position={"absolute"}
                                    colorScheme={"red"}
                                >
                                    {notifications.length}
                                </Badge>
                            )}
                            <Alarm />
                        </MenuButton>
                        <MenuList pl={2}>
                            {notifications &&
                                !notifications.length &&
                                "no new messages"}
                            {user &&
                                notifications?.map((notif: Message) => (
                                    <MenuItem
                                        key={notif._id}
                                        onClick={() => {
                                            setSelectedChat(notif.chat as Chat);
                                            setNotifications(
                                                notifications.filter(
                                                    (n: Message) =>
                                                        (n.chat as Chat)._id !==
                                                        (notif.chat as Chat)
                                                            ._id,
                                                ),
                                            );
                                        }}
                                    >
                                        {(notif.chat as Chat).isGroupChat
                                            ? `new message in ${
                                                  (notif.chat as Chat).chatName
                                              }`
                                            : `new message from ${
                                                  getSender(
                                                      user,
                                                      (notif.chat as Chat)
                                                          .users,
                                                  ).name
                                              }: ${notif.content}`}
                                    </MenuItem>
                                ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton
                            ml={2}
                            as={Button}
                            rightIcon={<ArrowDown2 />}
                        >
                            <Avatar
                                size={"sm"}
                                cursor={"pointer"}
                                name={user?.name ?? ""}
                                src={user?.pic ?? undefined}
                            />
                        </MenuButton>
                        {user && (
                            <MenuList>
                                <ProfileModal user={user}>
                                    <MenuItem>My Profile</MenuItem>
                                </ProfileModal>
                                <MenuDivider />
                                <MenuItem onClick={logoutHandler}>
                                    Logout
                                </MenuItem>
                            </MenuList>
                        )}
                    </Menu>
                </div>
            </Box>

            <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={"1px"}>
                        Search Users
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display={"flex"} pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                            />
                            <Button
                                onClick={() => {
                                    handleSearch();
                                }}
                            >
                                Go
                            </Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => {
                                        accessChat(user._id);
                                    }}
                                />
                            ))
                        )}
                        {loadingChat && (
                            <Spinner mx={"auto"} display={"flex"} />
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};
export default SideDrawer;
