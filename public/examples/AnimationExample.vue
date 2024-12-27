<script lang="ts" setup>
import {ref} from 'vue';
import {MyDropdown} from '../../src/vue-my-dropdown';

const visible = ref<boolean>(false);
const anchor = ref<HTMLElement | null>(null);
const index = ref<number>(0);
const animations = ref([
    {
        label: 'slide. Included in the library. Default option.',
        value: 'slide',
    },
    {
        label: 'slide-x. Included in the library.',
        value: 'slide-x',
    },
    {
        label: 'slide-y. Included in the library.',
        value: 'slide-y',
    },
    {
        label: 'fade. Included in the library.',
        value: 'fade',
    },
    {
        label: 'none. Included in the library.',
        value: 'none',
    },
    {
        label: 'custom. Custom animation.',
        value: 'custom',
    },
]);

function change(ev: Event) {
    const value = (ev.target as HTMLSelectElement).value;
    index.value = animations.value.findIndex((animation) => value === animation.value);
}
</script>

<template>
    <div class="my-form">
        <div class="my-input">
            <label for="button-h">Button horizontal position</label>
            <select id="button-h" :value="animations[index].value" @change="change">
                <option
                    v-for="animation in animations"
                    :key="animation.value"
                    :value="animation.value"
                >
                    {{ animation.label }}
                </option>
            </select>
        </div>
    </div>
    <button ref="anchor" type="button" class="my-button" @click="visible = !visible">
        Click me
    </button>
    <MyDropdown :anchor="anchor" :visible="visible" :animation="animations[index].value">
        <div class="my-dropdown">
            Dropdown with the <code>{{ animations[index].value }}</code> animation.
        </div>
    </MyDropdown>
</template>

<style>
.custom-enter-active,
.custom-leave-active {
    animation: expand 0.6s ease-out forwards;
}

.custom-leave-active {
    animation: collapse 0.6s ease-out forwards;
}

@keyframes expand {
    0% {
        transform: scale(0, 0.1);
        opacity: 0;
    }
    50% {
        transform: scale(1, 0.1);
    }
    100% {
        transform: scale(1, 1);
        opacity: 1;
    }
}

@keyframes collapse {
    0% {
        transform: scale(1, 1);
        opacity: 1;
    }
    50% {
        transform: scale(1, 0.1);
    }
    100% {
        transform: scale(0, 0.1);
        opacity: 0;
    }
}
</style>
