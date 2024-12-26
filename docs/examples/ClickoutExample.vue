<script lang="ts" setup>
import {ref} from 'vue';
import {MyDropdown} from '../../src/vue-my-dropdown';

const visible = ref<boolean>(false);
const anchor = ref<HTMLElement | null>(null);

function clickout(_: Event, clickedInDropdown: boolean, clickedInAnchor: boolean) {
    visible.value = clickedInDropdown || clickedInAnchor;
}
</script>

<template>
    <button ref="anchor" type="button" class="my-button" @click="visible = !visible">
        Click me
    </button>
    <MyDropdown :anchor="anchor" :visible="visible" @clickout="clickout">
        <div class="my-dropdown">Click out to close the dropdown</div>
    </MyDropdown>
</template>
