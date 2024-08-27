import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: 'src/vue-my-dropdown/index.ts',
            name: 'MyDropdown',
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
            include: ['src/vue-my-dropdown/index.ts'],
            outDir: 'dist/types', // Carpeta donde se guardarán los tipos
        }),
    ],
});
