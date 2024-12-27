<script setup lang="ts">
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markup';
import {computed} from 'vue';

export type Languages = 'html' | 'javascript' | 'shell';

type MyEditorProps = {
    language: Languages;
    code: string;
};

// @TODO parse the code to improve the code visualization.
const props = defineProps<MyEditorProps>();

function highlightJsCode(code: string): string {
    return Prism.highlight(code, Prism.languages.javascript, 'javascript');
}

function highlightShellCode(code: string): string {
    return Prism.highlight(code, Prism.languages.shell, 'shell');
}

function highlightHtmlCode(code: string): string {
    return Prism.highlight(code, Prism.languages.html, 'html');
}

const code = computed<string>(() => {
    switch (props.language) {
        case 'javascript':
            return highlightJsCode(props.code);

        case 'shell':
            return highlightShellCode(props.code);

        case 'html':
            return highlightHtmlCode(props.code);

        default:
            return props.code;
    }
});

const codeClass = computed<string>(() => {
    switch (props.language) {
        case 'javascript':
            return 'language-javascript';

        case 'shell':
            return 'language-bash';

        case 'html':
            return 'language-html';

        default:
            return 'language-html';
    }
});
</script>

<template>
    <pre class="my-prism"><code :class="codeClass" v-html="code" /></pre>
</template>
