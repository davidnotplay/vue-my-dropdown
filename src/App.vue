<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
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

const navMenuElement = ref<HTMLDivElement | null>(null);

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

function navMenuScroll() {
    if (!navMenuElement.value) {
        return;
    }

    navMenuElement.value.style.position = 'static';
    navMenuElement.value.style.top = 'auto';

    if (navMenuElement.value?.getBoundingClientRect().top < 0) {
        navMenuElement.value.style.position = 'fixed';
        navMenuElement.value.style.top = '0px';
    }
}

onMounted(() => {
    window.document.addEventListener('scroll', navMenuScroll);
});

onUnmounted(() => {
    window.document.removeEventListener('scroll', navMenuScroll);
});
</script>

<template>
    <div class="my-main-cover">
        <nav class="fixed left-0 top-0 z-50 w-full">
            <div class="container flex justify-between p-2">
                <ul class="flex list-none space-x-6">
                    <li>
                        <a href="#requirements" class="hover:underline">Requirements</a>
                    </li>
                    <li>
                        <a href="#usage" class="hover:underline">Usage</a>
                    </li>
                    <li>
                        <a href="#properties-events" class="hover:underline">Properties & Events</a>
                    </li>
                    <li>
                        <a href="#examples" class="hover:underline">Examples</a>
                    </li>
                </ul>
            </div>
        </nav>
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
        <footer
            class="fixed left-0 top-[calc(100vh-48px)] flex h-[48px] w-full bg-primary px-2 text-white"
        >
            <ul class="container m-0 flex list-none items-center gap-8 text-center align-middle">
                <li>
                    <a
                        href="https://github.com/davidnotplay"
                        target="_blank"
                        class="hover:underline"
                    >
                        Developed by <b>@davidnotplay</b>
                    </a>
                </li>
                <li>
                    <a
                        href="https://github.com/davidnotplay/vue-my-dropdown"
                        target="_blank"
                        class="hover:underline"
                    >
                        Star this Repo
                    </a>
                </li>
                <li>
                    <a
                        href="https://github.com/davidnotplay"
                        target="_blank"
                        class="hover:underline"
                    >
                        Follow on GitHub
                    </a>
                </li>
            </ul>
        </footer>
    </div>
    <div class="my-content">
        <div class="my-main-section">
            <section class="pb-8">
                <h1 id="requirements">Requirements</h1>
                <p>
                    To use <code>vue-my-dropdown</code>, your project must meet the following
                    requirements:
                </p>
                <ul class="ml-6 list-disc">
                    <li>Vue.js version <code>&gt;= 3.3</code>.</li>
                </ul>
            </section>
            <section class="pb-8">
                <p>
                    Follow these steps to install and start using the
                    <code>vue-my-dropdown</code> library in your project:
                </p>
                <p>
                    Use <code>npm</code> to install the library:
                    <MyEditor language="shell" code="npm install --save vue-my-dropdown" />
                </p>
                <p>
                    Import the library into your project and register it as a component:
                    <MyEditor :code="usageCode" language="javascript" />
                </p>
                <p>Now you’re ready to integrate dropdowns into your Vue components with ease!</p>
            </section>

            <section class="pb-8">
                <h1 id="properties-events">Properties and events</h1>
                <table
                    class="min-w-full table-auto border-collapse border border-table-border-color"
                >
                    <thead class="border-b border-table-border-color bg-gray-100">
                        <tr>
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">
                                Property/Event
                            </th>
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">
                                Possible Values
                            </th>
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-300">
                        <tr>
                            <td class="px-4 py-2 text-gray-600"><code>visible</code></td>
                            <td class="px-4 py-2 text-gray-600">true / false</td>
                            <td class="px-4 py-2 text-gray-600">
                                Controls the visibility of the dropdown. Use it to programmatically
                                show or hide the dropdown.
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 text-gray-600"><code>anchor</code></td>
                            <td class="px-4 py-2 text-gray-600">Any HTML element</td>
                            <td class="px-4 py-2 text-gray-600">
                                Specifies the element to which the dropdown is anchored. Ensures
                                consistent positioning relative to the anchor, even if it moves or
                                resizes.
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 text-gray-600"><code>position</code></td>
                            <td class="px-4 py-2 text-gray-600">
                                <code>['left', 'top', 'right', 'bottom']</code>
                            </td>
                            <td class="px-4 py-2 text-gray-600">
                                Defines how the dropdown aligns relative to its anchor. For example,
                                <code>['right', 'top']</code> places the dropdown to the right of
                                the anchor and aligns it at the top.
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 text-gray-600"><code>animation</code></td>
                            <td class="px-4 py-2 text-gray-600">
                                <code>'fade'</code>, <code>'slide'</code>, custom CSS animations
                            </td>
                            <td class="px-4 py-2 text-gray-600">
                                Specifies the animation used for opening and closing the dropdown.
                                Default animations include fade and slide transitions, or you can
                                define custom ones.
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 text-gray-600"><code>clickout</code></td>
                            <td class="px-4 py-2 text-gray-600">Event</td>
                            <td class="px-4 py-2 text-gray-600">
                                Triggers when the user clicks outside the dropdown or its anchor.
                                Provides two flags: <code>clickedInDropdown</code> and
                                <code>clickedInAnchor</code> to manage visibility logic.
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 text-gray-600">
                                <code>open</code> / <code>close</code>
                            </td>
                            <td class="px-4 py-2 text-gray-600">Event</td>
                            <td class="px-4 py-2 text-gray-600">
                                Fires when the dropdown opens or closes, respectively. Use these
                                events for custom logic, such as fetching data on open or cleaning
                                up resources on close.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <h1 id="examples">Examples</h1>
            <MyExample title="Basic example" language="javascript" :code="basicExampleCode">
                <BasicExample />
            </MyExample>
            <MyExample title="Clickout example" language="javascript" :code="clickoutExampleCode">
                <ClickoutExample />

                <template #description>
                    <p>
                        The <code>clickout</code> event is triggered whenever the user clicks
                        anywhere on the screen. This event provides two flags:
                    </p>
                    <ul>
                        <li>
                            <code>clickedInDropdown</code>: Indicates if the user clicked inside the
                            dropdown.
                        </li>
                        <li>
                            <code>clickedInAnchor</code>: Indicates if the user clicked on the
                            anchor element.
                        </li>
                    </ul>
                    <p>
                        These flags allow you to precisely determine the click location and handle
                        visibility logic. For example, you can use this event to hide the dropdown
                        when the user clicks outside both the dropdown and the anchor.
                    </p>
                </template>
            </MyExample>
            <MyExample title="Anchor example" language="javascript" :code="anchorExampleCode">
                <template #description>
                    <p>
                        The <code>anchor</code> property specifies the HTML element to which the
                        dropdown is anchored. This allows the dropdown to dynamically position
                        itself relative to the anchor element.
                    </p>
                    <p>
                        For instance, you can anchor the dropdown to a button or any other element
                        to maintain consistent positioning, even when the element moves or resizes.
                    </p>
                </template>
                <AnchorExample />
            </MyExample>
            <MyExample title="Position example" language="javascript" :code="positionExampleCode">
                <template #description>
                    <p>
                        The position property defines how the dropdown aligns relative to its
                        anchor. You can specify the horizontal (e.g., 'left', 'center', 'right') and
                        vertical (e.g., 'top', 'center', 'bottom') alignment.
                    </p>
                    <p>
                        For example, the configuration
                        <code>['right', 'top', 'left', 'top']</code> will place the dropdown to the
                        right of the anchor and then adjust as needed for different screen sizes or
                        anchor states.
                    </p>
                </template>
                <PositionExample />
            </MyExample>

            <MyExample title="Animation example" language="javascript" :code="animationExampleCode">
                <template #description>
                    <p>
                        The animation property allows you to customize the opening and closing
                        transitions of the dropdown. You can use predefined transitions such as
                        'fade', 'slide', or create your own by defining CSS animations.
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
                        The dropdown emits <code>open</code> and <code>close</code> events whenever
                        its visibility changes. These events can be used to track the dropdown's
                        state or trigger additional actions in your application.
                    </p>
                    <p>
                        For example, you can use the <code>open</code> event to load data
                        dynamically or the <code>close</code> event to clean up resources.
                    </p>
                </template>
            </MyExample>
        </div>
        <div>
            <nav ref="navMenuElement" class="my-menu mb-8">
                <ul>
                    <li><a href="#requirements" class="my-menu-link">Requirements</a></li>
                    <li><a href="#usage" class="my-menu-link">Usage</a></li>
                    <li>
                        <a href="#properties-events" class="my-menu-link">Properties and Events</a>
                    </li>
                    <li><a href="#examples" class="my-menu-link">Examples</a></li>
                    <ul>
                        <li><a href="#basic-example" class="my-menu-link">Basic Example</a></li>
                        <li>
                            <a href="#clickout-example" class="my-menu-link">Clickout Example</a>
                        </li>
                        <li><a href="#anchor-example" class="my-menu-link">Anchor Example</a></li>
                        <li>
                            <a href="#position-example" class="my-menu-link">Position Example</a>
                        </li>
                        <li>
                            <a href="#animation-example" class="my-menu-link">Animation Example</a>
                        </li>
                        <li>
                            <a href="#close-and-open-event-example" class="my-menu-link">
                                Close/Open Events Example
                            </a>
                        </li>
                    </ul>
                </ul>
            </nav>
        </div>
    </div>
</template>
