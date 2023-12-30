import { useContext } from "react";
import { ChatContext } from "./ChatProvider.js";

export const ChatState = () => {
    return useContext(ChatContext);
};
