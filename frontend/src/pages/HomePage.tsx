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

const HomePage = () => {
    const history = useHistory();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
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
                    chat app
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
                        <Tab w={"50%"}>Login</Tab>
                        <Tab w={"50%"}>Signup</Tab>
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
