import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useEffect,
    useState,
} from "react";
import { useHistory } from "react-router-dom";
import { Chat, Message, User } from "../types/types";

interface ChatContextType {
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User | undefined>>;
    selectedChat: Chat | undefined;
    setSelectedChat: Dispatch<SetStateAction<Chat | undefined>>;
    chats: Chat[] | undefined;
    setChats: Dispatch<SetStateAction<Chat[]>>;
    notifications: Message[] | undefined;
    setNotifications: Dispatch<SetStateAction<Message[]>>;
}

export const ChatContext = createContext<ChatContextType>({
    user: undefined,
    setUser: () => {
        console.log("selecting user");
    },
    selectedChat: undefined,
    setSelectedChat: () => {
        console.log("selecting current chat");
    },
    chats: undefined,
    setChats: () => {
        console.log("selecting chats");
    },
    notifications: undefined,
    setNotifications: () => {
        console.log("selecting notifications");
    },
});

const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>();
    const [selectedChat, setSelectedChat] = useState<Chat>();
    const [chats, setChats] = useState<Chat[]>([]);
    const [notifications, setNotifications] = useState<Message[]>([]);
    const history = useHistory();

    useEffect(() => {
        const userInfo: User = JSON.parse(
            localStorage.getItem("userInfo") ?? "{}",
        ) as User;

        setUser(userInfo);
        console.log("called", userInfo);
        if (!userInfo.token) {
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
