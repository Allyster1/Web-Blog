import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
   plugins: [tailwindcss(), react()],
   // server: {
   //    host: true, // must be true for ngrok to connect
   //    port: 5173,
   //    allowedHosts: ["princely-lossy-tera.ngrok-free.dev"],
   // },
});
