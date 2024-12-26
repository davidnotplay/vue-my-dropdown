<script setup lang="ts">
import type {Slot} from 'vue';
import {computed, defineSlots} from 'vue';
import {Languages} from './MyEditor.vue';
import MyEditor from './MyEditor.vue';

type ExampleProps = {
    title: string;
    code: string;
    language: Languages;
};

const slots = defineSlots<{default: Slot; description: Slot}>();

const props = defineProps<ExampleProps>();

const slug = computed<string>(() => {
    return props.title.replace(/\s+/g, '-').toLowerCase();
});
</script>

<template>
    <div class="my-example-layout">
        <h2 :id="slug">{{ props.title }}</h2>
        <section v-show="slots.description" class="my-paragraph">
            <slot name="description" />
        </section>
        <div>
            <MyEditor :code="props.code" :language="props.language" />
            <div><slot name="default" /></div>
        </div>
    </div>
</template>
