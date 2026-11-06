import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {buildStyles} from './release/build-utils.mjs';

// Use the portable package's complete scoped tokens in the embedded example,
// so its theme is independent of the surrounding catalog document.
export function portableDemoStyles(){
  const id='\0tenvell-demo.css';
  return {name:'tenvell-portable-demo-styles',
    resolveId(source){if(source==='virtual:tenvell-demo.css')return id;},
    load(source){if(source===id)return buildStyles();},
  };
}

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client", "recharts"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(),portableDemoStyles()],
});
