import { useContext } from "react";
import { ChatContext } from "./ChatProvider";

export const ChatState = () => {
    return useContext(ChatContext);
};
