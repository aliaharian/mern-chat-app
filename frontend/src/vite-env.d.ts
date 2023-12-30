/// <reference types="vite/client" />

interface SignupCredentials {
    name: string;
    email: string;
    confirmPassword?: string;
    password: string;
    pic?: string | null;
}
interface User {
    _id: string;
    name: string;
    email: string;
    token?: string | null;
    pic?: string | null;
}
interface LoginCredentials {
    email: string;
    password: string;
}
interface Message {
    _id: string,
    sender: User,
    content: string,
    chat: string,
    createdAt?: string,
    updatedAt?: string

}
interface Chat {
    chatName: string,
    createdAt?: string,
    isGroupChat: boolean,
    latestMessage?: Message,
    updatedAt?: string
    users?: user[],
    _id: string
}
