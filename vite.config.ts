import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { cjsCssPlugin } from '@collagejs/vite-css';
import { viteIife } from './vite-iife.js';
import { viteTest } from './vite-test.js';

// https://vite.dev/config/
export default defineConfig({
    plugins: [svelte(),
    cjsCssPlugin({
        serverPort: 4444,
        projectId: 'cjs-imo',
        entryPoints: ['src/index.ts', 'src/const.js', 'src/imo-ui.ts'],
        assetFileNames: 'assets/[name][extname]',
    }),
    viteTest(),
    viteIife({
        entryPoints: 'src/imo/imo.ts',
    }),
    ],
    build: {
        minify: false,
        rollupOptions: {
            output: {
                entryFileNames: '[name].js',
            }
        }
    }
});
