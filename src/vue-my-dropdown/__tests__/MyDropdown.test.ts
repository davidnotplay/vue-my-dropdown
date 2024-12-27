/* eslint-disable vue/one-component-per-file */
import {fireEvent, render, screen} from '@testing-library/vue';
import Dropdown from '../../vue-my-dropdown/MyDropdown.vue';
import {defineComponent, nextTick} from 'vue';
import {MockInstance} from 'vitest';

let addEventListenerMock: MockInstance;
let windowRemoveEventListenerMock: MockInstance;
let docRemoveEventListenerMock: MockInstance;
let consoleWarn: MockInstance;

beforeEach(() => {
    consoleWarn = vi.spyOn(console, 'warn');
    docRemoveEventListenerMock = vi.spyOn(document, 'removeEventListener');
    addEventListenerMock = vi.spyOn(window, 'addEventListener');
    windowRemoveEventListenerMock = vi.spyOn(window, 'removeEventListener');

    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
        get() {
            return document.querySelector('body');
        },
    });
});

afterEach(() => {
    vi.restoreAllMocks();
});

it('exists', () => {
    expect(Dropdown).toBeTruthy();
});

it('hides `dropdown` slot by default', () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                anchor: null as null | HTMLElement,
            };
        },

        mounted() {
            this.anchor = this.$refs.anchor as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="anchor">Click here</button>
            <Dropdown :anchor="anchor">Dropdown message</Dropdown>
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
                anchor: null as null | HTMLElement,
            };
        },

        mounted() {
            this.anchor = this.$refs.anchor as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="anchor">Click here</button>
            <Dropdown :anchor="anchor" visible>Dropdown message</Dropdown>
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
                anchor: null as null | HTMLElement,
            };
        },

        mounted() {
            this.anchor = this.$refs.anchor as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="anchor">Click here</button>
            <Dropdown :anchor="anchor" visible>Dropdown message</Dropdown>
        </div>`,
    });

    render(TestComponent);
    await nextTick();
    expect(screen.getByText(/Dropdown message/)).toBeVisible();
});

it('executes `open` function when the `visible` property changes to `true` value', async () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                visible: false,
                anchor: null as null | HTMLElement,
            };
        },

        mounted() {
            this.anchor = this.$refs.anchor as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="anchor" @click="visible = true">Click here</button>
            <Dropdown :anchor="anchor" :visible="visible">Dropdown message</Dropdown>
        </div>`,
    });

    render(TestComponent);
    await nextTick();
    await fireEvent.click(screen.getByRole('button'));
    await nextTick();
    expect(screen.getByText(/Dropdown message/)).toBeVisible();
});

it('adds the resize event when the dropdown is opened', async () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                visible: true,
                anchor: null as null | HTMLElement,
            };
        },

        mounted() {
            this.anchor = this.$refs.anchor as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="anchor" @click="visible = true">Click here</button>
            <Dropdown :anchor="anchor" :visible="visible">Dropdown message</Dropdown>
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
                anchor: null as null | HTMLElement,
            };
        },

        mounted() {
            this.anchor = this.$refs.anchor as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="anchor" @click="visible = false">Click here</button>
            <Dropdown :anchor="anchor" :visible="visible">Dropdown message</Dropdown>
        </div>`,
    });

    render(TestComponent);
    await nextTick();
    await fireEvent.click(screen.getByRole('button'));
    expect(
        windowRemoveEventListenerMock.mock.calls.length === 1 &&
            windowRemoveEventListenerMock.mock.calls[0][0] === 'resize' &&
            typeof windowRemoveEventListenerMock.mock.calls[0][1] === 'function'
    ).toBe(true);
});

it('displays console.warn when anchor property is not HTML element', async () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                visible: true,
                anchor: null as HTMLElement | null,
            };
        },
        mounted() {
            this.anchor = this.$refs.anchor as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="anchor">Click here</button>
            <Dropdown :anchor="3" visible>Dropdown message</Dropdown>
        </div>`,
    });

    render(TestComponent);
    await nextTick();
    expect(consoleWarn).toHaveBeenCalledTimes(1);
});

describe('Clickout event', () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                visible: false,
                anchor: null as null | HTMLElement,
                clickInAnchor: 0,
                clickInDD: 0,
            };
        },

        mounted() {
            this.anchor = this.$refs.anchor as HTMLElement;
        },

        methods: {
            clickout(_: Event, clickInAnchor: boolean, clickInDropdown: boolean): void {
                this.clickInDD = clickInDropdown === true ? 1 : 2;
                this.clickInAnchor = clickInAnchor === true ? 1 : 2;
            },
        },
        template: `
        <div>
            <div data-testid="clickout">clickout</div>
            <button
                data-testid="anchor"
                type="button" ref="anchor"
                @click="visible = true"
            >
                Click here
            </button>
            <Dropdown :anchor="anchor" :visible="visible" @clickout="(...args) => clickout(...args)">
                <div data-testid="inner">Dropdown message</div>
            </Dropdown>

            <div v-if="clickInAnchor === 1 && clickInDD === 2">
                Clicked in the dropdown
            </div>
            <div v-if="clickInDD === 1&& clickInAnchor === 2">
                Clicked in the anchor
            </div>

            <div v-if="clickInDD === 2 && clickInAnchor === 2">
                Clicked out
            </div>
        </div>`,
    });

    beforeEach(() => {
        vi.resetAllMocks();
    });

    [
        {
            testId: 'clickout',
            expected: 'Clicked out',
        },
        {
            testId: 'anchor',
            expected: 'Clicked in the anchor',
        },
        {
            testId: 'inner',
            expected: 'Clicked in the dropdown',
        },
    ].forEach(({testId, expected}) => {
        it(`retrieves the parameters from clickout event`, async () => {
            render(TestComponent);
            await fireEvent.click(screen.getByRole('button'));
            await nextTick();
            await fireEvent.click(screen.getByTestId(testId));
            await nextTick();
            expect(screen.getByText(expected)).toBeVisible();
        });
    });

    it('deletes the clickout event when the dropdown is closed', async () => {
        vi.restoreAllMocks();
        const DeleteClickoutComponent = defineComponent({
            components: {Dropdown},
            data() {
                return {
                    visible: false,
                    anchor: null as null | HTMLElement,
                    clickoutClicks: 0,
                };
            },
            mounted() {
                this.anchor = this.$refs.anchor as HTMLElement;
            },
            methods: {
                clickout() {
                    this.visible = false;
                    this.clickoutClicks++;
                },
            },
            template: `
            <div>
                <div data-testid="clickout">clickout {{clickoutClicks}}</div>
                <button
                    data-testid="anchor"
                    type="button"
                    ref="anchor"
                    @click="visible = true"
                >
                    Click here
                </button>
                <Dropdown :anchor="anchor" :visible="visible" @clickout="clickout()">
                    <div data-testid="inner">Dropdown message</div>
                </Dropdown>
            </div>`,
        });

        render(DeleteClickoutComponent);
        await fireEvent.click(screen.getByTestId('anchor'));
        await nextTick();
        await fireEvent.click(screen.getByTestId('clickout'));
        await nextTick();
        await fireEvent.click(screen.getByTestId('clickout'));
        await nextTick();
        await fireEvent.click(screen.getByTestId('clickout'));
        await nextTick();
        expect(screen.getByTestId('clickout')).toHaveTextContent(/clickout 1/);
    });

    it('sends the event object', async () => {
        const DeleteClickoutComponent = defineComponent({
            components: {Dropdown},
            data() {
                return {
                    visible: false,
                    anchor: null as null | HTMLElement,
                    text: '',
                };
            },
            mounted() {
                this.anchor = this.$refs.anchor as HTMLElement;
            },
            methods: {
                clickout(evt: Event) {
                    this.visible = false;
                    this.text = (evt.target as HTMLElement).textContent as string;
                },
            },
            template: `
            <div>
                <div data-testid="clickout">the text of the button is "{{text}}"</div>
                <button
                    data-testid="anchor"
                    type="button" ref="anchor"
                    @click="visible = true"
                >
                   Button text
                </button>
                <Dropdown :anchor="anchor" :visible="visible" @clickout="clickout($event)">
                    <div data-testid="inner">Dropdown message</div>
                </Dropdown>
            </div>`,
        });

        render(DeleteClickoutComponent);
        await fireEvent.click(screen.getByTestId('anchor'));
        await nextTick();
        await fireEvent.click(screen.getByTestId('clickout'), {target: {textContent: 'test text'}});
        await nextTick();
        expect(screen.getByTestId('clickout')).toHaveTextContent(
            /the text of the button is "test text"/
        );
    });
});

it('deletes the clickout event when component is unmounted', async () => {
    const DeleteClickoutComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                visible: false,
                anchor: null as null | HTMLElement,
            };
        },
        mounted() {
            this.anchor = this.$refs.anchor as HTMLElement;
        },
        template: `
            <div>
                <div data-testid="clickout">clickout</div>
                <button
                    data-testid="anchor"
                    type="button" ref="anchor"
                    @click="console.log('here', visible = true)"
                >
                    Click here
                </button>
                <Dropdown :anchor="anchor" :visible="visible">
                    <div data-testid="inner">Dropdown message</div>
                </Dropdown>
            </div>`,
    });

    const {unmount} = render(DeleteClickoutComponent);
    await fireEvent.click(screen.getByTestId('anchor'));
    await nextTick();
    unmount();
    await nextTick();
    expect(docRemoveEventListenerMock).toHaveBeenCalledOnce();
});

describe('Animation property', () => {
    const transitionComponent = defineComponent({
        template: '<div data-testid="transition"></div>',
    });

    it('exists the transition component', async () => {
        const TestComponent = defineComponent({
            components: {Dropdown},
            data() {
                return {
                    visible: true,
                    anchor: null as HTMLElement | null,
                };
            },
            mounted() {
                this.anchor = this.$refs.anchor as HTMLElement;
            },
            template: `
            <div>
                <button type="button" ref="anchor">Click here</button>
                <Dropdown :anchor="anchor" visible>
                    <template>
                        Dropdown message {{animation}}
                    </template>
                </Dropdown>
            </div>`,
        });

        render(TestComponent, {
            global: {
                stubs: {
                    transition: transitionComponent,
                },
            },
        });
        await nextTick();
        expect(screen.getByTestId('transition')).toBeVisible;
    });

    it('validates the default value', async () => {
        const TestComponent = defineComponent({
            components: {Dropdown},
            data() {
                return {
                    visible: true,
                    anchor: null as HTMLElement | null,
                };
            },
            mounted() {
                this.anchor = this.$refs.anchor as HTMLElement;
            },
            template: `
            <div>
                <button type="button" ref="anchor">Click here</button>
                <Dropdown :anchor="anchor" visible>
                    <template>
                        Dropdown message {{animation}}
                    </template>
                </Dropdown>
            </div>`,
        });

        render(TestComponent, {
            global: {
                stubs: {
                    transition: transitionComponent,
                },
            },
        });
        await nextTick();
        expect(screen.getByTestId('transition')).toHaveAttribute('name', 'slide');
    });

    it('uses custom animation', async () => {
        const TestComponent = defineComponent({
            components: {Dropdown},
            data() {
                return {
                    visible: true,
                    anchor: null as HTMLElement | null,
                };
            },
            mounted() {
                this.anchor = this.$refs.anchor as HTMLElement;
            },
            template: `
            <div>
                <button type="button" ref="anchor">Click here</button>
                <Dropdown :anchor="anchor" visible animation="custom-animation">
                    <template>
                        Dropdown message {{animation}}
                    </template>
                </Dropdown>
            </div>`,
        });

        render(TestComponent, {
            global: {
                stubs: {
                    transition: transitionComponent,
                },
            },
        });
        await nextTick();
        expect(screen.getByTestId('transition')).toHaveAttribute('name', 'custom-animation');
    });
});

it('triggers "open" event when the dropdown is opened', async () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                visible: false,
                anchor: null as HTMLElement | null,
                isOpened: false,
            };
        },
        mounted() {
            this.anchor = this.$refs.anchor as HTMLElement;
        },
        template: `
            <div>
                <button type="button" ref="anchor" @click="visible = true">Click here</button>
                <Dropdown :anchor="anchor" :visible="visible" @open="isOpened = true">
                    <template>Dropdown message</template>
                </Dropdown>
                <div v-show="isOpened">Dropdown opened</div>
            </div>`,
    });

    render(TestComponent, {
        global: {
            stubs: {
                transition: false,
            },
        },
    });
    await fireEvent.click(screen.getByRole('button'));
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(screen.getByText(/Dropdown opened/)).toBeVisible();
});

it('triggers "close" event when the dropdown is closed', async () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                visible: true,
                anchor: null as HTMLElement | null,
                isClosed: false,
            };
        },
        mounted() {
            this.anchor = this.$refs.anchor as HTMLElement;
        },
        template: `
            <div>
                <button type="button" ref="anchor" @click="visible = false">Click here</button>
                <Dropdown :anchor="anchor" :visible="visible" @close="isClosed = true">
                    <template>Dropdown message</template>
                </Dropdown>
                <div v-show="isClosed">Dropdown opened</div>
            </div>`,
    });

    render(TestComponent, {
        global: {
            stubs: {
                transition: false,
            },
        },
    });
    await fireEvent.click(screen.getByRole('button'));
    // adjust the setTimeout time to the animation time.
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(screen.getByText(/Dropdown opened/)).toBeVisible();
});
