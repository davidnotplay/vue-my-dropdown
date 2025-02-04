<script setup lang="ts">
import type {Slot} from 'vue';
import {onMounted, ref, watch, nextTick, onUnmounted} from 'vue';
import {createStyles} from './helpers.ts';

export type MyDropdownProps = {
    anchor: HTMLElement | null;
    visible: boolean;
    position?: Position;
    animation?: Animation;
};

export type Position = [Horizontal, Vertical, Horizontal, Vertical];
export type Vertical = 'top' | 'center' | 'bottom';
export type Horizontal = 'left' | 'center' | 'right';
export type Animation = string;

const props = withDefaults(defineProps<MyDropdownProps>(), {
    position: () => ['right', 'top', 'left', 'top'],
    animation: 'slide',
});

// Animation time
const animationTime = '0.3s';
// Elements
const $dropdown = ref<HTMLElement | null>(null);
// Event
const emit = defineEmits<{
    clickout: [ev: Event, clickInDD: boolean, clickInAnchor: boolean];
    open: [];
    close: [];
}>();
// Internal states
const ddStyles = ref<{[key: string]: string}>({});
// Slots
defineSlots<{
    default(): Slot;
}>();

/**
 * Set the dropdown style properties.
 */
function setDropdownStyles() {
    if (props.anchor !== null && $dropdown.value !== null) {
        if (props.anchor instanceof HTMLElement) {
            ddStyles.value = createStyles(props.anchor, $dropdown.value, props.position);
            return;
        }

        console.warn(`Anchor property is not HTML element.`);
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
 * Check if the element clicked is the container or it is inside of container.
 *
 * @param $eleClicked The element clicked.
 * @param $container The element where it checks if the element clicked is inside.
 * @returns True if the element clicked is into container. False otherwise.
 */
function isClicked($eleClicked: HTMLElement, $container: HTMLElement | null): boolean {
    return $container instanceof HTMLElement && $container.contains($eleClicked);
}

/**
    Event executed when user click out of the dropdown.
    The function triggers the clickout event.
 */
function clickoutEvent(evt: Event) {
    const clickedInAnchor = isClicked(evt.target as HTMLElement, props.anchor);
    const clickedInDropdown = isClicked(evt.target as HTMLElement, $dropdown.value);
    emit('clickout', evt, clickedInDropdown, clickedInAnchor);
}

/**
 * Remove the events.
 */
function close() {
    window.removeEventListener('resize', setDropdownStyles);
    document.removeEventListener('click', clickoutEvent);
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

onUnmounted(() => {
    if (props.visible) {
        close();
    }
});
</script>

<template>
    <Transition :name="animation" @after-enter="emit('open')" @after-leave="emit('close')">
        <div v-show="visible" ref="$dropdown" :style="ddStyles">
            <slot />
        </div>
    </Transition>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
    transition:
        transform v-bind('animationTime') ease,
        opacity v-bind('animationTime') ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: scale(0, 0);
    opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
    transform: scale(1, 1);
    opacity: 1;
}

.slide-x-enter-active,
.slide-x-leave-active {
    transition:
        transform v-bind('animationTime') ease,
        opacity v-bind('animationTime') ease;
}

.slide-x-enter-from,
.slide-x-leave-to {
    transform: scale(0, 1);
    opacity: 0;
}

.slide-x-enter-to,
.slide-x-leave-from {
    transform: scale(1, 1);
    opacity: 1;
}

.slide-y-enter-active,
.slide-y-leave-active {
    transition:
        transform v-bind('animationTime') ease,
        opacity v-bind('animationTime') ease;
}

.slide-y-enter-from,
.slide-y-leave-to {
    transform: scale(1, 0);
    opacity: 0;
}

.slide-y-enter-to,
.slide-y-leave-from {
    transform: scale(1, 1);
    opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity v-bind('animationTime') ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}

.none-enter-active,
.none-leave-active,
.none-enter-from,
.none-leave-to,
.none-enter-to,
.none-leave-from {
    transition: none;
}
</style>
