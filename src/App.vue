<script setup lang="ts">
import {onMounted, ref} from 'vue';
import MyExample from './MyExample.vue';
import MyEditor from './MyEditor.vue';
import BasicExample from '../public/examples/BasicExample.vue';
import ClickoutExample from '../public/examples/ClickoutExample.vue';
import PositionExample from '../public/examples/PositionExample.vue';
import AnchorExample from '../public/examples/AnchorExample.vue';

const usageCode = ref<string>('');
const basicExampleCode = ref<string>('');
const clickoutExampleCode = ref<string>('');
const positionExampleCode = ref<string>('');
const anchorExampleCode = ref<string>('');

onMounted(async () => {
    const htmls = [
        {
            url: 'examples/install.js',
            state: usageCode,
        },
        {
            url: 'examples/BasicExample.vue',
            state: basicExampleCode,
        },
        {
            url: 'examples/ClickoutExample.vue',
            state: clickoutExampleCode,
        },
        {
            url: 'examples/PositionExample.vue',
            state: positionExampleCode,
        },
        {
            url: 'examples/AnchorExample.vue',
            state: anchorExampleCode,
        },
    ];

    for (const {url, state} of htmls) {
        state.value = await (await fetch(`${url}`)).text();
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
        <MyEditor :code="usageCode" language="javascript" />

        <h1>Examples</h1>
        <MyExample title="Basic example" language="javascript" :code="basicExampleCode">
            <BasicExample />
        </MyExample>
        <MyExample title="Clickout event" language="javascript" :code="clickoutExampleCode">
            <ClickoutExample />
            <template #description>
                <p>
                    The clickout event is triggered when the user clicks out of the Dropdown or the
                    button. You can use it, for example, to close the dropdown when clicks in of the
                    document.
                </p>
            </template>
        </MyExample>
        <MyExample title="Anchor property" language="javascript" :code="anchorExampleCode">
            <template #description>
                <p>
                    The anchor property is used select the HTML element where the dropdown is
                    anchored
                </p>
            </template>
            <AnchorExample />
        </MyExample>
        <MyExample title="Position example" language="javascript" :code="positionExampleCode">
            <PositionExample />
        </MyExample>
    </div>
</template>
