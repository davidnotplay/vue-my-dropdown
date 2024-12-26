import {ComponentOptionsMixin} from 'vue';
import {DefineComponent} from 'vue';
import {ExtractPropTypes} from 'vue';
import {PropType} from 'vue';
import {PublicProps} from 'vue';
import {Slot} from 'vue';

declare type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;

declare type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

declare type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K>
        ? {
              type: PropType<__VLS_NonUndefinedable<T[K]>>;
          }
        : {
              type: PropType<T[K]>;
              required: true;
          };
};

declare type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D
        ? __VLS_Prettify<
              P[K] & {
                  default: D[K];
              }
          >
        : P[K];
};

declare type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type Animation_2 = string;
export {Animation_2 as Animation};

export declare type Horizontal = 'left' | 'center' | 'right';

export declare const MyDropdown: __VLS_WithTemplateSlots<
    DefineComponent<
        __VLS_WithDefaults<
            __VLS_TypePropsToOption<MyDropdownProps>,
            {
                position: () => string[];
                animation: string;
            }
        >,
        {},
        unknown,
        {},
        {},
        ComponentOptionsMixin,
        ComponentOptionsMixin,
        {
            clickout: (ev: Event, clickInDD: boolean, clickInAnchor: boolean) => void;
            open: () => void;
            close: () => void;
        },
        string,
        PublicProps,
        Readonly<
            ExtractPropTypes<
                __VLS_WithDefaults<
                    __VLS_TypePropsToOption<MyDropdownProps>,
                    {
                        position: () => string[];
                        animation: string;
                    }
                >
            >
        > & {
            onClickout?:
                | ((ev: Event, clickInDD: boolean, clickInAnchor: boolean) => any)
                | undefined;
            onOpen?: (() => any) | undefined;
            onClose?: (() => any) | undefined;
        },
        {
            position: Position;
            animation: string;
        },
        {}
    >,
    Readonly<{
        default(): Slot;
    }> & {
        default(): Slot;
    }
>;

export declare type MyDropdownProps = {
    anchor: HTMLElement | null;
    visible: boolean;
    position?: Position;
    animation?: Animation_2;
};

export declare type Position = [Horizontal, Vertical, Horizontal, Vertical];

export declare type Vertical = 'top' | 'center' | 'bottom';

export {};
