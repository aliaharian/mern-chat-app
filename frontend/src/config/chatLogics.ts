import { Message, User } from "../types/types";

export const getSender = (loggedUser: User, users: User[]): User => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (
    messages: Message[],
    m: Message,
    i: number,
    userId: string,
): boolean => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            !messages[i + 1].sender._id) &&
        messages[i].sender._id !== userId
    );
};

export const isLastMessage = (
    messages: Message[],
    i: number,
    userId: string,
) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};
