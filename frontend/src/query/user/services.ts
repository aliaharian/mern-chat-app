import axios from "axios";
import {
    LoginCredentials,
    SignupCredentials,
    User,
    ApiError,
} from "../../types/types";
import { SEARCH_USERS } from "./queries";
const login = async (formData: LoginCredentials) => {
    try {
        const { data } = await axios.post<User>("/api/user/login", formData);

        return data;
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};
const signUp = async (formData: SignupCredentials) => {
    try {
        const { data } = await axios.post<User>("/api/user", formData);
        return data;
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};

const searchUser = async (search: string) => {
    const query = SEARCH_USERS;
    try {
        const {
            data: {
                data: { users },
            },
        } = await axios.post<{ data: { users: User[] } }>(
            "/graphql",
            JSON.stringify({
                query,
                variables: { search },
            }),
        );
        return users;
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};
export { login, signUp, searchUser };
