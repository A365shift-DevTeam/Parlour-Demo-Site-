import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { createBeautyAgentMiddleware } from "./server/beautyAgent";

function beautyAgentPlugin(token?: string, model?: string): Plugin {
  const middleware = createBeautyAgentMiddleware({ token, model });

  return {
    name: "aurelia-beauty-agent",
    configureServer(server) {
      server.middlewares.use("/api/beauty-assistant", middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/beauty-assistant", middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), beautyAgentPlugin(env.HF_TOKEN, env.HF_MODEL)],
    build: {
      target: "es2020",
      cssCodeSplit: true,
      sourcemap: false,
    },
  };
});
