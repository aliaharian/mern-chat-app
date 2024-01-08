import axios from "axios";
import { ApiError, Chat, Message } from "../../types/types";
import { FETCH_MESSAGES } from "./queries";

const fetchMessages = async (selectedChat?: Chat) => {
    try {
        if (selectedChat) {
            const {
                data: {
                    data: { messages },
                },
            } = await axios.post<{ data: { messages: Message[] } }>(
                "/graphql",
                {
                    query: FETCH_MESSAGES,
                    variables: { chatId: selectedChat._id },
                },
            );
            return messages;
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
