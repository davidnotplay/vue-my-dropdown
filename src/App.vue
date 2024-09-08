<script setup lang="ts">
import {onMounted, ref} from 'vue';
import MyDropdown from './vue-my-dropdown/MyDropdown.vue';
import MyExample from './MyExample.vue';
import MyEditor, {Languages} from './MyEditor.vue';

type Code = {
    language: Languages;
    code: string;
};

const usageCode = ref<Code>({language: 'javascript', code: ''});
const buttonBasicExample = ref<HTMLElement | null>(null);
const visibleBasicExample = ref<boolean>(false);
const htmlBasicExample = ref<Code>({language: 'html', code: ''});

onMounted(async () => {
    const htmls = [
        {
            url: 'examples/install.js',
            state: usageCode,
        },
        {
            url: 'examples/basic-example.html',
            state: htmlBasicExample,
        },
    ];

    for (const {url, state} of htmls) {
        const response = await fetch(`${url}`);
        state.value = {
            code: await response.text(),
            language: state.value.language,
        };
    }
});
</script>

<template>
    <div class="my-main-cover">
        <img src="/images/vue.svg" alt="vue logo" class="size-2/4" />
        <p class="text-center">Simple and powerfull dropdown for Vuejs</p>
        <div class="mt-8">
            <a
                href="https://github.com/davidnotplay/vue-my-dropdown"
                class="my-button"
                target="_blank"
            >
                Github
            </a>
        </div>
    </div>
    <div class="my-content">
        <h1>Requirements</h1>
        <p>
            <code> vuejs >= 3.3 </code>
        </p>
        <h1>Usage</h1>
        You use node and npm to install vue-my-dropdown lib.
        <MyEditor language="shell" code="npm install --save vue-my-dropdown" />
        Now you can import and use vue-my-dropdown in your project.
        <MyEditor :language="usageCode.language" :code="usageCode.code" />

        <h1>Examples</h1>
        <MyExample
            title="Basic example"
            :code="htmlBasicExample.code"
            :language="htmlBasicExample.language"
        >
            <template #default>
                <div>
                    <button
                        ref="buttonBasicExample"
                        type="button"
                        class="my-button"
                        @click="visibleBasicExample = !visibleBasicExample"
                    >
                        Click me
                    </button>
                    <MyDropdown :visible="visibleBasicExample" :link="buttonBasicExample">
                        <div className="my-dropdown">My first dropdown</div>
                    </MyDropdown>
                </div>
            </template>
        </MyExample>
    </div>
</template>
