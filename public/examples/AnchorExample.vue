<script setup lang="ts">
import {ComponentPublicInstance, computed, ref} from 'vue';
import {MyDropdown} from '../../src/vue-my-dropdown';

const visible = ref<boolean>(false);
const button = ref<HTMLElement | null>(null);
const anchor = ref<Array<HTMLElement | null>>([null, null, null, null]);
const index = ref<number>(0);

function setRef(el: Element | ComponentPublicInstance | null, index: number) {
    if (el !== null) {
        anchor.value[index] = el as HTMLElement;
    }
}

function clickout(evt: Event) {
    visible.value =
        button.value !== null &&
        (button.value == evt.target || button.value.contains(evt.target as HTMLElement));
}

function setIndex(newIndex: number) {
    index.value = newIndex;
    visible.value = false;
}

const buttonLabel = computed<string>(() => {
    switch (index.value) {
        case 0:
            return 'Show in anchor 1';
        case 1:
            return 'Show in anchor 2';
        case 2:
            return 'Show in anchor 3';
        default:
            return 'Show in anchor 4';
    }
});
</script>

<template>
    <div class="my-grid">
        <div class="my-anchors">
            <div
                :ref="(el) => setRef(el, 0)"
                :class="{'my-active': index == 0}"
                @click="setIndex(0)"
            >
                Anchor 1
            </div>
            <div
                :ref="(el) => setRef(el, 1)"
                :class="{'my-active': index == 1}"
                @click="setIndex(1)"
            >
                Anchor 2
            </div>
            <div
                :ref="(el) => setRef(el, 2)"
                :class="{'my-active': index == 2}"
                @click="setIndex(2)"
            >
                Anchor 3
            </div>
            <div
                :ref="(el) => setRef(el, 3)"
                :class="{'my-active': index == 3}"
                @click="setIndex(3)"
            >
                Anchor 4
            </div>
        </div>
        <MyDropdown
            :anchor="anchor[index]"
            :visible="visible"
            :position="['center', 'bottom', 'center', 'top']"
            @clickout="clickout"
        >
            <div class="my-dropdown">Dropdown here</div>
        </MyDropdown>

        <button ref="button" type="button" class="my-button" @click="visible = !visible">
            {{ buttonLabel }}
        </button>
    </div>
</template>
