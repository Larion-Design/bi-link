// noinspection JSUnusedGlobalSymbols
import react from "@vitejs/plugin-react";
import { defineConfig, splitVendorChunkPlugin } from "vite";

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [
    react({
      babel: {
        babelrc: true,
      },
    }),
    splitVendorChunkPlugin(),
  ],
  preview: {
    port: 3000,
    strictPort: true,
  },
  clearScreen: false,
  server: {
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    chunkSizeWarningLimit: 8192,
    reportCompressedSize: false,
    target: ['es2021', 'chrome100', 'safari13'],
    minify: !process.env.TAURI_DEBUG || process.env.NODE_ENV === 'production' ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
