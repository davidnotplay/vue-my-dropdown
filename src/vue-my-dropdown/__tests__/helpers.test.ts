import {render} from '@testing-library/vue';
import {DropdownStyle, createStyles} from '../helpers';
import {Position} from '../MyDropdown.vue';

type Styles = {[key: string]: string};

function createComponent(containerStyles: Styles) {
    const template =
        '<div :style="containerStyles" id="container">' +
        '<span id="anchor">anchor</span>' +
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

function getAnchor() {
    return document.querySelector('body #anchor');
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
        anchorRect: Partial<DOMRect>;
        ddRect: Partial<DOMRect>;
        offParentRect: Partial<DOMRect>;
    }[] = [
        {
            name: `Situation: 'left', 'top', 'left', 'top'. Default`,

            anchorRect: {width: 100, height: 100, left: 200, top: 200},
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

            anchorRect: {width: 100, height: 100, left: 200, top: 200},
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

            anchorRect: {width: 100, height: 100, left: 200, top: 200},
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

            anchorRect: {width: 100, height: 100, left: 200, top: 200},
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

            anchorRect: {width: 100, height: 100, left: 200, top: 200},
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

            anchorRect: {width: 100, height: 100, left: 200, top: 200},
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

            anchorRect: {width: 100, height: 100, left: 200, top: 200},
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

            anchorRect: {width: 100, height: 100, left: 200, top: 200},
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

            anchorRect: {width: 100, height: 100, left: 200, top: 200},
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

            anchorRect: {width: 100, height: 100, left: 200, top: 200},
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

            anchorRect: {width: 100, height: 100, left: 200, top: 200},
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

            const $anchor = getAnchor() as HTMLElement;
            const $dd = getDropdown() as HTMLElement;

            window.HTMLElement.prototype.getBoundingClientRect = function () {
                if (this == $anchor) {
                    return situation.anchorRect as DOMRect;
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
            expect(createStyles($anchor, $dd, situation.position)).toEqual(situation.expected);
        });
    });
});
