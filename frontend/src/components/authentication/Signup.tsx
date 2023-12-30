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

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pic, setPic] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();
    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "ddt4rvxyr");
            fetch("https://api.cloudinary.com/v1_1/ddt4rvxyr/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    toast({
                        title: "avatar uploaded successfully",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                    setLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                    toast({
                        title: "upload Failed!try again",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                    setLoading(false);
                });
        } else {
            toast({
                title: "please select an image",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };
    const handleSubmit = async () => {
        setLoading(true);
        if (!name || !password || !confirmPassword || !email) {
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
        if (password !== confirmPassword) {
            toast({
                title: "password is not equal with confirm password",
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
                "/api/user",
                {
                    name,
                    email,
                    password,
                    pic,
                },
                config,
            );
            toast({
                title: "registration successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
        } catch (e) {
            toast({
                title: e.response.data.message,
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
            <FormControl id={"firstName"} isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder={"enter your name"}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    value={name}
                />
            </FormControl>
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
            <FormControl id={"confirmPassword"} isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder={"confirm your password"}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }}
                        value={confirmPassword}
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
            <FormControl id={"pic"} isRequired>
                <FormLabel>Avatar</FormLabel>
                <Input
                    type={"file"}
                    onChange={(e) => {
                        postDetails(e.target.files[0]);
                    }}
                />
            </FormControl>
            <Button
                isLoading={loading}
                mt={4}
                colorScheme={"blue"}
                onClick={handleSubmit}
            >
                Signup
            </Button>
        </VStack>
    );
};
export default Signup;
