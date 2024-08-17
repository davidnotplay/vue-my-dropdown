<script setup lang="ts">
import {onMounted, ref, watch, nextTick} from 'vue';
import {clickout, createStyles} from './helpers.ts';

export type BaseDropdownProps = {
    visible?: boolean;
    position?: Position;
    link: HTMLElement | null;
};

export type Position = [Horizontal, Vertical, Horizontal, Vertical];
export type Vertical = 'top' | 'center' | 'bottom';
export type Horizontal = 'left' | 'center' | 'right';

const props = withDefaults(defineProps<BaseDropdownProps>(), {
    visible: false,
    position: () => ['right', 'top', 'left', 'top'],
});

// Elements
const $dropdown = ref(null);

// Event
const emit = defineEmits(['clickout']);

// Internal states
const ddStyles = ref<{[key: string]: string}>({});

defineSlots<{
    dropdown(): any; // eslint-disable-line
    default(): any; // eslint-disable-line
}>();

/**
 * Set the dropdown style properties.
 */
function setDropdownStyles() {
    if (props.link !== null && $dropdown.value !== null) {
        if (props.link instanceof HTMLElement) {
            ddStyles.value = createStyles(props.link, $dropdown.value, props.position);
            return;
        }

        console.warn(`Link property is not HTML element.`);
    }
}

/**
 * Open the dropdown in its position and create the events.
 */
function open() {
    setDropdownStyles();
    window.addEventListener('resize', setDropdownStyles);
    nextTick(() => document.addEventListener('click', clickoutEvent));
}

/**
    Event executed when user click out of the dropdown.
    The function triggers the clickout event.
 */
function clickoutEvent(evt: Event) {
    if (
        props.link !== null &&
        $dropdown.value !== null &&
        clickout(evt.target as HTMLElement, props.link, $dropdown.value)
    ) {
        emit('clickout');
    }
}

/**
 * Remove the events.
 */
function close() {
    window.removeEventListener('resize', setDropdownStyles);
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
            return;
        }

        close();
    }
);

// Lifecycle
onMounted(() => {
    if (props.visible) {
        nextTick(open);
    }
});
</script>

<template>
    <div v-show="visible" ref="$dropdown" :style="ddStyles">
        <slot />
    </div>
</template>
