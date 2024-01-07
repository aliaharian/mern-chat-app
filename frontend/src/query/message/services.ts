import axios from "axios";
import { ApiError, Chat, Message } from "../../types/types";

const fetchMessages = async (selectedChat?: Chat) => {
    try {
        if (selectedChat) {
            const { data } = await axios.get<Message[]>(
                `/api/message?chatId=${selectedChat._id}`,
            );
            return data;
        }
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};
const sendMessage = async (newMessage: string, selectedChat?: Chat) => {
    try {
        if (selectedChat) {
            const { data } = await axios.post<Message>("/api/message", {
                content: newMessage,
                chatId: selectedChat._id,
            });
            return data;
        }
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};

export { fetchMessages, sendMessage };
