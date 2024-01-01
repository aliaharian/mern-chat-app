import { useState } from "react";
import { ChatState } from "../context/chatState.ts";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/misc/SideDrawer.tsx";
import MyChats from "../components/MyChats.tsx";
import ChatBox from "../components/ChatBox.tsx";

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState<boolean>(false);
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                w={"100%"}
                h={"91.5vh"}
                p={"10px"}
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <ChatBox
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                    />
                )}
            </Box>
        </div>
    );
};

export default ChatPage;
