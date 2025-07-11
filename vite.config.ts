import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const isTauri = process.env.TAURI_PLATFORM || mode === 'desktop';

  return {
    plugins: [
      vue(),
      VueI18nPlugin({
        /* options */
        // locale messages resource pre-compile option
        include: path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          './src/locales/**'
        ),
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: 'ws',
            host,
            port: 1421,
          }
        : undefined,
      watch: {
        // 3. tell vite to ignore watching `src-tauri`
        ignored: ['**/src-tauri/**'],
      },
    },
    // Define environment variables based on mode
    define: {
      __IS_TAURI__: isTauri,
      __IS_WEB__: !isTauri,
    },
    // Optimize dependencies to reduce file handle pressure
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'naive-ui',
        '@vicons/fluent',
        '@vicons/tabler',
        '@vicons/material',
      ],
      // Force pre-bundling of icon libraries to reduce file handles
      force: true,
    },
    // Conditionally modify build for web deployment
    build: {
      // For web builds, we can customize target
      target: isTauri ? 'esnext' : 'es2015',
      // When building for web, we might want to adjust output directory
      outDir: isTauri ? 'dist' : 'web-dist',
      // Rollup options to handle too many open files
      rollupOptions: {
        // Limit concurrent file operations
        maxParallelFileOps: 2,
        output: {
          // Manual chunks to reduce file handle pressure
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'ui-vendor': ['naive-ui'],
            'icons': ['@vicons/fluent', '@vicons/tabler', '@vicons/material'],
            'editor': [
              '@tiptap/core',
              '@tiptap/starter-kit',
              '@tiptap/vue-3',
              '@tiptap/extension-highlight',
              '@tiptap/extension-table',
              '@tiptap/extension-task-list',
              '@tiptap/extension-task-item',
            ],
          },
        },
      },
    },
  };
});
