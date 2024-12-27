(function (d, e) {
    typeof exports == 'object' && typeof module < 'u'
        ? e(exports, require('vue'))
        : typeof define == 'function' && define.amd
          ? define(['exports', 'vue'], e)
          : ((d = typeof globalThis < 'u' ? globalThis : d || self),
            e((d['vue-my-dropdown'] = {}), d.Vue));
})(this, function (d, e) {
    'use strict';
    function b(c, o, n) {
        const t = {top: 0, left: 0},
            s = h(c.getBoundingClientRect()),
            p = c.offsetParent,
            a = g(o),
            f = h(p.getBoundingClientRect());
        (t.left = s.left - f.left), (t.top = s.top - f.top);
        const l = {h: 'left', v: 'top'};
        switch (n[0].toLowerCase()) {
            case 'right':
                t.left += s.width;
                break;
            case 'center':
                t.left += s.width / 2;
                break;
        }
        switch (n[1].toLowerCase()) {
            case 'center':
                t.top += s.height / 2;
                break;
            case 'bottom':
                t.top += s.height;
                break;
        }
        switch (n[2].toLowerCase()) {
            case 'center':
                (t.left -= a.width / 2), (l.h = 'center');
                break;
            case 'right':
                (t.left -= a.width), (l.h = 'right');
                break;
        }
        switch (n[3].toLowerCase()) {
            case 'center':
                (t.top -= a.height / 2), (l.v = 'center');
                break;
            case 'bottom':
                (t.top -= a.height), (l.v = 'bottom');
                break;
        }
        return {
            position: 'absolute',
            top: `${Math.round(t.top)}px`,
            left: `${Math.round(t.left)}px`,
            transformOrigin: `${l.h} ${l.v}`,
        };
    }
    function g(c) {
        var t;
        const o = c.cloneNode(!0);
        (o.style.display = 'block'),
            (o.style.visibility = 'hidden'),
            (o.style.position = 'absolute'),
            (t = c.parentNode) == null || t.insertBefore(o, c),
            o.offsetWidth,
            o.offsetHeight;
        const n = h(o.getBoundingClientRect());
        return o.remove(), n;
    }
    function h(c) {
        const o = {width: 0, height: 0, top: 0, left: 0};
        return (
            Object.keys(o).forEach((n) => {
                o[n] = c[n];
            }),
            o
        );
    }
    const k = '0.3s',
        y = e.defineComponent({
            __name: 'MyDropdown',
            props: {
                anchor: {},
                visible: {type: Boolean},
                position: {default: () => ['right', 'top', 'left', 'top']},
                animation: {default: 'slide'},
            },
            emits: ['clickout', 'open', 'close'],
            setup(c, {emit: o}) {
                e.useCssVars((i) => ({cedcd6a4: k}));
                const n = c,
                    t = e.ref(null),
                    s = o,
                    p = e.ref({});
                function a() {
                    if (n.anchor !== null && t.value !== null) {
                        if (n.anchor instanceof HTMLElement) {
                            p.value = b(n.anchor, t.value, n.position);
                            return;
                        }
                        console.warn('Anchor property is not HTML element.');
                    }
                }
                function f() {
                    a(),
                        window.addEventListener('resize', a),
                        e.nextTick(() => document.addEventListener('click', m));
                }
                function l(i, r) {
                    return r instanceof HTMLElement && r.contains(i);
                }
                function m(i) {
                    const r = l(i.target, n.anchor),
                        u = l(i.target, t.value);
                    s('clickout', i, u, r);
                }
                function w() {
                    window.removeEventListener('resize', a),
                        document.removeEventListener('click', m);
                }
                return (
                    e.watch(
                        () => n.visible,
                        async (i, r) => {
                            if (i != r) {
                                if (i) {
                                    f();
                                    return;
                                }
                                w();
                            }
                        }
                    ),
                    e.onMounted(() => {
                        n.visible && e.nextTick(f);
                    }),
                    e.onUnmounted(() => {
                        n.visible && w();
                    }),
                    (i, r) => (
                        e.openBlock(),
                        e.createBlock(
                            e.Transition,
                            {
                                name: i.animation,
                                onAfterEnter: r[0] || (r[0] = (u) => s('open')),
                                onAfterLeave: r[1] || (r[1] = (u) => s('close')),
                            },
                            {
                                default: e.withCtx(() => [
                                    e.withDirectives(
                                        e.createElementVNode(
                                            'div',
                                            {
                                                ref_key: '$dropdown',
                                                ref: t,
                                                style: e.normalizeStyle(p.value),
                                            },
                                            [e.renderSlot(i.$slots, 'default')],
                                            4
                                        ),
                                        [[e.vShow, i.visible]]
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
    (d.MyDropdown = y), Object.defineProperty(d, Symbol.toStringTag, {value: 'Module'});
});
