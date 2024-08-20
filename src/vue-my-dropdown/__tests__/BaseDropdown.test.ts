// @TODO try to remove the eslint exception.
/* eslint-disable vue/one-component-per-file */
import {fireEvent, render, screen} from '@testing-library/vue';
import Dropdown from '../../vue-my-dropdown/BaseDropdown.vue';
import {defineComponent, nextTick} from 'vue';

const addEventListenerMock = vi.fn();
const removeEventListenerMock = vi.fn();
const consoleWarn = vi.fn();

beforeEach(() => {
    addEventListenerMock.mockReset();
    removeEventListenerMock.mockReset();
    consoleWarn.mockReset();

    window.addEventListener = addEventListenerMock;
    window.removeEventListener = removeEventListenerMock;
    console.warn = consoleWarn;

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
    expect(screen.getByText(/Dropdown message/)).toBeVisible();
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
    expect(screen.getByText(/Dropdown message/)).toBeVisible();
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

it('displays console.warn when link property is not HTML element', async () => {
    const TestComponent = defineComponent({
        components: {Dropdown},
        data() {
            return {
                visible: true,
                link: null as HTMLElement | null,
            };
        },
        mounted() {
            this.link = this.$refs.link as HTMLElement;
        },
        template: `
        <div>
            <button type="button" ref="link">Click here</button>
            <Dropdown :link="3" visible>Dropdown message</Dropdown>
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
                link: null as null | HTMLElement,
            };
        },
        mounted() {
            this.link = this.$refs.link as HTMLElement;
        },
        template: `
        <div>
            <div data-testid="clickout">clickout</div>
            <button
                data-testid="link"
                type="button" ref="link"
                @click="visible = true"
            >
                Click here
            </button>
            <Dropdown :link="link" :visible="visible" @clickout="visible = false">
                <div data-testid="inner">Dropdown message</div>
            </Dropdown>
        </div>`,
    });

    beforeEach(() => {
        addEventListenerMock.mockReset();
        removeEventListenerMock.mockReset();
    });

    [
        {
            testId: 'clickout',
            expected: true,
        },
        {
            testId: 'link',
            expected: false,
        },
        {
            testId: 'inner',
            expected: false,
        },
    ].forEach(({testId, expected}) => {
        it(`triggers clickout event: Situation ${testId}`, async () => {
            render(TestComponent);
            await fireEvent.click(screen.getByRole('button'));
            await fireEvent.click(screen.getByTestId(testId));
            await nextTick();
            const prefix = expected ? 'not' : 'is';
            expect(screen.getByText(/Dropdown message/))[prefix].toBeVisible();
        });
    });
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
                    link: null as HTMLElement | null,
                };
            },
            mounted() {
                this.link = this.$refs.link as HTMLElement;
            },
            template: `
            <div>
                <button type="button" ref="link">Click here</button>
                <Dropdown :link="3" visible>
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
                    link: null as HTMLElement | null,
                };
            },
            mounted() {
                this.link = this.$refs.link as HTMLElement;
            },
            template: `
            <div>
                <button type="button" ref="link">Click here</button>
                <Dropdown :link="3" visible>
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
                    link: null as HTMLElement | null,
                };
            },
            mounted() {
                this.link = this.$refs.link as HTMLElement;
            },
            template: `
            <div>
                <button type="button" ref="link">Click here</button>
                <Dropdown :link="3" visible animation="custom-animation">
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
