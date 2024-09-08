<script setup lang="ts">
import type {Slot} from 'vue';
import {defineSlots} from 'vue';
import {Languages} from './MyEditor.vue';
import MyEditor from './MyEditor.vue';

type ExampleProps = {
    title: string;
    code: string;
    language: Languages;
};

defineSlots<{default: Slot}>();

const props = defineProps<ExampleProps>();
</script>

<template>
    <div>
        <h2>{{ props.title }}</h2>
        <div class="my-example-layout">
            <MyEditor :code="props.code" :language="props.language" />
            <div><slot name="default" /></div>
        </div>
    </div>
</template>
