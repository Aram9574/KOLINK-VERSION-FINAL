import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, ".", "");
    return {
        // Output to a separate folder to avoid nuking the web build
        build: {
            outDir: "dist-mobile",
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, "mobile.html"), // FORCE mobile.html as entry
                },
            },
        },
        // Server config doesn't matter much for build, but kept for consistency
        server: {
            port: 3000,
            host: "0.0.0.0",
        },
        plugins: [react()],
        define: {
            "process.env.GOOGLE_CLIENT_ID": JSON.stringify(
                env.GOOGLE_CLIENT_ID,
            ),
            "process.env.GOOGLE_API_KEY": JSON.stringify(env.GOOGLE_API_KEY),
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "."),
            },
        },
    };
});
