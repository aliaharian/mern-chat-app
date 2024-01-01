import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "../Login";

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

describe.only("Login component functionality", () => {
    test("calls handleSubmit function on button click", async () => {
        const { getByLabelText } = render(<MockedLogin />);
        const loginButton = getByLabelText("submit-login-btn");
        fireEvent.click(loginButton);
        await waitFor(() => {
            const toast = screen.queryByText(/fill all/i);
            expect(toast).toBeInTheDocument();
        });
    });
});
