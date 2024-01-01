import { render, screen } from "@testing-library/react";
import App from "./App";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

vi.mock("axios"); // Mock axios to isolate component behavior

describe("App component", () => {
    it("redirects to login page if token not set", () => {
        localStorage.removeItem("userInfo");
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>,
        );
        const homePage = screen.getAllByText(/Login/i); // Assuming a Login page btn text
        expect(homePage).toHaveLength(2);
    });

    it("renders the HomePage component by default if token sets!", () => {
        const mockedUserInfo = {
            token: "my-token",
        };
        localStorage.setItem("userInfo", JSON.stringify(mockedUserInfo));

        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>,
        );
        const homePage = screen.queryByText(/Login/i); // Assuming a Home Page title
        expect(homePage).not.toBeInTheDocument();
    });

    it("sets Authorization header with token from localStorage", () => {
        // Simulate a token in localStorage
        const mockedUserInfo = {
            token: "my-token",
        };
        localStorage.setItem("userInfo", JSON.stringify(mockedUserInfo));

        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>,
        );
        expect(axios.defaults.headers.common.Authorization).toBe(
            "Bearer my-token",
        );
    });

    it("sets Content-Type header for POST requests", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>,
        );
        expect(axios.defaults.headers.post["Content-Type"]).toBe(
            "application/json",
        );
    });
});
