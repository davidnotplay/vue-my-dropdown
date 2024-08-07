import {cleanup, fireEvent, render, screen} from '@testing-library/vue';
import Dropdown from '../../vue-my-dropdown/BaseDropdown.vue';
import {nextTick} from 'vue';

beforeEach(() => {
    cleanup();
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
        get() {
            return document.querySelector('body');
        },
    });
});

it('exists', () => {
    expect(Dropdown).toBeTruthy();
});

it('displays default slot', () => {
    const TestComponent = {
        template: `<Dropdown><div>Default slot</div></Dropdown>`,
        components: {Dropdown},
    };

    render(TestComponent);
    expect(screen.getByText(/Default slot/)).toBeInTheDocument();
});

it('hides `dropdown` slot by default', () => {
    const TestComponent = {
        template: `
<Dropdown>
    <div>Default slot</div>
    <template v-slot:dropdown>Dropdown message</template>
</Dropdown>
`,
        components: {Dropdown},
    };

    render(TestComponent);
    expect(screen.getByText(/Dropdown message/)).not.toBeVisible();
});

it('shows `dropdown` slot when the `visible` property is true', () => {
    const TestComponent = {
        template: `
<Dropdown visible>
    <div>Default slot</div>
    <template v-slot:dropdown>Dropdown message</template>
</Dropdown>
`,
        components: {Dropdown},
    };

    render(TestComponent);
    expect(screen.getByText(/Dropdown message/)).toBeVisible();
});

it('executes `open` function when the initial value of `visible` property is true', async () => {
    const TestComponent = {
        template: `
<Dropdown visible>
    <div>Default slot</div>
    <template v-slot:dropdown>
        <div data-testid="dropdown">
            Dropdown message
        </div>
    </template>
</Dropdown>
`,
        components: {Dropdown},
    };

    render(TestComponent);
    await nextTick();
    expect(screen.getByTestId('dropdown')!.parentElement!.style!.position).toBe('absolute');
});

it('executes `open` function when the `visible` property changes to `true` value', async () => {
    const TestComponent = {
        template: `
        <Dropdown :visible>
            <button type="button" @click="visible = true">show {{visible}}</button>
            <template v-slot:dropdown>
                <div data-testid="dropdown">
                    Dropdown message
                </div>
            </template>
        </Dropdown>
`,
        components: {Dropdown},
        data() {
            return {visible: false};
        },
    };

    render(TestComponent);
    await nextTick();
    await fireEvent.click(screen.getByRole('button'));
    await nextTick();
    expect(screen.getByTestId('dropdown')!.parentElement!.style!.position).toBe('absolute');
});
