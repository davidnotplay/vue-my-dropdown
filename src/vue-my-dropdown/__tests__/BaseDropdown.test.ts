// @TODO try to remove the eslint exception.
/* eslint-disable vue/one-component-per-file */
import {cleanup, fireEvent, render, screen} from '@testing-library/vue';
import Dropdown from '../../vue-my-dropdown/BaseDropdown.vue';
import {defineComponent, nextTick} from 'vue';

beforeEach(() => {
    cleanup();
    // @TODO is necessary?
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
        get() {
            return document.querySelector('body');
        },
    });
});

it('exists', () => {
    expect(Dropdown).toBeTruthy();
});

it('hides `dropdown` slot by default', () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                link: null as null | HTMLElement,
            };
        },

        mounted() {
            this.link = this.$refs.link as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="link">Click here</button>
            <Dropdown :link="link">Dropdown message</Dropdown>
        </div>`,
    });

    render(TestComponent);
    expect(screen.getByText(/Dropdown message/)).not.toBeVisible();
});

it('shows `dropdown` slot when the `visible` property is true', () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                link: null as null | HTMLElement,
            };
        },

        mounted() {
            this.link = this.$refs.link as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="link">Click here</button>
            <Dropdown :link="link" visible>Dropdown message</Dropdown>
        </div>`,
    });

    render(TestComponent);
    expect(screen.getByText(/Dropdown message/)).toBeVisible();
});

it('executes `open` function when the initial value of `visible` property is true', async () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                link: null as null | HTMLElement,
            };
        },

        mounted() {
            this.link = this.$refs.link as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="link">Click here</button>
            <Dropdown :link="link" visible>Dropdown message</Dropdown>
        </div>`,
    });

    render(TestComponent);
    await nextTick();
    await nextTick();
    expect(screen.getByText(/Dropdown message/)!.style!.position).toBe('absolute');
});

it('executes `open` function when the `visible` property changes to `true` value', async () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                visible: false,
                link: null as null | HTMLElement,
            };
        },

        mounted() {
            this.link = this.$refs.link as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="link" @click="visible = true">Click here</button>
            <Dropdown :link="link" :visible="visible">Dropdown message</Dropdown>
        </div>`,
    });

    render(TestComponent);
    await nextTick();
    await fireEvent.click(screen.getByRole('button'));
    await nextTick();
    expect(screen.getByText(/Dropdown message/)!.style!.position).toBe('absolute');
});
