import { build, createLogger, type ConfigEnv, type LogLevel, type Plugin } from "vite";
import type { RollupOutput } from "rollup";

export type ViteIifeOptions = {
    entryPoints: string | string[];
}

const logger = createLogger('info', {
    prefix: 'vite-iife'
});

function log(level: LogLevel, message: string) {
    if (level === 'silent') return;
    logger[level](message, { timestamp: true });
}

let result: Awaited<ReturnType<typeof build>>;
// let avoidIifeEmission = false;
let viteEnv: ConfigEnv;

export function viteIife(options: ViteIifeOptions): Plugin {
    return {
        name: "vite-iife",
        config(_config, env) {
            viteEnv = env;
        },
        async generateBundle() {
            log('info', `Starting Vite IIFE build for entry points: ${Array.isArray(options.entryPoints) ? options.entryPoints.join(', ') : options.entryPoints}`);
            result = await build({
                configFile: false,
                logLevel: 'silent',
                build: {
                    minify: viteEnv.command === 'build',
                    target: 'esnext',
                    rollupOptions: {
                        input: options.entryPoints,
                        output: {
                            format: 'iife',
                            entryFileNames: '[name].min.js',
                        },
                        treeshake: true,
                    },
                    write: false,
                },
            });
            const emitChunks = (output: RollupOutput) => {
                for (const chunkOrAsset of Object.values(output.output)) {
                    if (chunkOrAsset.type === 'asset') {
                        this.emitFile({
                            type: 'asset',
                            fileName: chunkOrAsset.fileName,
                            source: chunkOrAsset.source,
                        });
                        log('info', `Emitted asset: ${chunkOrAsset.fileName}`);
                    }
                    else if (chunkOrAsset.type === 'chunk') {
                        this.emitFile({
                            type: 'prebuilt-chunk',
                            fileName: chunkOrAsset.fileName,
                            code: chunkOrAsset.code,
                        });
                        log('info', `Emitted chunk: ${chunkOrAsset.fileName}`);
                    }
                }
            };
            if (Array.isArray(result)) {
                for (const output of result) {
                    emitChunks(output);
                }
            }
            else if ((result as any).output) {
                emitChunks(result as RollupOutput);
            }
        },
    };
}