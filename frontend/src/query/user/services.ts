import axios from "axios";
import {
    LoginCredentials,
    SignupCredentials,
    User,
    ApiError,
} from "../../types/types";

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
    try {
        const { data } = await axios.get<User[]>(`/api/user?search=${search}`);
        return data;
    } catch (error: unknown) {
        const err: ApiError = error as ApiError;
        throw new Error(err.response.data.message ?? "");
    }
};
export { login, signUp, searchUser };
