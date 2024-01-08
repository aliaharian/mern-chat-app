import { useMutation, useQuery } from "@tanstack/react-query";
import {
    accessChat,
    addUserToGroup,
    createGroup,
    deleteUserFromGroup,
    fetchChats,
    renameGroup,
} from "./services";

const useFetchChats = () => {
    const { data, isPending, isError } = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
        throwOnError: true,
    });
    return {
        data,
        loading: isPending,
        isError,
    };
};
const useAccessChat = () => {
    const { mutate, isPending } = useMutation({
        mutationKey: ["accessChat"],
        mutationFn: (userId: string) => {
            return accessChat(userId);
        },
    });
    return {
        mutate,
        loading: isPending,
    };
};
const useCreateGroup = () => {
    const { mutate, isPending } = useMutation({
        mutationKey: ["createGroup"],
        mutationFn: ({ name, users }: { name: string; users: string }) => {
            return createGroup(name, users);
        },
    });
    return {
        mutate,
        loading: isPending,
    };
};
const useRenameGroup = () => {
    const { mutate, isPending } = useMutation({
        mutationKey: ["renameGroup"],
        mutationFn: ({
            chatId,
            chatName,
        }: {
            chatId: string;
            chatName: string;
        }) => {
            return renameGroup(chatId, chatName);
        },
    });
    return {
        mutate,
        loading: isPending,
    };
};
const useRemoveUserFromGroup = () => {
    const { mutate, isPending } = useMutation({
        mutationKey: ["removeUserFromGroup"],
        mutationFn: ({
            chatId,
            userId,
        }: {
            chatId: string;
            userId: string;
        }) => {
            return deleteUserFromGroup(chatId, userId);
        },
    });
    return {
        mutate,
        loading: isPending,
    };
};
const useAddUserToGroup = () => {
    const { mutate, isPending } = useMutation({
        mutationKey: ["addUserToGroup"],
        mutationFn: ({
            chatId,
            userId,
        }: {
            chatId: string;
            userId: string;
        }) => {
            return addUserToGroup(chatId, userId);
        },
    });
    return {
        mutate,
        loading: isPending,
    };
};

export {
    useFetchChats,
    useAccessChat,
    useCreateGroup,
    useRenameGroup,
    useRemoveUserFromGroup,
    useAddUserToGroup,
};
