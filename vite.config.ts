import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { collageJsCssPlugin } from '@collagejs/vite-css';
import { viteIife } from './vite-iife.js';
import { viteTest } from './vite-test.js';

// https://vite.dev/config/
export default defineConfig({
    plugins: [svelte(),
    collageJsCssPlugin({
        serverPort: 4444,
        projectId: 'cjs-imo',
        entryPoints: ['src/index.ts', 'src/imo-ui.ts'],
        assetFileNames: 'assets/[name][extname]',
    }),
    viteTest(),
    viteIife({
        entryPoints: 'src/imo/imo.ts',
    }),
    ],
    build: {
        minify: true,
        rollupOptions: {
            output: {
                entryFileNames: '[name].min.js',
            }
        }
    }
});
