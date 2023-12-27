import {
    Avatar,
    Box,
    Drawer,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
    useDisclosure,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Input,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import { Alarm, ArrowDown2, SearchNormal } from "iconsax-react";
import { useState } from "react";
import { ChatState } from "../../context/ChatState.js";
import ProfileModal from "./ProfileModal.jsx";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading.jsx";
import UserListItem from "../userAvatar/UserListItem.jsx";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const { user, setSelectedChat, chats, setChats } = ChatState();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
        },
    };
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };
    const handleSearch = async () => {
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
        try {
            setLoading(true);

            const { data } = await axios.get(
                `/api/user?search=${search}`,
                config,
            );
            setSearchResult(data);
            setLoading(false);
        } catch (e) {
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

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const { data } = await axios.post(
                "/api/chat",
                {
                    userId,
                },
                config,
            );
            setSelectedChat(data);
            if (!chats.find((x) => x._id === data._id))
                setChats([data, ...chats]);
            setLoadingChat(false);
            onClose();
        } catch (e) {
            toast({
                title: "error Occurred!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            setLoadingChat(false);
        }
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
                    Chat App
                </Text>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Menu>
                        <MenuButton p={1}>
                            <Alarm />
                        </MenuButton>
                        {/*<MenuList>*/}
                        {/*    */}
                        {/*</MenuList>*/}
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
                                name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
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
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
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
