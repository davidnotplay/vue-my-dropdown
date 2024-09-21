// eslint-disable-next-line no-undef
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*{.ts,.vue}'],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                'text-color': 'var(--color-text-color)',
                'primary-hover': 'var(--color-primary-hover)',
                'table-border-color': colors.gray[600],
                'table-secondray-bg-color': colors.gray[300],
            },
        },
    },
    plugins: [],
};
