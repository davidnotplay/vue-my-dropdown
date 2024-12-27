<script lang="ts" setup>
import {computed, ref} from 'vue';
import {MyDropdown, Position, Horizontal, Vertical} from '../../src/vue-my-dropdown';

const visible = ref<boolean>(false);
const anchor = ref<HTMLElement | null>(null);
const position = ref<Position>(['right', 'top', 'left', 'top']);

function change(ev: Event, index: number): void {
    const value = (ev.target as HTMLSelectElement).value;
    position.value[index] = value as Horizontal | Vertical;
}

function clickout(_: Event, clickedInDropdown: boolean, clickedInAnchor: boolean): void {
    visible.value = clickedInAnchor || clickedInDropdown;
}

const myBtnCornerClass = computed<Array<string>>(() => {
    return [
        `my-button-corner`,
        `my-button-corner-h-${position.value[0]}`,
        `my-button-corner-v-${position.value[1]}`,
    ];
});

const myDDCornerClass = computed<Array<string>>(() => {
    return [
        `my-dd-corner`,
        `my-dd-corner-h-${position.value[2]}`,
        `my-dd-corner-v-${position.value[3]}`,
    ];
});
</script>

<template>
    <div class="my-form">
        <div class="my-input">
            <label for="button-h">Button horizontal position</label>
            <select id="button-h" :value="position[0]" @change="change($event, 0)">
                <option
                    v-for="direction in ['left', 'center', 'right']"
                    :key="direction"
                    :value="direction"
                >
                    {{ direction }}
                </option>
            </select>
        </div>
        <div class="my-input">
            <label for="button-v">Button vertical position</label>
            <select id="button-v" @change="change($event, 1)">
                <option
                    v-for="direction in ['top', 'center', 'bottom']"
                    :key="direction"
                    :value="direction"
                >
                    {{ direction }}
                </option>
            </select>
        </div>
        <div class="my-input">
            <label for="dd-h">Dropdown horizontal position</label>
            <select id="dd-h" @change="change($event, 2)">
                <option
                    v-for="direction in ['left', 'center', 'right']"
                    :key="direction"
                    :value="direction"
                >
                    {{ direction }}
                </option>
            </select>
        </div>
        <div class="my-input">
            <label for="dd-v">Dropdown vertical position</label>
            <select id="dd-v" @change="change($event, 3)">
                <option
                    v-for="direction in ['top', 'center', 'bottom']"
                    :key="direction"
                    :value="direction"
                >
                    {{ direction }}
                </option>
            </select>
        </div>
    </div>
    <button
        ref="anchor"
        type="button"
        :class="['my-button', myBtnCornerClass]"
        @click="visible = !visible"
    >
        Click me
    </button>
    <MyDropdown :anchor="anchor" :visible="visible" :position="position" @clickout="clickout">
        <div :class="['my-dropdown', myDDCornerClass]">
            <p class="my-2">Dropdown in this position:</p>
            <ul>
                <li>
                    <code>{{ position[0] }}</code>
                </li>
                <li>
                    <code>{{ position[1] }}</code>
                </li>
                <li>
                    <code>{{ position[2] }}</code>
                </li>
                <li>
                    <code>{{ position[3] }}</code>
                </li>
            </ul>
        </div>
    </MyDropdown>
</template>
