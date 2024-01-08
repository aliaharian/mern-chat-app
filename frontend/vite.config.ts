/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:5500",
                changeOrigin: true,
                secure: false,
            },
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        css: true,
        include: [
            "src/**/__tests__/**/*.{js,ts,jsx,tsx}",
            "__tests__/**/*.{js,ts,jsx,tsx}",
            "**/*.test.{js,ts,jsx,tsx}",
            "**/*.spec.{js,ts,jsx,tsx}",
        ],
        setupFiles: "./src/test/setup.ts",
        browser: {
            enabled: false,
            name: "chrome", // browser name is required
        },
    },
});
