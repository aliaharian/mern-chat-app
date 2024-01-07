import axios from "axios";
import { ApiError, Chat } from "../../types/types";

const fetchChats = async () => {
    try {
        const { data } = await axios.get<Chat[]>("/api/chat");
        return data;
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};

const accessChat = async (userId: string) => {
    try {
        const { data } = await axios.post<Chat>("/api/chat", {
            userId,
        });
        return data;
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};

const createGroup = async (name: string, users: string) => {
    try {
        const { data } = await axios.post<Chat>("/api/chat/group", {
            name,
            users,
        });
        return data;
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};
const renameGroup = async (chatId: string, chatName: string) => {
    try {
        const { data } = await axios.put<Chat>("/api/chat/group/rename", {
            chatId,
            chatName,
        });
        return data;
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};
const deleteUserFromGroup = async (chatId: string, userId: string) => {
    try {
        const { data } = await axios.put<Chat>("/api/chat/group/removeMember", {
            chatId,
            userId,
        });
        return data;
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};
const addUserToGroup = async (chatId: string, userId: string) => {
    try {
        const { data } = await axios.put<Chat>("/api/chat/group/addMember", {
            chatId,
            userId,
        });
        return data;
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};

export {
    fetchChats,
    accessChat,
    createGroup,
    renameGroup,
    deleteUserFromGroup,
    addUserToGroup,
};
