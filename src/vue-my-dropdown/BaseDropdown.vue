<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {createStyles} from './helpers.ts';

export type BaseDropdownProps = {
    visible?: boolean;
    position?: Position;
};

export type Position = [Horizontal, Vertical, Horizontal, Vertical];
export type Vertical = 'top' | 'center' | 'bottom';
export type Horizontal = 'left' | 'center' | 'right';

const props = withDefaults(defineProps<BaseDropdownProps>(), {
    visible: false,
    position: () => ['right', 'top', 'left', 'top'],
});

// Elements
const $link = ref(null);
const $dropdown = ref(null);

// Internal states
const ddStyles = ref<{[key: string]: string}>({});

defineSlots<{
    dropdown(): any; // eslint-disable-line
    default(): any; // eslint-disable-line
}>();

// Helpers
function open() {
    if ($link.value === null || $dropdown.value === null) {
        return;
    }

    ddStyles.value = createStyles($link.value, $dropdown.value, props.position);
}

// Watchers
watch(
    () => props.visible,
    async (newValue, oldValue) => {
        if (newValue == oldValue) {
            return;
        }

        if (newValue) {
            open();
        }
    }
);

// Lifecycle
onMounted(() => {
    if (props.visible) {
        open();
    }
});
</script>

<template>
    <span ref="$link" :style="{display: 'inline-block'}">
        <slot />
    </span>
    <div v-show="visible" ref="$dropdown" :style="ddStyles">
        <slot name="dropdown" />
    </div>
</template>
