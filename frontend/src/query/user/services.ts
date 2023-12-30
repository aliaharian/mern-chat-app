import axios, { AxiosError } from "axios";

const login = async (formData: LoginCredentials) => {
  try {
    const { data } = await axios.post(
      "/api/user/login",
      formData
    );
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    } else {
      // handle other types of errors or rethrow if needed
      throw error;
    }
  }
};
const signUp = async (formData: SignupCredentials) => {
  try {
    const { data } = await axios.post(
      "/api/user",
      formData
    );
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    } else {
      // handle other types of errors or rethrow if needed
      throw error;
    }
  }
};


export {
  login,
  signUp
};