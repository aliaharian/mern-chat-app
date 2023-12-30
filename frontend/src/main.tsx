import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./context/ChatProvider.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 10000,
        },
    },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <ChatProvider>
                <ChakraProvider>
                    <App />
                    <ReactQueryDevtools initialIsOpen={false} />
                </ChakraProvider>
            </ChatProvider>
        </BrowserRouter>
    </QueryClientProvider>,
);