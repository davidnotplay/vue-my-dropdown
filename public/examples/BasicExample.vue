<script lang="ts" setup>
import {ref} from 'vue';
import {MyDropdown} from '../../src/vue-my-dropdown';

const visible = ref<boolean>(false);
const anchor = ref<HTMLElement | null>(null);
</script>

<template>
    <button ref="anchor" type="button" class="my-button" @click="visible = !visible">
        Click me
    </button>
    <MyDropdown :anchor="anchor" :visible="visible">
        <div class="my-dropdown">My first dropdown</div>
    </MyDropdown>
</template>
