/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*{.ts,.vue}'],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                'text-color': 'var(--color-text-color)',
                'primary-hover': 'var(--color-primary-hover)',
            },
        },
    },
    plugins: [],
};
