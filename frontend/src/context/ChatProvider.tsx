import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

interface ChatContextType {
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User | undefined>>;
    selectedChat: Chat | undefined;
    setSelectedChat: Dispatch<SetStateAction<Chat | undefined>>;
    chats: Chat[] | undefined,
    setChats: Dispatch<SetStateAction<Chat[]>>;
    notifications: Message[] | undefined,
    setNotifications: Dispatch<SetStateAction<Message[]>>;

}


export const ChatContext = createContext<ChatContextType>({
    user: undefined,
    setUser: () => { },
    selectedChat: undefined,
    setSelectedChat: () => { },
    chats: undefined,
    setChats: () => { },
    notifications: undefined,
    setNotifications: () => { }
});

const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>();
    const [selectedChat, setSelectedChat] = useState<Chat>();
    const [chats, setChats] = useState<Chat[]>([]);
    const [notifications, setNotifications] = useState<Message[]>([]);
    const history = useHistory();

    console.log("s", selectedChat)
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        setUser(userInfo);
        console.log("called", userInfo);
        if (!userInfo) {
            history.push("/");
        }
    }, [history]);
    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
                notifications,
                setNotifications,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;
