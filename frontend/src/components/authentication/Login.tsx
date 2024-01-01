import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useLogin } from "../../query/user/hooks";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const { mutate, loading } = useLogin();
    const history = useHistory();
    const handleSubmit = () => {
        mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    localStorage.setItem("userInfo", JSON.stringify(data));
                    history.push("/chats");
                },
            },
        );
    };
    return (
        <VStack spacing={"5px"}>
            <FormControl id={"email"} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder={"enter your email"}
                    aria-label="email-input"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    value={email}
                />
            </FormControl>
            <FormControl id={"password"} isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        aria-label="password-input"
                        type={show ? "text" : "password"}
                        placeholder={"enter your password"}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        value={password}
                    />
                    <InputRightElement width={"4.5em"}>
                        <Button
                            onClick={() => {
                                setShow(!show);
                            }}
                        >
                            {show ? "hide" : "show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                mt={4}
                colorScheme={"blue"}
                isLoading={loading}
                aria-label="submit-login-btn"
                onClick={handleSubmit}
            >
                Login
            </Button>
        </VStack>
    );
};
export default Login;
