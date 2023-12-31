export interface SignupCredentials {
    name: string;
    email: string;
    confirmPassword?: string;
    password: string;
    pic?: string | null;
}
export interface User {
    _id: string;
    name: string;
    email: string;
    token?: string | null;
    pic?: string | null;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface Message {
    _id: string;
    sender: User;
    content: string;
    chat: string | Chat;
    createdAt?: string;
    updatedAt?: string;
}
export interface Chat {
    chatName: string;
    createdAt?: string;
    isGroupChat: boolean;
    latestMessage?: Message;
    updatedAt?: string;
    users: User[];
    _id: string;
}

export interface ApiError {
    response: {
        data: {
            message: string | null;
        };
    };
}
