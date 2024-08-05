import {Position} from './BaseDropdown.vue';

export type DropdownStyle = {
    position: 'absolute';
    top: string;
    left: string;
};

type NormalizeRectKey = keyof Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;
type NormalizeRect = Record<NormalizeRectKey, number>;

/**
 * @TODO rename
 *
 * create the styles used by the dropdown element.
 *
 * @param $link Link element used to calculate the dropdown position.
 * @param $dropadown Dropdown element used to calculated his own position..
 * @param position Position keys
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
            break;

        case 'right':
            ddCorner.left -= ddRect.width;
            break;
    }

    switch (position[3].toLowerCase()) {
        case 'center':
            ddCorner.top -= ddRect.height / 2;
            break;

        case 'bottom':
            ddCorner.top -= ddRect.height;
            break;
    }

    return {
        position: 'absolute',
        top: `${Math.round(ddCorner.top)}px`,
        left: `${Math.round(ddCorner.left)}px`,
    };
}

/**
 * Get the dimensions of `$ele` ele.
 *
 * @return dimensions
 * @return dimensions.width `$ele` Element width.
 * @return dimensions.height `$ele` Element height.
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
 * Normalize the value sof the rect properties
 *
 * @param rect Rect containing the properties to normalize.
 * @return Rect object with the normalized properties.
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
