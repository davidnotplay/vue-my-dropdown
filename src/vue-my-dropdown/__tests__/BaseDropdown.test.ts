// @TODO try to remove the eslint exception.
/* eslint-disable vue/one-component-per-file */
import {fireEvent, render, screen} from '@testing-library/vue';
import Dropdown from '../../vue-my-dropdown/BaseDropdown.vue';
import {defineComponent, nextTick} from 'vue';

const addEventListenerMock = vi.fn();
const removeEventListenerMock = vi.fn();

beforeEach(() => {
    addEventListenerMock.mockReset();
    removeEventListenerMock.mockReset();

    window.addEventListener = addEventListenerMock;
    window.removeEventListener = removeEventListenerMock;

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

it('adds the resize event when the dropdown is opened', async () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                visible: true,
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
    await fireEvent.resize(window);
    expect(
        addEventListenerMock.mock.calls.length === 1 &&
            addEventListenerMock.mock.calls[0][0] === 'resize' &&
            typeof addEventListenerMock.mock.calls[0][1] === 'function'
    ).toBe(true);
});

it('removes the resize event when the dropdown is closed', async () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                visible: true,
                link: null as null | HTMLElement,
            };
        },

        mounted() {
            this.link = this.$refs.link as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="link" @click="visible = false">Click here</button>
            <Dropdown :link="link" :visible="visible">Dropdown message</Dropdown>
        </div>`,
    });

    render(TestComponent);
    await nextTick();
    await fireEvent.click(screen.getByRole('button'));
    expect(
        removeEventListenerMock.mock.calls.length === 1 &&
            removeEventListenerMock.mock.calls[0][0] === 'resize' &&
            typeof removeEventListenerMock.mock.calls[0][1] === 'function'
    ).toBe(true);
});
