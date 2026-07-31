import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin.js";
import { staticSiteWorker } from "./build/static-site-worker-plugin.js";

export default defineConfig({
  base: "./",
  plugins: [sites(), staticSiteWorker()]
});
