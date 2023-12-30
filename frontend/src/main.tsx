import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
import ChatProvider from "./context/ChatProvider.js";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <ChatProvider>
            <ChakraProvider>
                <App/>
            </ChakraProvider>
        </ChatProvider>
    </BrowserRouter>,
);
