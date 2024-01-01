import { render, screen } from "@testing-library/react";
import HomePage from "../HomePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";

const queryClient = new QueryClient();

describe("Homepage component", () => {
    it("homepage renders successfully", () => {
        localStorage.removeItem("userInfo");
        render(
            <QueryClientProvider client={queryClient}>
                <HomePage />
            </QueryClientProvider>,
        );
        const homepage = screen.getByText(/Echo Talk!/i);
        expect(homepage).toBeInTheDocument();
    });
    it("component changes by clicking on signup button", async () => {
        localStorage.removeItem("userInfo");
        render(
            <QueryClientProvider client={queryClient}>
                <HomePage />
            </QueryClientProvider>,
        );
        const signup = screen.getByLabelText("signup-submit-form");
        expect(signup).not.toBeVisible();

        const signupBtn = screen.getByLabelText("signup-btn");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await userEvent.click(signupBtn);
        expect(signup).toBeVisible();
    });
});
