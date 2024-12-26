import {
    defineComponent as v,
    useCssVars as b,
    ref as m,
    watch as g,
    onMounted as k,
    nextTick as w,
    onUnmounted as y,
    openBlock as C,
    createBlock as L,
    Transition as E,
    withCtx as M,
    withDirectives as R,
    createElementVNode as B,
    normalizeStyle as S,
    renderSlot as T,
    vShow as $,
} from 'vue';
function z(r, n, t) {
    const e = {top: 0, left: 0},
        c = u(r.getBoundingClientRect()),
        d = r.offsetParent,
        l = D(n),
        a = u(d.getBoundingClientRect());
    (e.left = c.left - a.left), (e.top = c.top - a.top);
    const s = {h: 'left', v: 'top'};
    switch (t[0].toLowerCase()) {
        case 'right':
            e.left += c.width;
            break;
        case 'center':
            e.left += c.width / 2;
            break;
    }
    switch (t[1].toLowerCase()) {
        case 'center':
            e.top += c.height / 2;
            break;
        case 'bottom':
            e.top += c.height;
            break;
    }
    switch (t[2].toLowerCase()) {
        case 'center':
            (e.left -= l.width / 2), (s.h = 'center');
            break;
        case 'right':
            (e.left -= l.width), (s.h = 'right');
            break;
    }
    switch (t[3].toLowerCase()) {
        case 'center':
            (e.top -= l.height / 2), (s.v = 'center');
            break;
        case 'bottom':
            (e.top -= l.height), (s.v = 'bottom');
            break;
    }
    return {
        position: 'absolute',
        top: `${Math.round(e.top)}px`,
        left: `${Math.round(e.left)}px`,
        transformOrigin: `${s.h} ${s.v}`,
    };
}
function D(r) {
    var e;
    const n = r.cloneNode(!0);
    (n.style.display = 'block'),
        (n.style.visibility = 'hidden'),
        (n.style.position = 'absolute'),
        (e = r.parentNode) == null || e.insertBefore(n, r),
        n.offsetWidth,
        n.offsetHeight;
    const t = u(n.getBoundingClientRect());
    return n.remove(), t;
}
function u(r) {
    const n = {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
    };
    return (
        Object.keys(n).forEach((t) => {
            n[t] = r[t];
        }),
        n
    );
}
const x = '0.3s',
    H = /* @__PURE__ */ v({
        __name: 'MyDropdown',
        props: {
            anchor: {},
            visible: {type: Boolean},
            position: {default: () => ['right', 'top', 'left', 'top']},
            animation: {default: 'slide'},
        },
        emits: ['clickout', 'open', 'close'],
        setup(r, {emit: n}) {
            b((o) => ({
                cedcd6a4: x,
            }));
            const t = r,
                e = m(null),
                c = n,
                d = m({});
            function l() {
                if (t.anchor !== null && e.value !== null) {
                    if (t.anchor instanceof HTMLElement) {
                        d.value = z(t.anchor, e.value, t.position);
                        return;
                    }
                    console.warn('Anchor property is not HTML element.');
                }
            }
            function a() {
                l(),
                    window.addEventListener('resize', l),
                    w(() => document.addEventListener('click', h));
            }
            function s(o, i) {
                return i instanceof HTMLElement && i.contains(o);
            }
            function h(o) {
                const i = s(o.target, t.anchor),
                    f = s(o.target, e.value);
                c('clickout', o, f, i);
            }
            function p() {
                window.removeEventListener('resize', l), document.removeEventListener('click', h);
            }
            return (
                g(
                    () => t.visible,
                    async (o, i) => {
                        if (o != i) {
                            if (o) {
                                a();
                                return;
                            }
                            p();
                        }
                    }
                ),
                k(() => {
                    t.visible && w(a);
                }),
                y(() => {
                    t.visible && p();
                }),
                (o, i) => (
                    C(),
                    L(
                        E,
                        {
                            name: o.animation,
                            onAfterEnter: i[0] || (i[0] = (f) => c('open')),
                            onAfterLeave: i[1] || (i[1] = (f) => c('close')),
                        },
                        {
                            default: M(() => [
                                R(
                                    B(
                                        'div',
                                        {
                                            ref_key: '$dropdown',
                                            ref: e,
                                            style: S(d.value),
                                        },
                                        [T(o.$slots, 'default')],
                                        4
                                    ),
                                    [[$, o.visible]]
                                ),
                            ]),
                            _: 3,
                        },
                        8,
                        ['name']
                    )
                )
            );
        },
    });
export {H as MyDropdown};
