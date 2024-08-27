import {defineConfig, mergeConfig} from 'vitest/config';
import viteConfig from './vite-lib.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./vitest-setup.ts'],
            reporters: ['verbose'],
        },
    })
);
