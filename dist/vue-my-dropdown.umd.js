(function (d, e) {
    typeof exports == 'object' && typeof module < 'u'
        ? e(exports, require('vue'))
        : typeof define == 'function' && define.amd
          ? define(['exports', 'vue'], e)
          : ((d = typeof globalThis < 'u' ? globalThis : d || self),
            e((d['vue-my-dropdown'] = {}), d.Vue));
})(this, function (d, e) {
    'use strict';
    function b(s, o, n) {
        const t = {top: 0, left: 0},
            c = h(s.getBoundingClientRect()),
            p = s.offsetParent,
            a = g(o),
            f = h(p.getBoundingClientRect());
        (t.left = c.left - f.left), (t.top = c.top - f.top);
        const l = {h: 'left', v: 'top'};
        switch (n[0].toLowerCase()) {
            case 'right':
                t.left += c.width;
                break;
            case 'center':
                t.left += c.width / 2;
                break;
        }
        switch (n[1].toLowerCase()) {
            case 'center':
                t.top += c.height / 2;
                break;
            case 'bottom':
                t.top += c.height;
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
    function g(s) {
        var t;
        const o = s.cloneNode(!0);
        (o.style.display = 'block'),
            (o.style.visibility = 'hidden'),
            (o.style.position = 'absolute'),
            (t = s.parentNode) == null || t.insertBefore(o, s),
            o.offsetWidth,
            o.offsetHeight;
        const n = h(o.getBoundingClientRect());
        return o.remove(), n;
    }
    function h(s) {
        const o = {width: 0, height: 0, top: 0, left: 0};
        return (
            Object.keys(o).forEach((n) => {
                o[n] = s[n];
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
            setup(s, {emit: o}) {
                e.useCssVars((i) => ({a3a04180: k}));
                const n = s,
                    t = e.ref(null),
                    c = o,
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
                    c('clickout', i, u, r);
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
                                onAfterEnter: r[0] || (r[0] = (u) => c('open')),
                                onAfterLeave: r[1] || (r[1] = (u) => c('close')),
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
