import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login.tsx";
import Signup from "../components/authentication/Signup.tsx";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { User } from "../types/types.ts";

const HomePage = () => {
    const history = useHistory();
    useEffect(() => {
        const userInfo: User = JSON.parse(
            localStorage.getItem("userInfo") ?? "{}",
        ) as User;
        if (userInfo.token) {
            history.push("/chats");
        }
    }, [history]);
    return (
        <Container maxW="xl" centerContent>
            <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                p={3}
                bg={"white"}
                w={"100%"}
                borderRadius={6}
                my={4}
                borderWidth={1}
            >
                <Text
                    fontSize={"4xl"}
                    fontFamily={"Work Sans"}
                    textAlign={"center"}
                >
                    Echo Talk!
                </Text>
            </Box>
            <Box
                display={"flex"}
                bg={"white"}
                p={3}
                w={"100%"}
                borderRadius={6}
            >
                <Tabs variant={"soft-rounded"} w={"100%"}>
                    <TabList mb={1}>
                        <Tab w={"50%"} aria-label="login-btn">
                            Login
                        </Tab>
                        <Tab w={"50%"} aria-label="signup-btn">
                            Signup
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default HomePage;
