import {getByTestId} from '@testing-library/dom';
import {render} from '@testing-library/vue';
import {DropdownStyle, clickout, createStyles} from '../helpers';
import {Position} from '../BaseDropdown.vue';

type Styles = {[key: string]: string};

function createComponent(containerStyles: Styles) {
    const template =
        '<div :style="containerStyles" id="container">' +
        '<span id="link">link</span>' +
        '<span id="dropdown">dropdown</span>' +
        '</div>';
    return {
        template,
        data() {
            return {
                containerStyles,
            };
        },
    };
}

function getLink() {
    return document.querySelector('body #link');
}

function getDropdown() {
    return document.querySelector('body #dropdown');
}

describe('Function createStyles', () => {
    it('is function', () => {
        expect(createStyles).toBeInstanceOf(Function);
    });

    const situations: {
        name: string;
        containerStyles: Styles;
        expected: DropdownStyle;
        position: Position;
        offsetParentSelector: string;
        linkRect: Partial<DOMRect>;
        ddRect: Partial<DOMRect>;
        offParentRect: Partial<DOMRect>;
    }[] = [
        {
            name: `Situation: 'left', 'top', 'left', 'top'. Default`,

            linkRect: {width: 100, height: 100, left: 200, top: 200},
            containerStyles: {display: 'block', width: '100%', height: '100%'},

            position: ['left', 'top', 'left', 'top'],
            expected: {
                position: 'absolute',
                left: '200px',
                top: '200px',
                transformOrigin: 'left top',
            },

            ddRect: {width: 10, height: 10, left: 40, top: 40},
            offsetParentSelector: 'body',
            offParentRect: {top: 0, left: 0},
        },
        {
            name: `Situation: 'center', 'top', 'left', 'top'. Default`,

            linkRect: {width: 100, height: 100, left: 200, top: 200},
            containerStyles: {display: 'block', width: '100%', height: '100%'},

            position: ['center', 'top', 'left', 'top'],
            expected: {
                position: 'absolute',
                left: '250px',
                top: '200px',
                transformOrigin: 'left top',
            },

            ddRect: {width: 10, height: 10, left: 40, top: 40},
            offsetParentSelector: 'body',
            offParentRect: {top: 0, left: 0},
        },
        {
            name: `Situation: 'right', 'top', 'left', 'top'. Default`,

            linkRect: {width: 100, height: 100, left: 200, top: 200},
            containerStyles: {display: 'block', width: '100%', height: '100%'},

            position: ['right', 'top', 'left', 'top'],
            expected: {
                position: 'absolute',
                left: '300px',
                top: '200px',
                transformOrigin: 'left top',
            },

            ddRect: {width: 10, height: 10, left: 40, top: 40},
            offsetParentSelector: 'body',
            offParentRect: {top: 0, left: 0},
        },

        {
            name: `Situation: 'left', 'center', 'left', 'top'. Default`,

            linkRect: {width: 100, height: 100, left: 200, top: 200},
            containerStyles: {display: 'block', width: '100%', height: '100%'},

            position: ['left', 'center', 'left', 'top'],
            expected: {
                position: 'absolute',
                left: '200px',
                top: '250px',
                transformOrigin: 'left top',
            },

            ddRect: {width: 10, height: 10, left: 40, top: 40},
            offsetParentSelector: 'body',
            offParentRect: {top: 0, left: 0},
        },
        {
            name: `Situation: 'left', 'bottom', 'left', 'top'. Default`,

            linkRect: {width: 100, height: 100, left: 200, top: 200},
            containerStyles: {display: 'block', width: '100%', height: '100%'},

            position: ['left', 'bottom', 'left', 'top'],
            expected: {
                position: 'absolute',
                left: '200px',
                top: '300px',
                transformOrigin: 'left top',
            },

            ddRect: {width: 10, height: 10, left: 40, top: 40},
            offsetParentSelector: 'body',
            offParentRect: {top: 0, left: 0},
        },

        {
            name: `Situation: 'left', 'top', 'center', 'top'. Default`,

            linkRect: {width: 100, height: 100, left: 200, top: 200},
            containerStyles: {display: 'block', width: '100%', height: '100%'},

            position: ['left', 'top', 'center', 'top'],
            expected: {
                position: 'absolute',
                left: '195px',
                top: '200px',
                transformOrigin: 'center top',
            },

            ddRect: {width: 10, height: 10, left: 40, top: 40},
            offsetParentSelector: 'body',
            offParentRect: {top: 0, left: 0},
        },
        {
            name: `Situation: 'left', 'top', 'right', 'top'. Default`,

            linkRect: {width: 100, height: 100, left: 200, top: 200},
            containerStyles: {display: 'block', width: '100%', height: '100%'},

            position: ['left', 'top', 'right', 'top'],
            expected: {
                position: 'absolute',
                left: '190px',
                top: '200px',
                transformOrigin: 'right top',
            },

            ddRect: {width: 10, height: 10, left: 40, top: 40},
            offsetParentSelector: 'body',
            offParentRect: {top: 0, left: 0},
        },

        {
            name: `Situation: 'left', 'top', 'left', 'center'. Default`,

            linkRect: {width: 100, height: 100, left: 200, top: 200},
            containerStyles: {display: 'block', width: '100%', height: '100%'},

            position: ['left', 'top', 'left', 'center'],
            expected: {
                position: 'absolute',
                left: '200px',
                top: '195px',
                transformOrigin: 'left center',
            },

            ddRect: {width: 10, height: 10, left: 40, top: 40},
            offsetParentSelector: 'body',
            offParentRect: {top: 0, left: 0},
        },
        {
            name: `Situation: 'left', 'top', 'left', 'bottom'. Default`,

            linkRect: {width: 100, height: 100, left: 200, top: 200},
            containerStyles: {display: 'block', width: '100%', height: '100%'},

            position: ['left', 'top', 'left', 'bottom'],
            expected: {
                position: 'absolute',
                left: '200px',
                top: '190px',
                transformOrigin: 'left bottom',
            },

            ddRect: {width: 10, height: 10, left: 40, top: 40},
            offsetParentSelector: 'body',
            offParentRect: {top: 0, left: 0},
        },

        {
            name: `Situation: 'left', 'top', 'left', 'top'. Absolute`,

            linkRect: {width: 100, height: 100, left: 200, top: 200},
            containerStyles: {
                display: 'block',
                width: '100%',
                height: '100%',
                position: 'absolute',
            },

            position: ['left', 'top', 'left', 'top'],
            expected: {
                position: 'absolute',
                left: '170px',
                top: '170px',
                transformOrigin: 'left top',
            },

            ddRect: {width: 10, height: 10, left: 40, top: 40},
            offsetParentSelector: 'body #container',
            offParentRect: {top: 30, left: 30},
        },
        {
            name: `Situation: 'left', 'top', 'left', 'top'. Fixed`,

            linkRect: {width: 100, height: 100, left: 200, top: 200},
            containerStyles: {
                display: 'block',
                width: '100%',
                height: '100%',
                position: 'fixed',
            },

            position: ['left', 'top', 'left', 'top'],
            expected: {
                position: 'absolute',
                left: '170px',
                top: '170px',
                transformOrigin: 'left top',
            },

            ddRect: {width: 10, height: 10, left: 40, top: 40},
            offsetParentSelector: 'body #container',
            offParentRect: {top: 30, left: 30},
        },
    ];

    situations.forEach((situation) => {
        it(`retrieves the position in stituation ${situation.name}`, async () => {
            render(createComponent(situation.containerStyles));

            const $link = getLink() as HTMLElement;
            const $dd = getDropdown() as HTMLElement;

            window.HTMLElement.prototype.getBoundingClientRect = function () {
                if (this == $link) {
                    return situation.linkRect as DOMRect;
                }

                if (this == document.querySelector(situation.offsetParentSelector)) {
                    return situation.offParentRect as DOMRect;
                }

                return situation.ddRect as DOMRect;
            };

            Object.defineProperty(window.HTMLElement.prototype, 'offsetWidth', {
                get() {
                    return situation.ddRect.width;
                },
            });

            Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', {
                get() {
                    return situation.ddRect.height;
                },
            });

            Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
                get() {
                    return document.querySelector(situation.offsetParentSelector);
                },
            });

            // screen.debug();
            expect(createStyles($link, $dd, situation.position)).toEqual(situation.expected);
        });
    });
});

describe('Function clickout', () => {
    it('exists', () => {
        expect(clickout).toBeTypeOf('function');
    });
    const $container = document.createElement('div');

    $container.innerHTML = `<div data-testid="main-container">
        <div data-testid="clickout-top" style="height:100px; width:100%">click out top</div>
        <div data-testid="link" style="height:100px; width:100%">
            link
            <div data-testid="link-inner" style="height:100px; width:100%; margin:2%">
                link inner
            </div>
        </div>
        <div data-testid="dropdown" style="height:100px; width:100%">
            dropdown
            <div data-testid="dropdown-inner" style="height:100px; width:100%; margin:2%">
                dropdown inner
            </div>
        </div>
        <div data-testid="clickout-bottom" style="height:100px; width:100%">click out bottom</div>
    </div>`;

    const $clickoutTop = getByTestId($container, 'clickout-top');
    const $link = getByTestId($container, 'link');
    const $linkInner = getByTestId($container, 'link-inner');
    const $dropdown = getByTestId($container, 'dropdown');
    const $ddInner = getByTestId($container, 'dropdown-inner');
    const $clickoutBottom = getByTestId($container, 'clickout-bottom');

    [
        {
            $element: $clickoutTop,
            expected: true,
        },
        {
            $element: $link,
            expected: false,
        },
        {
            $element: $linkInner,
            expected: false,
        },
        {
            $element: $dropdown,
            expected: false,
        },
        {
            $element: $ddInner,
            expected: false,
        },
        {
            $element: $clickoutBottom,
            expected: true,
        },
    ].forEach(({$element, expected}, i) => {
        it(`clicks out of dropdown: Situtation ${i + 1}`, () => {
            expect(clickout($element, $link, $dropdown)).toBe(expected);
        });
    });
});
