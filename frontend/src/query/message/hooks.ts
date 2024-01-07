import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchMessages, sendMessage } from "./services";
import { Chat } from "../../types/types";

const useFetchMessages = (selectedChat?: Chat) => {
    const { data, isPending, isError } = useQuery({
        queryKey: ["messages", { id: selectedChat?._id }],
        queryFn: async () => await fetchMessages(selectedChat),
        throwOnError: true,
        enabled: selectedChat?._id ? true : false,
    });
    return {
        data,
        loading: isPending,
        isError,
    };
};
const useSendMessage = () => {
    const { mutate, isPending } = useMutation({
        mutationKey: ["sendMessage"],
        mutationFn: ({
            message,
            selectedChat,
        }: {
            message: string;
            selectedChat?: Chat;
        }) => {
            return sendMessage(message, selectedChat);
        },
    });
    return {
        mutate,
        loading: isPending,
    };
};

export { useFetchMessages, useSendMessage };
