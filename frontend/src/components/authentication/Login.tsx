import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();
    const handleSubmit = async () => {
        setLoading(true);
        if (!password || !email) {
            toast({
                title: "please fill all the fields",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user/login",
                {
                    email,
                    password,
                },
                config,
            );
            toast({
                title: "login successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
        } catch (e) {
            console.log(e);
            toast({
                title: e?.response?.data?.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing={"5px"}>
            <FormControl id={"email"} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder={"enter your email"}
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
                onClick={handleSubmit}
            >
                Signup
            </Button>
        </VStack>
    );
};
export default Login;
