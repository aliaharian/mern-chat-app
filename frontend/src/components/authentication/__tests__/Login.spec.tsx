import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "../Login";
import axiosMock from "../../../__mocks__/axios";

const queryClient = new QueryClient();

const MockedLogin = () => (
    <QueryClientProvider client={queryClient}>
        <Login />
    </QueryClientProvider>
);

describe("Login component view", () => {
    test("renders Login component", () => {
        render(<MockedLogin />);
    });
    test("updates email input value", () => {
        const { getByLabelText } = render(<MockedLogin />);
        const emailInput = getByLabelText("email-input") as HTMLFormElement;
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        expect(emailInput.value).toBe("test@example.com");
    });
    test("updates password input value", () => {
        const { getByLabelText } = render(<MockedLogin />);
        const passwordInput = getByLabelText(
            "password-input",
        ) as HTMLFormElement;
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        expect(passwordInput.value).toBe("password123");
    });
    test("toggles password visibility on button click", () => {
        const { getByText, getByLabelText } = render(<MockedLogin />);
        const showHideButton = getByText("show");
        const passwordInput = getByLabelText(
            "password-input",
        ) as HTMLInputElement;

        fireEvent.click(showHideButton);
        expect(passwordInput.type).toBe("text");

        fireEvent.click(showHideButton);
        expect(passwordInput.type).toBe("password");
    });
});

describe("Login component functionality", () => {
    beforeEach(() => {
        axiosMock.reset();
    });
    test("validate when inputs are empty", async () => {
        const { getByLabelText } = render(<MockedLogin />);
        const consoleSpy = vi.spyOn(console, "log");
        const loginButton = getByLabelText("submit-login-btn");
        fireEvent.click(loginButton);
        await waitFor(() => {
            // Check if console.log was called with the expected error message
            expect(consoleSpy).toHaveBeenCalledWith("error", expect.anything());
            // Restore the original console.log implementation
            consoleSpy.mockRestore();
        });
    });
    test("validate when user or pass is wrong", async () => {
        const { getByLabelText } = render(<MockedLogin />);
        const consoleSpy = vi.spyOn(console, "log");
        const passwordInput = getByLabelText(
            "password-input",
        ) as HTMLFormElement;
        const emailInput = getByLabelText("email-input") as HTMLFormElement;
        fireEvent.change(emailInput, { target: { value: "email@wrong.com" } });
        fireEvent.change(passwordInput, { target: { value: "wrongPassword" } });
        const loginButton = getByLabelText("submit-login-btn");
        fireEvent.click(loginButton);
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("error", expect.anything());
        });
    });
    test("login successfuly when user pass is correct", async () => {
        const { getByLabelText } = render(<MockedLogin />);
        const mockedUserCredentials = {
            email: "email@correct.com",
            password: "correctPassword",
        };
        axiosMock.onPost("/api/user/login").reply(200, {
            _id: "correctUserId",
            email: "email@correct.com",
            token: "reallyCorrectToken",
        });
        const passwordInput = getByLabelText(
            "password-input",
        ) as HTMLFormElement;
        const emailInput = getByLabelText("email-input") as HTMLFormElement;
        fireEvent.change(emailInput, {
            target: { value: mockedUserCredentials.email },
        });
        fireEvent.change(passwordInput, {
            target: { value: mockedUserCredentials.password },
        });
        const loginButton = getByLabelText("submit-login-btn");
        fireEvent.click(loginButton);
        await waitFor(() => {
            expect(localStorage.getItem("userInfo")).toEqual(
                JSON.stringify({
                    _id: "correctUserId",
                    email: mockedUserCredentials.email,
                    token: "reallyCorrectToken",
                }),
            );
        });
    });
});
