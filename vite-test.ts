import type { ImportMap } from '@collagejs/importmap';
import { readFile } from 'fs/promises';
import type { Plugin } from 'vite';

const testImportMap: ImportMap = {
    imports: {
        '@test/mfe01': 'http://localhost:5001/mfe01.min.js',
        '@test/mfe02': 'http://localhost:5002/mfe02.min.js',
    },
};

function getImoScript(): Promise<string> {
    return readFile('dist/imo.min.js', 'utf-8');
}


export function viteTest(): Plugin {
    return {
        name: 'vite-test',
        async transformIndexHtml(html) {
            return {
                tags: [
                    {
                        tag: 'script',
                        attrs: { type: 'overridable-importmap' },
                        children: JSON.stringify(testImportMap),
                    },
                    {
                        tag: 'script',
                        attrs: { type: 'text/javascript' },
                        children: await getImoScript(),
                    }
                ],
                html
            }
        }
    }
};
