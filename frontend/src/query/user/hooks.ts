import { useMutation } from "@tanstack/react-query";
import { login, searchUser, signUp } from "./services";
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../context/chatState";
import { LoginCredentials, SignupCredentials, User } from "../../types/types";

const useSignup = () => {
    const toast = useToast();
    const { setUser } = ChatState();
    const { mutate, isPending } = useMutation({
        mutationKey: ["signup"],
        mutationFn: (credentials: SignupCredentials) => {
            const { name, password, confirmPassword, email } = credentials;
            if (!name || !password || !confirmPassword || !email) {
                throw new Error("please fill all the fields");
            }
            if (password !== confirmPassword) {
                throw new Error("password is not equal with confirm password");
            }
            return signUp(credentials);
        },
        onSuccess: (data: User) => {
            setUser(data);
        },
        onError: (error) => {
            toast({
                title: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        },
    });
    return {
        mutate,
        loading: isPending,
    };
};

const useLogin = () => {
    const { setUser } = ChatState();
    const toast = useToast();
    const { mutate, isPending } = useMutation({
        mutationKey: ["login"],
        mutationFn: (credentials: LoginCredentials) => {
            const { password, email } = credentials;
            if (!password || !email) {
                throw new Error("please fill all the fields");
            }
            return login(credentials);
        },
        onSuccess: (data) => {
            setUser(data);
        },
        onError: (error) => {
            console.log("error", error);
            toast({
                title: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        },
    });
    return {
        mutate,
        loading: isPending,
    };
};

const useSearchUser = () => {
    const { mutate, isPending } = useMutation({
        mutationKey: ["searchUser"],
        mutationFn: (search: string) => {
            return searchUser(search);
        },
    });
    return {
        mutate,
        loading: isPending,
    };
};

export { useSignup, useLogin, useSearchUser };
