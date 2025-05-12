import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Thay đổi từ @vitejs/plugin-react-swc sang @vitejs/plugin-react
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), // Sử dụng esbuild thay vì swc
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // Thêm cấu hình esbuild để xử lý JSX/TSX tốt hơn
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
}))
