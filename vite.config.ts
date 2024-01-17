
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
<<<<<<< HEAD
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react(), tsconfigPaths()],
  server: {
    host: "127.0.0.1",
    port: 8080,
  },
})
=======
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
});
>>>>>>> 76f6bdcf96f37b1b5cb87b5eb6866936f1bae985
