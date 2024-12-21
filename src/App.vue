<script setup lang="ts">
import {onMounted, ref} from 'vue';
import MyExample from './MyExample.vue';
import MyEditor from './MyEditor.vue';
import BasicExample from '../public/examples/BasicExample.vue';
import ClickoutExample from '../public/examples/ClickoutExample.vue';
import PositionExample from '../public/examples/PositionExample.vue';
import AnchorExample from '../public/examples/AnchorExample.vue';
import AnimationExample from '../public/examples/AnimationExample.vue';
import CloseOpenExample from '../public/examples/CloseOpenExample.vue';

const usageCode = ref<string>('');
const basicExampleCode = ref<string>('');
const clickoutExampleCode = ref<string>('');
const positionExampleCode = ref<string>('');
const anchorExampleCode = ref<string>('');
const animationExampleCode = ref<string>('');
const closeOpenExampleCode = ref<string>('');

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
        {
            url: 'examples/AnimationExample.vue',
            state: animationExampleCode,
        },
        {
            url: 'examples/CloseOpenExample.vue',
            state: closeOpenExampleCode,
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
                    The <code>clickout</code> event is triggered whenever the user clicks anywhere
                    on the screen. This event provides two flags:
                </p>
                <ul>
                    <li>
                        <code>clickedInDropdown</code>: Indicates if the user clicked inside the
                        dropdown.
                    </li>
                    <li>
                        <code>clickedInAnchor</code>: Indicates if the user clicked on the anchor
                        element.
                    </li>
                </ul>
                <p>
                    These flags allow you to precisely determine the click location and handle
                    visibility logic. For example, you can use this event to hide the dropdown when
                    the user clicks outside both the dropdown and the anchor.
                </p>
            </template>
        </MyExample>
        <MyExample title="Anchor example" language="javascript" :code="anchorExampleCode">
            <template #description>
                <p>
                    The <code>anchor</code> property specifies the HTML element to which the
                    dropdown is anchored. This allows the dropdown to dynamically position itself
                    relative to the anchor element.
                </p>
                <p>
                    For instance, you can anchor the dropdown to a button or any other element to
                    maintain consistent positioning, even when the element moves or resizes.
                </p>
            </template>
            <AnchorExample />
        </MyExample>
        <MyExample title="Position example" language="javascript" :code="positionExampleCode">
            <template #description>
                <p>
                    The position property defines how the dropdown aligns relative to its anchor.
                    You can specify the horizontal (e.g., 'left', 'center', 'right') and vertical
                    (e.g., 'top', 'center', 'bottom') alignment.
                </p>
                <p>
                    For example, the configuration <code>['right', 'top', 'left', 'top']</code> will
                    place the dropdown to the right of the anchor and then adjust as needed for
                    different screen sizes or anchor states.
                </p>
            </template>
            <PositionExample />
        </MyExample>

        <MyExample title="Animation example" language="javascript" :code="animationExampleCode">
            <template #description>
                <p>
                    The animation property allows you to customize the opening and closing
                    transitions of the dropdown. You can use predefined transitions such as 'fade',
                    'slide', or create your own by defining CSS animations.
                </p>
                <p>
                    For instance, the example here demonstrates a custom animation where the
                    dropdown expands and collapses with a smooth transition.
                </p>
            </template>
            <AnimationExample />
        </MyExample>

        <MyExample
            title="Close and open event example"
            language="javascript"
            :code="closeOpenExampleCode"
        >
            <CloseOpenExample />

            <template #description>
                <p>
                    The dropdown emits <code>open</code> and <code>close</code> events whenever its
                    visibility changes. These events can be used to track the dropdown's state or
                    trigger additional actions in your application.
                </p>
                <p>
                    For example, you can use the <code>open</code> event to load data dynamically or
                    the <code>close</code> event to clean up resources.
                </p>
            </template>
        </MyExample>
    </div>
</template>
