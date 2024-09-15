<script lang="ts" setup>
import {ref} from 'vue';
import {MyDropdown} from '../../src/vue-my-dropdown';

const visible = ref<boolean>(false);
const link = ref<HTMLElement | null>(null);
</script>

<template>
    <button ref="link" type="button" class="my-button" @click="visible = !visible">Click me</button>
    <MyDropdown :link="link" :visible="visible" @clickout="visible = false">
        <div class="my-dropdown">Click out to close the dropdown</div>
    </MyDropdown>
</template>
