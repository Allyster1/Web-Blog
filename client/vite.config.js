import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        // Rewrite cookies to work with frontend origin
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            const cookies = proxyRes.headers["set-cookie"];
            if (cookies) {
              proxyRes.headers["set-cookie"] = cookies.map((cookie) => {
                // Remove Secure flag and Domain attribute, clean up any double semicolons
                return cookie
                  .replace(/;\s*Secure/gi, "")
                  .replace(/Domain=[^;]+/gi, "")
                  .replace(/;;+/g, ";") // Remove double semicolons
                  .replace(/;\s*$/, ""); // Remove trailing semicolon
              });
            }
          });
        },
        // Don't rewrite the path - backend routes expect /api prefix
        // Cookies are automatically forwarded by Vite proxy when credentials: 'include' is used
      },
    },
  },
});
