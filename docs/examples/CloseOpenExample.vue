<script lang="ts" setup>
import {ref} from 'vue';
import {MyDropdown} from '../../src/vue-my-dropdown';

const visible = ref<boolean>(false);
const anchor = ref<HTMLElement | null>(null);
const ddState = ref<string>('Closed');

function clickout(_: Event, clickedInDropdown: boolean, clickedInAnchor: boolean): void {
    visible.value = clickedInAnchor || clickedInDropdown;
}

function opened() {
    ddState.value = 'Opened';
}

function closed() {
    ddState.value = 'Closed';
}
</script>

<template>
    <div class="my-form"></div>
    <p class="mb-2">Dropdown status: {{ ddState }}</p>

    <button ref="anchor" type="button" class="my-button" @click="visible = !visible">
        Show dropdown
    </button>
    <MyDropdown
        :anchor="anchor"
        :visible="visible"
        @clickout="clickout"
        @open="opened"
        @close="closed"
    >
        <div class="my-dropdown">
            <p class="my-2">Dropdown</p>
        </div>
    </MyDropdown>
</template>
