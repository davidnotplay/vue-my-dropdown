import {Position} from './MyDropdown.vue';

export type DropdownStyle = {
    position: 'absolute';
    top: string;
    left: string;
    transformOrigin: string;
};

type NormalizeRectKey = keyof Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;
type NormalizeRect = Record<NormalizeRectKey, number>;

/**
 * Creates the styles used by the dropdown element.
 *
 * @param $link Link element used to calculate the dropdown position.
 * @param $dropdown Dropdown element used to calculate its own position.
 * @param position Position keys determining how the dropdown is positioned relative to the link.
 * @returns An object representing the CSS styles for positioning the dropdown.
 */
export function createStyles(
    $link: HTMLElement,
    $dropdown: HTMLElement,
    position: Position
): DropdownStyle {
    const ddCorner = {top: 0, left: 0};
    const linkRect = normalizeRect($link.getBoundingClientRect());
    const offsetParent = $link.offsetParent as Element;
    const ddRect = getSize($dropdown);

    const parentRect = normalizeRect(offsetParent.getBoundingClientRect());
    ddCorner.left = linkRect.left - parentRect.left;
    ddCorner.top = linkRect.top - parentRect.top;
    const origin = {h: 'left', v: 'top'};

    switch (position[0].toLowerCase()) {
        case 'right':
            ddCorner.left += linkRect.width;
            break;

        case 'center':
            ddCorner.left += linkRect.width / 2;
            break;
    }

    switch (position[1].toLowerCase()) {
        case 'center':
            ddCorner.top += linkRect.height / 2;
            break;

        case 'bottom':
            ddCorner.top += linkRect.height;
            break;
    }

    switch (position[2].toLowerCase()) {
        case 'center':
            ddCorner.left -= ddRect.width / 2;
            origin.h = 'center';
            break;

        case 'right':
            ddCorner.left -= ddRect.width;
            origin.h = 'right';
            break;
    }

    switch (position[3].toLowerCase()) {
        case 'center':
            ddCorner.top -= ddRect.height / 2;
            origin.v = 'center';
            break;

        case 'bottom':
            ddCorner.top -= ddRect.height;
            origin.v = 'bottom';
            break;
    }

    return {
        position: 'absolute',
        top: `${Math.round(ddCorner.top)}px`,
        left: `${Math.round(ddCorner.left)}px`,
        transformOrigin: `${origin.h} ${origin.v}`,
    };
}

/**
 * Check if the clicked item is neither the link nor the dropdown,
 * nor a child element of either the link or the dropdown.
 *
 * @param $eleClicked Element that is clicked.
 * @param $link The link element to check.
 * @param $dd Dropdown The dropdown element to check.
 * @return True if the clicked item is outside the link and dropdown; false otherwise.
 */
export function clickout($eleClicked: HTMLElement, $link: HTMLElement, $dd: HTMLElement): boolean {
    return (
        $link != $eleClicked &&
        !$link.contains($eleClicked) &&
        $dd != $eleClicked &&
        !$dd.contains($eleClicked)
    );
}

/**
 * Get the dimensions of `$ele` element.
 *
 * @param $ele The element to measure.
 * @returns An object containing the width and height of the element.
 */
function getSize($ele: HTMLElement): {width: number; height: number} {
    const $clone = $ele.cloneNode(true) as HTMLElement;
    const size = {width: 0, height: 0};

    $clone.style.display = 'block';
    $clone.style.visibility = 'hidden';
    $clone.style.position = 'absolute';
    $ele.parentNode?.insertBefore($clone, $ele);
    size.width = $clone.offsetWidth;
    size.height = $clone.offsetHeight;
    const rect = normalizeRect($clone.getBoundingClientRect());

    $clone.remove();

    return rect;
}

/**
 * Normalize the values of the rect properties.
 *
 * @param rect Rect containing the properties to normalize.
 * @returns A rect object with the normalized properties.
 */
function normalizeRect(rect: DOMRect): NormalizeRect {
    const newRect: NormalizeRect = {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
    };

    Object.keys(newRect).forEach((key) => {
        newRect[key as NormalizeRectKey] = rect[key as NormalizeRectKey] as number;
    });

    return newRect;
}
