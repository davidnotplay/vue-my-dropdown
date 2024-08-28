import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: 'src/vue-my-dropdown/index.ts',
            name: 'vue-my-dropdown',
            fileName: (format) => `vue-my-dropdown.${format}.js`,
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    publicDir: false,
    plugins: [
        vue(),
        dts({
            rollupTypes: true,
            include: ['src/vue-my-dropdown/index.ts', 'src/vue-my-dropdown/MyDropdown.vue'],
            outDir: 'dist',
            logLevel: 'info',
        }),
    ],
});
