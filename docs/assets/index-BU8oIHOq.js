(function () {
    const t = document.createElement('link').relList;
    if (t && t.supports && t.supports('modulepreload')) return;
    for (const r of document.querySelectorAll('link[rel="modulepreload"]')) s(r);
    new MutationObserver((r) => {
        for (const i of r)
            if (i.type === 'childList')
                for (const o of i.addedNodes)
                    o.tagName === 'LINK' && o.rel === 'modulepreload' && s(o);
    }).observe(document, {childList: !0, subtree: !0});
    function n(r) {
        const i = {};
        return (
            r.integrity && (i.integrity = r.integrity),
            r.referrerPolicy && (i.referrerPolicy = r.referrerPolicy),
            r.crossOrigin === 'use-credentials'
                ? (i.credentials = 'include')
                : r.crossOrigin === 'anonymous'
                  ? (i.credentials = 'omit')
                  : (i.credentials = 'same-origin'),
            i
        );
    }
    function s(r) {
        if (r.ep) return;
        r.ep = !0;
        const i = n(r);
        fetch(r.href, i);
    }
})();
/**
 * @vue/shared v3.4.19
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function ki(e, t) {
    const n = new Set(e.split(','));
    return (s) => n.has(s);
}
const Pi = () => {},
    Oi = Object.prototype.hasOwnProperty,
    pn = (e, t) => Oi.call(e, t),
    ht = Array.isArray,
    an = (e) => _r(e) === '[object Map]',
    Ii = (e) => typeof e == 'function',
    Li = (e) => typeof e == 'string',
    bn = (e) => typeof e == 'symbol',
    _n = (e) => e !== null && typeof e == 'object',
    Ri = Object.prototype.toString,
    _r = (e) => Ri.call(e),
    Mi = (e) => _r(e).slice(8, -1),
    fs = (e) => Li(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e,
    Tt = (e, t) => !Object.is(e, t),
    Ni = (e, t, n) => {
        Object.defineProperty(e, t, {configurable: !0, enumerable: !1, value: n});
    };
/**
 * @vue/reactivity v3.4.19
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let Pe;
class Di {
    constructor(t = !1) {
        (this.detached = t),
            (this._active = !0),
            (this.effects = []),
            (this.cleanups = []),
            (this.parent = Pe),
            !t && Pe && (this.index = (Pe.scopes || (Pe.scopes = [])).push(this) - 1);
    }
    get active() {
        return this._active;
    }
    run(t) {
        if (this._active) {
            const n = Pe;
            try {
                return (Pe = this), t();
            } finally {
                Pe = n;
            }
        }
    }
    on() {
        Pe = this;
    }
    off() {
        Pe = this.parent;
    }
    stop(t) {
        if (this._active) {
            let n, s;
            for (n = 0, s = this.effects.length; n < s; n++) this.effects[n].stop();
            for (n = 0, s = this.cleanups.length; n < s; n++) this.cleanups[n]();
            if (this.scopes)
                for (n = 0, s = this.scopes.length; n < s; n++) this.scopes[n].stop(!0);
            if (!this.detached && this.parent && !t) {
                const r = this.parent.scopes.pop();
                r && r !== this && ((this.parent.scopes[this.index] = r), (r.index = this.index));
            }
            (this.parent = void 0), (this._active = !1);
        }
    }
}
function ji(e, t = Pe) {
    t && t.active && t.effects.push(e);
}
function Hi() {
    return Pe;
}
let gt;
class ds {
    constructor(t, n, s, r) {
        (this.fn = t),
            (this.trigger = n),
            (this.scheduler = s),
            (this.active = !0),
            (this.deps = []),
            (this._dirtyLevel = 4),
            (this._trackId = 0),
            (this._runnings = 0),
            (this._shouldSchedule = !1),
            (this._depsLength = 0),
            ji(this, r);
    }
    get dirty() {
        if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
            (this._dirtyLevel = 1), yt();
            for (let t = 0; t < this._depsLength; t++) {
                const n = this.deps[t];
                if (n.computed && (Bi(n.computed), this._dirtyLevel >= 4)) break;
            }
            this._dirtyLevel === 1 && (this._dirtyLevel = 0), bt();
        }
        return this._dirtyLevel >= 4;
    }
    set dirty(t) {
        this._dirtyLevel = t ? 4 : 0;
    }
    run() {
        if (((this._dirtyLevel = 0), !this.active)) return this.fn();
        let t = Qe,
            n = gt;
        try {
            return (Qe = !0), (gt = this), this._runnings++, Ms(this), this.fn();
        } finally {
            Ns(this), this._runnings--, (gt = n), (Qe = t);
        }
    }
    stop() {
        var t;
        this.active &&
            (Ms(this), Ns(this), (t = this.onStop) == null || t.call(this), (this.active = !1));
    }
}
function Bi(e) {
    return e.value;
}
function Ms(e) {
    e._trackId++, (e._depsLength = 0);
}
function Ns(e) {
    if (e.deps.length > e._depsLength) {
        for (let t = e._depsLength; t < e.deps.length; t++) xr(e.deps[t], e);
        e.deps.length = e._depsLength;
    }
}
function xr(e, t) {
    const n = e.get(t);
    n !== void 0 && t._trackId !== n && (e.delete(t), e.size === 0 && e.cleanup());
}
let Qe = !0,
    Vn = 0;
const wr = [];
function yt() {
    wr.push(Qe), (Qe = !1);
}
function bt() {
    const e = wr.pop();
    Qe = e === void 0 ? !0 : e;
}
function ps() {
    Vn++;
}
function hs() {
    for (Vn--; !Vn && Gn.length; ) Gn.shift()();
}
function Ar(e, t, n) {
    if (t.get(e) !== e._trackId) {
        t.set(e, e._trackId);
        const s = e.deps[e._depsLength];
        s !== t ? (s && xr(s, e), (e.deps[e._depsLength++] = t)) : e._depsLength++;
    }
}
const Gn = [];
function Er(e, t, n) {
    ps();
    for (const s of e.keys()) {
        let r;
        s._dirtyLevel < t &&
            (r ?? (r = e.get(s) === s._trackId)) &&
            (s._shouldSchedule || (s._shouldSchedule = s._dirtyLevel === 0), (s._dirtyLevel = t)),
            s._shouldSchedule &&
                (r ?? (r = e.get(s) === s._trackId)) &&
                (s.trigger(),
                (!s._runnings || s.allowRecurse) &&
                    s._dirtyLevel !== 2 &&
                    ((s._shouldSchedule = !1), s.scheduler && Gn.push(s.scheduler)));
    }
    hs();
}
const Sr = (e, t) => {
        const n = new Map();
        return (n.cleanup = e), (n.computed = t), n;
    },
    Kn = new WeakMap(),
    mt = Symbol(''),
    qn = Symbol('');
function xe(e, t, n) {
    if (Qe && gt) {
        let s = Kn.get(e);
        s || Kn.set(e, (s = new Map()));
        let r = s.get(n);
        r || s.set(n, (r = Sr(() => s.delete(n)))), Ar(gt, r);
    }
}
function Ve(e, t, n, s, r, i) {
    const o = Kn.get(e);
    if (!o) return;
    let l = [];
    if (t === 'clear') l = [...o.values()];
    else if (n === 'length' && ht(e)) {
        const a = Number(s);
        o.forEach((d, f) => {
            (f === 'length' || (!bn(f) && f >= a)) && l.push(d);
        });
    } else
        switch ((n !== void 0 && l.push(o.get(n)), t)) {
            case 'add':
                ht(e)
                    ? fs(n) && l.push(o.get('length'))
                    : (l.push(o.get(mt)), an(e) && l.push(o.get(qn)));
                break;
            case 'delete':
                ht(e) || (l.push(o.get(mt)), an(e) && l.push(o.get(qn)));
                break;
            case 'set':
                an(e) && l.push(o.get(mt));
                break;
        }
    ps();
    for (const a of l) a && Er(a, 4);
    hs();
}
const Ui = ki('__proto__,__v_isRef,__isVue'),
    Fr = new Set(
        Object.getOwnPropertyNames(Symbol)
            .filter((e) => e !== 'arguments' && e !== 'caller')
            .map((e) => Symbol[e])
            .filter(bn)
    ),
    Ds = zi();
function zi() {
    const e = {};
    return (
        ['includes', 'indexOf', 'lastIndexOf'].forEach((t) => {
            e[t] = function (...n) {
                const s = Y(this);
                for (let i = 0, o = this.length; i < o; i++) xe(s, 'get', i + '');
                const r = s[t](...n);
                return r === -1 || r === !1 ? s[t](...n.map(Y)) : r;
            };
        }),
        ['push', 'pop', 'shift', 'unshift', 'splice'].forEach((t) => {
            e[t] = function (...n) {
                yt(), ps();
                const s = Y(this)[t].apply(this, n);
                return hs(), bt(), s;
            };
        }),
        e
    );
}
function Vi(e) {
    const t = Y(this);
    return xe(t, 'has', e), t.hasOwnProperty(e);
}
class Cr {
    constructor(t = !1, n = !1) {
        (this._isReadonly = t), (this._shallow = n);
    }
    get(t, n, s) {
        const r = this._isReadonly,
            i = this._shallow;
        if (n === '__v_isReactive') return !r;
        if (n === '__v_isReadonly') return r;
        if (n === '__v_isShallow') return i;
        if (n === '__v_raw')
            return s === (r ? (i ? so : Pr) : i ? kr : Tr).get(t) ||
                Object.getPrototypeOf(t) === Object.getPrototypeOf(s)
                ? t
                : void 0;
        const o = ht(t);
        if (!r) {
            if (o && pn(Ds, n)) return Reflect.get(Ds, n, s);
            if (n === 'hasOwnProperty') return Vi;
        }
        const l = Reflect.get(t, n, s);
        return (bn(n) ? Fr.has(n) : Ui(n)) || (r || xe(t, 'get', n), i)
            ? l
            : we(l)
              ? o && fs(n)
                  ? l
                  : l.value
              : _n(l)
                ? r
                    ? Or(l)
                    : vs(l)
                : l;
    }
}
class $r extends Cr {
    constructor(t = !1) {
        super(!1, t);
    }
    set(t, n, s, r) {
        let i = t[n];
        if (!this._shallow) {
            const a = Ft(i);
            if ((!hn(s) && !Ft(s) && ((i = Y(i)), (s = Y(s))), !ht(t) && we(i) && !we(s)))
                return a ? !1 : ((i.value = s), !0);
        }
        const o = ht(t) && fs(n) ? Number(n) < t.length : pn(t, n),
            l = Reflect.set(t, n, s, r);
        return t === Y(r) && (o ? Tt(s, i) && Ve(t, 'set', n, s) : Ve(t, 'add', n, s)), l;
    }
    deleteProperty(t, n) {
        const s = pn(t, n);
        t[n];
        const r = Reflect.deleteProperty(t, n);
        return r && s && Ve(t, 'delete', n, void 0), r;
    }
    has(t, n) {
        const s = Reflect.has(t, n);
        return (!bn(n) || !Fr.has(n)) && xe(t, 'has', n), s;
    }
    ownKeys(t) {
        return xe(t, 'iterate', ht(t) ? 'length' : mt), Reflect.ownKeys(t);
    }
}
class Gi extends Cr {
    constructor(t = !1) {
        super(!0, t);
    }
    set(t, n) {
        return !0;
    }
    deleteProperty(t, n) {
        return !0;
    }
}
const Ki = new $r(),
    qi = new Gi(),
    Wi = new $r(!0),
    gs = (e) => e,
    xn = (e) => Reflect.getPrototypeOf(e);
function en(e, t, n = !1, s = !1) {
    e = e.__v_raw;
    const r = Y(e),
        i = Y(t);
    n || (Tt(t, i) && xe(r, 'get', t), xe(r, 'get', i));
    const {has: o} = xn(r),
        l = s ? gs : n ? bs : zt;
    if (o.call(r, t)) return l(e.get(t));
    if (o.call(r, i)) return l(e.get(i));
    e !== r && e.get(t);
}
function tn(e, t = !1) {
    const n = this.__v_raw,
        s = Y(n),
        r = Y(e);
    return (
        t || (Tt(e, r) && xe(s, 'has', e), xe(s, 'has', r)),
        e === r ? n.has(e) : n.has(e) || n.has(r)
    );
}
function nn(e, t = !1) {
    return (e = e.__v_raw), !t && xe(Y(e), 'iterate', mt), Reflect.get(e, 'size', e);
}
function js(e) {
    e = Y(e);
    const t = Y(this);
    return xn(t).has.call(t, e) || (t.add(e), Ve(t, 'add', e, e)), this;
}
function Hs(e, t) {
    t = Y(t);
    const n = Y(this),
        {has: s, get: r} = xn(n);
    let i = s.call(n, e);
    i || ((e = Y(e)), (i = s.call(n, e)));
    const o = r.call(n, e);
    return n.set(e, t), i ? Tt(t, o) && Ve(n, 'set', e, t) : Ve(n, 'add', e, t), this;
}
function Bs(e) {
    const t = Y(this),
        {has: n, get: s} = xn(t);
    let r = n.call(t, e);
    r || ((e = Y(e)), (r = n.call(t, e))), s && s.call(t, e);
    const i = t.delete(e);
    return r && Ve(t, 'delete', e, void 0), i;
}
function Us() {
    const e = Y(this),
        t = e.size !== 0,
        n = e.clear();
    return t && Ve(e, 'clear', void 0, void 0), n;
}
function sn(e, t) {
    return function (s, r) {
        const i = this,
            o = i.__v_raw,
            l = Y(o),
            a = t ? gs : e ? bs : zt;
        return !e && xe(l, 'iterate', mt), o.forEach((d, f) => s.call(r, a(d), a(f), i));
    };
}
function rn(e, t, n) {
    return function (...s) {
        const r = this.__v_raw,
            i = Y(r),
            o = an(i),
            l = e === 'entries' || (e === Symbol.iterator && o),
            a = e === 'keys' && o,
            d = r[e](...s),
            f = n ? gs : t ? bs : zt;
        return (
            !t && xe(i, 'iterate', a ? qn : mt),
            {
                next() {
                    const {value: h, done: b} = d.next();
                    return b
                        ? {value: h, done: b}
                        : {value: l ? [f(h[0]), f(h[1])] : f(h), done: b};
                },
                [Symbol.iterator]() {
                    return this;
                },
            }
        );
    };
}
function Ke(e) {
    return function (...t) {
        return e === 'delete' ? !1 : e === 'clear' ? void 0 : this;
    };
}
function Yi() {
    const e = {
            get(i) {
                return en(this, i);
            },
            get size() {
                return nn(this);
            },
            has: tn,
            add: js,
            set: Hs,
            delete: Bs,
            clear: Us,
            forEach: sn(!1, !1),
        },
        t = {
            get(i) {
                return en(this, i, !1, !0);
            },
            get size() {
                return nn(this);
            },
            has: tn,
            add: js,
            set: Hs,
            delete: Bs,
            clear: Us,
            forEach: sn(!1, !0),
        },
        n = {
            get(i) {
                return en(this, i, !0);
            },
            get size() {
                return nn(this, !0);
            },
            has(i) {
                return tn.call(this, i, !0);
            },
            add: Ke('add'),
            set: Ke('set'),
            delete: Ke('delete'),
            clear: Ke('clear'),
            forEach: sn(!0, !1),
        },
        s = {
            get(i) {
                return en(this, i, !0, !0);
            },
            get size() {
                return nn(this, !0);
            },
            has(i) {
                return tn.call(this, i, !0);
            },
            add: Ke('add'),
            set: Ke('set'),
            delete: Ke('delete'),
            clear: Ke('clear'),
            forEach: sn(!0, !0),
        };
    return (
        ['keys', 'values', 'entries', Symbol.iterator].forEach((i) => {
            (e[i] = rn(i, !1, !1)),
                (n[i] = rn(i, !0, !1)),
                (t[i] = rn(i, !1, !0)),
                (s[i] = rn(i, !0, !0));
        }),
        [e, n, t, s]
    );
}
const [Xi, Zi, Ji, Qi] = Yi();
function ms(e, t) {
    const n = t ? (e ? Qi : Ji) : e ? Zi : Xi;
    return (s, r, i) =>
        r === '__v_isReactive'
            ? !e
            : r === '__v_isReadonly'
              ? e
              : r === '__v_raw'
                ? s
                : Reflect.get(pn(n, r) && r in s ? n : s, r, i);
}
const eo = {get: ms(!1, !1)},
    to = {get: ms(!1, !0)},
    no = {get: ms(!0, !1)},
    Tr = new WeakMap(),
    kr = new WeakMap(),
    Pr = new WeakMap(),
    so = new WeakMap();
function ro(e) {
    switch (e) {
        case 'Object':
        case 'Array':
            return 1;
        case 'Map':
        case 'Set':
        case 'WeakMap':
        case 'WeakSet':
            return 2;
        default:
            return 0;
    }
}
function io(e) {
    return e.__v_skip || !Object.isExtensible(e) ? 0 : ro(Mi(e));
}
function vs(e) {
    return Ft(e) ? e : ys(e, !1, Ki, eo, Tr);
}
function oo(e) {
    return ys(e, !1, Wi, to, kr);
}
function Or(e) {
    return ys(e, !0, qi, no, Pr);
}
function ys(e, t, n, s, r) {
    if (!_n(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
    const i = r.get(e);
    if (i) return i;
    const o = io(e);
    if (o === 0) return e;
    const l = new Proxy(e, o === 2 ? s : n);
    return r.set(e, l), l;
}
function At(e) {
    return Ft(e) ? At(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Ft(e) {
    return !!(e && e.__v_isReadonly);
}
function hn(e) {
    return !!(e && e.__v_isShallow);
}
function Ir(e) {
    return At(e) || Ft(e);
}
function Y(e) {
    const t = e && e.__v_raw;
    return t ? Y(t) : e;
}
function Lr(e) {
    return Object.isExtensible(e) && Ni(e, '__v_skip', !0), e;
}
const zt = (e) => (_n(e) ? vs(e) : e),
    bs = (e) => (_n(e) ? Or(e) : e);
class Rr {
    constructor(t, n, s, r) {
        (this._setter = n),
            (this.dep = void 0),
            (this.__v_isRef = !0),
            (this.__v_isReadonly = !1),
            (this.effect = new ds(
                () => t(this._value),
                () => cn(this, this.effect._dirtyLevel === 2 ? 2 : 3)
            )),
            (this.effect.computed = this),
            (this.effect.active = this._cacheable = !r),
            (this.__v_isReadonly = s);
    }
    get value() {
        const t = Y(this);
        return (
            (!t._cacheable || t.effect.dirty) &&
                Tt(t._value, (t._value = t.effect.run())) &&
                cn(t, 4),
            Mr(t),
            t.effect._dirtyLevel >= 2 && cn(t, 2),
            t._value
        );
    }
    set value(t) {
        this._setter(t);
    }
    get _dirty() {
        return this.effect.dirty;
    }
    set _dirty(t) {
        this.effect.dirty = t;
    }
}
function lo(e, t, n = !1) {
    let s, r;
    const i = Ii(e);
    return i ? ((s = e), (r = Pi)) : ((s = e.get), (r = e.set)), new Rr(s, r, i || !r, n);
}
function Mr(e) {
    var t;
    Qe &&
        gt &&
        ((e = Y(e)),
        Ar(
            gt,
            (t = e.dep) != null
                ? t
                : (e.dep = Sr(() => (e.dep = void 0), e instanceof Rr ? e : void 0))
        ));
}
function cn(e, t = 4, n) {
    e = Y(e);
    const s = e.dep;
    s && Er(s, t);
}
function we(e) {
    return !!(e && e.__v_isRef === !0);
}
function J(e) {
    return ao(e, !1);
}
function ao(e, t) {
    return we(e) ? e : new co(e, t);
}
class co {
    constructor(t, n) {
        (this.__v_isShallow = n),
            (this.dep = void 0),
            (this.__v_isRef = !0),
            (this._rawValue = n ? t : Y(t)),
            (this._value = n ? t : zt(t));
    }
    get value() {
        return Mr(this), this._value;
    }
    set value(t) {
        const n = this.__v_isShallow || hn(t) || Ft(t);
        (t = n ? t : Y(t)),
            Tt(t, this._rawValue) &&
                ((this._rawValue = t), (this._value = n ? t : zt(t)), cn(this, 4));
    }
}
function nt(e) {
    return we(e) ? e.value : e;
}
const uo = {
    get: (e, t, n) => nt(Reflect.get(e, t, n)),
    set: (e, t, n, s) => {
        const r = e[t];
        return we(r) && !we(n) ? ((r.value = n), !0) : Reflect.set(e, t, n, s);
    },
};
function Nr(e) {
    return At(e) ? e : new Proxy(e, uo);
}
/**
 * @vue/shared v3.4.19
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function fo(e, t) {
    const n = new Set(e.split(','));
    return (s) => n.has(s);
}
const ne = {},
    Et = [],
    Oe = () => {},
    po = () => !1,
    _s = (e) =>
        e.charCodeAt(0) === 111 &&
        e.charCodeAt(1) === 110 &&
        (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
    Dr = (e) => e.startsWith('onUpdate:'),
    me = Object.assign,
    xs = (e, t) => {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
    },
    ho = Object.prototype.hasOwnProperty,
    X = (e, t) => ho.call(e, t),
    K = Array.isArray,
    jr = (e) => ws(e) === '[object Map]',
    Hr = (e) => ws(e) === '[object Set]',
    V = (e) => typeof e == 'function',
    Ae = (e) => typeof e == 'string',
    Br = (e) => typeof e == 'symbol',
    le = (e) => e !== null && typeof e == 'object',
    Ur = (e) => (le(e) || V(e)) && V(e.then) && V(e.catch),
    zr = Object.prototype.toString,
    ws = (e) => zr.call(e),
    Vr = (e) => ws(e) === '[object Object]',
    Nt = fo(
        ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted'
    ),
    wn = (e) => {
        const t = Object.create(null);
        return (n) => t[n] || (t[n] = e(n));
    },
    go = /-(\w)/g,
    Ct = wn((e) => e.replace(go, (t, n) => (n ? n.toUpperCase() : ''))),
    mo = /\B([A-Z])/g,
    An = wn((e) => e.replace(mo, '-$1').toLowerCase()),
    vo = wn((e) => e.charAt(0).toUpperCase() + e.slice(1)),
    Ln = wn((e) => (e ? `on${vo(e)}` : '')),
    zs = (e, t) => !Object.is(e, t),
    Rn = (e, t) => {
        for (let n = 0; n < e.length; n++) e[n](t);
    },
    Wn = (e, t, n) => {
        Object.defineProperty(e, t, {configurable: !0, enumerable: !1, value: n});
    },
    yo = (e) => {
        const t = parseFloat(e);
        return isNaN(t) ? e : t;
    };
let Vs;
const Gr = () =>
    Vs ||
    (Vs =
        typeof globalThis < 'u'
            ? globalThis
            : typeof self < 'u'
              ? self
              : typeof window < 'u'
                ? window
                : typeof global < 'u'
                  ? global
                  : {});
function En(e) {
    if (K(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++) {
            const s = e[n],
                r = Ae(s) ? wo(s) : En(s);
            if (r) for (const i in r) t[i] = r[i];
        }
        return t;
    } else if (Ae(e) || le(e)) return e;
}
const bo = /;(?![^(]*\))/g,
    _o = /:([^]+)/,
    xo = /\/\*[^]*?\*\//g;
function wo(e) {
    const t = {};
    return (
        e
            .replace(xo, '')
            .split(bo)
            .forEach((n) => {
                if (n) {
                    const s = n.split(_o);
                    s.length > 1 && (t[s[0].trim()] = s[1].trim());
                }
            }),
        t
    );
}
function je(e) {
    let t = '';
    if (Ae(e)) t = e;
    else if (K(e))
        for (let n = 0; n < e.length; n++) {
            const s = je(e[n]);
            s && (t += s + ' ');
        }
    else if (le(e)) for (const n in e) e[n] && (t += n + ' ');
    return t.trim();
}
const Se = (e) =>
        Ae(e)
            ? e
            : e == null
              ? ''
              : K(e) || (le(e) && (e.toString === zr || !V(e.toString)))
                ? JSON.stringify(e, Kr, 2)
                : String(e),
    Kr = (e, t) =>
        t && t.__v_isRef
            ? Kr(e, t.value)
            : jr(t)
              ? {
                    [`Map(${t.size})`]: [...t.entries()].reduce(
                        (n, [s, r], i) => ((n[Mn(s, i) + ' =>'] = r), n),
                        {}
                    ),
                }
              : Hr(t)
                ? {[`Set(${t.size})`]: [...t.values()].map((n) => Mn(n))}
                : Br(t)
                  ? Mn(t)
                  : le(t) && !K(t) && !Vr(t)
                    ? String(t)
                    : t,
    Mn = (e, t = '') => {
        var n;
        return Br(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
    };
/**
 * @vue/runtime-core v3.4.19
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function et(e, t, n, s) {
    try {
        return s ? e(...s) : e();
    } catch (r) {
        Sn(r, t, n);
    }
}
function $e(e, t, n, s) {
    if (V(e)) {
        const i = et(e, t, n, s);
        return (
            i &&
                Ur(i) &&
                i.catch((o) => {
                    Sn(o, t, n);
                }),
            i
        );
    }
    const r = [];
    for (let i = 0; i < e.length; i++) r.push($e(e[i], t, n, s));
    return r;
}
function Sn(e, t, n, s = !0) {
    const r = t ? t.vnode : null;
    if (t) {
        let i = t.parent;
        const o = t.proxy,
            l = `https://vuejs.org/error-reference/#runtime-${n}`;
        for (; i; ) {
            const d = i.ec;
            if (d) {
                for (let f = 0; f < d.length; f++) if (d[f](e, o, l) === !1) return;
            }
            i = i.parent;
        }
        const a = t.appContext.config.errorHandler;
        if (a) {
            et(a, null, 10, [e, o, l]);
            return;
        }
    }
    Ao(e, n, r, s);
}
function Ao(e, t, n, s = !0) {
    console.error(e);
}
let Vt = !1,
    Yn = !1;
const he = [];
let De = 0;
const St = [];
let Ye = null,
    ft = 0;
const qr = Promise.resolve();
let As = null;
function Xn(e) {
    const t = As || qr;
    return e ? t.then(this ? e.bind(this) : e) : t;
}
function Eo(e) {
    let t = De + 1,
        n = he.length;
    for (; t < n; ) {
        const s = (t + n) >>> 1,
            r = he[s],
            i = Gt(r);
        i < e || (i === e && r.pre) ? (t = s + 1) : (n = s);
    }
    return t;
}
function Es(e) {
    (!he.length || !he.includes(e, Vt && e.allowRecurse ? De + 1 : De)) &&
        (e.id == null ? he.push(e) : he.splice(Eo(e.id), 0, e), Wr());
}
function Wr() {
    !Vt && !Yn && ((Yn = !0), (As = qr.then(Xr)));
}
function So(e) {
    const t = he.indexOf(e);
    t > De && he.splice(t, 1);
}
function Fo(e) {
    K(e) ? St.push(...e) : (!Ye || !Ye.includes(e, e.allowRecurse ? ft + 1 : ft)) && St.push(e),
        Wr();
}
function Gs(e, t, n = Vt ? De + 1 : 0) {
    for (; n < he.length; n++) {
        const s = he[n];
        if (s && s.pre) {
            if (e && s.id !== e.uid) continue;
            he.splice(n, 1), n--, s();
        }
    }
}
function Yr(e) {
    if (St.length) {
        const t = [...new Set(St)].sort((n, s) => Gt(n) - Gt(s));
        if (((St.length = 0), Ye)) {
            Ye.push(...t);
            return;
        }
        for (Ye = t, ft = 0; ft < Ye.length; ft++) Ye[ft]();
        (Ye = null), (ft = 0);
    }
}
const Gt = (e) => (e.id == null ? 1 / 0 : e.id),
    Co = (e, t) => {
        const n = Gt(e) - Gt(t);
        if (n === 0) {
            if (e.pre && !t.pre) return -1;
            if (t.pre && !e.pre) return 1;
        }
        return n;
    };
function Xr(e) {
    (Yn = !1), (Vt = !0), he.sort(Co);
    try {
        for (De = 0; De < he.length; De++) {
            const t = he[De];
            t && t.active !== !1 && et(t, null, 14);
        }
    } finally {
        (De = 0), (he.length = 0), Yr(), (Vt = !1), (As = null), (he.length || St.length) && Xr();
    }
}
function $o(e, t, ...n) {
    if (e.isUnmounted) return;
    const s = e.vnode.props || ne;
    let r = n;
    const i = t.startsWith('update:'),
        o = i && t.slice(7);
    if (o && o in s) {
        const f = `${o === 'modelValue' ? 'model' : o}Modifiers`,
            {number: h, trim: b} = s[f] || ne;
        b && (r = n.map((R) => (Ae(R) ? R.trim() : R))), h && (r = n.map(yo));
    }
    let l,
        a = s[(l = Ln(t))] || s[(l = Ln(Ct(t)))];
    !a && i && (a = s[(l = Ln(An(t)))]), a && $e(a, e, 6, r);
    const d = s[l + 'Once'];
    if (d) {
        if (!e.emitted) e.emitted = {};
        else if (e.emitted[l]) return;
        (e.emitted[l] = !0), $e(d, e, 6, r);
    }
}
function Zr(e, t, n = !1) {
    const s = t.emitsCache,
        r = s.get(e);
    if (r !== void 0) return r;
    const i = e.emits;
    let o = {},
        l = !1;
    if (!V(e)) {
        const a = (d) => {
            const f = Zr(d, t, !0);
            f && ((l = !0), me(o, f));
        };
        !n && t.mixins.length && t.mixins.forEach(a),
            e.extends && a(e.extends),
            e.mixins && e.mixins.forEach(a);
    }
    return !i && !l
        ? (le(e) && s.set(e, null), null)
        : (K(i) ? i.forEach((a) => (o[a] = null)) : me(o, i), le(e) && s.set(e, o), o);
}
function Fn(e, t) {
    return !e || !_s(t)
        ? !1
        : ((t = t.slice(2).replace(/Once$/, '')),
          X(e, t[0].toLowerCase() + t.slice(1)) || X(e, An(t)) || X(e, t));
}
let fe = null,
    Jr = null;
function gn(e) {
    const t = fe;
    return (fe = e), (Jr = (e && e.type.__scopeId) || null), t;
}
function ae(e, t = fe, n) {
    if (!t || e._n) return e;
    const s = (...r) => {
        s._d && nr(-1);
        const i = gn(t);
        let o;
        try {
            o = e(...r);
        } finally {
            gn(i), s._d && nr(1);
        }
        return o;
    };
    return (s._n = !0), (s._c = !0), (s._d = !0), s;
}
function Nn(e) {
    const {
        type: t,
        vnode: n,
        proxy: s,
        withProxy: r,
        props: i,
        propsOptions: [o],
        slots: l,
        attrs: a,
        emit: d,
        render: f,
        renderCache: h,
        data: b,
        setupState: R,
        ctx: z,
        inheritAttrs: I,
    } = e;
    let N, H;
    const g = gn(e);
    try {
        if (n.shapeFlag & 4) {
            const y = r || s,
                A = y;
            (N = Ne(f.call(A, y, h, i, R, b, z))), (H = a);
        } else {
            const y = t;
            (N = Ne(y.length > 1 ? y(i, {attrs: a, slots: l, emit: d}) : y(i, null))),
                (H = t.props ? a : To(a));
        }
    } catch (y) {
        (Ut.length = 0), Sn(y, e, 1), (N = q(He));
    }
    let p = N;
    if (H && I !== !1) {
        const y = Object.keys(H),
            {shapeFlag: A} = p;
        y.length && A & 7 && (o && y.some(Dr) && (H = ko(H, o)), (p = tt(p, H)));
    }
    return (
        n.dirs && ((p = tt(p)), (p.dirs = p.dirs ? p.dirs.concat(n.dirs) : n.dirs)),
        n.transition && (p.transition = n.transition),
        (N = p),
        gn(g),
        N
    );
}
const To = (e) => {
        let t;
        for (const n in e) (n === 'class' || n === 'style' || _s(n)) && ((t || (t = {}))[n] = e[n]);
        return t;
    },
    ko = (e, t) => {
        const n = {};
        for (const s in e) (!Dr(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
        return n;
    };
function Po(e, t, n) {
    const {props: s, children: r, component: i} = e,
        {props: o, children: l, patchFlag: a} = t,
        d = i.emitsOptions;
    if (t.dirs || t.transition) return !0;
    if (n && a >= 0) {
        if (a & 1024) return !0;
        if (a & 16) return s ? Ks(s, o, d) : !!o;
        if (a & 8) {
            const f = t.dynamicProps;
            for (let h = 0; h < f.length; h++) {
                const b = f[h];
                if (o[b] !== s[b] && !Fn(d, b)) return !0;
            }
        }
    } else
        return (r || l) && (!l || !l.$stable)
            ? !0
            : s === o
              ? !1
              : s
                ? o
                    ? Ks(s, o, d)
                    : !0
                : !!o;
    return !1;
}
function Ks(e, t, n) {
    const s = Object.keys(t);
    if (s.length !== Object.keys(e).length) return !0;
    for (let r = 0; r < s.length; r++) {
        const i = s[r];
        if (t[i] !== e[i] && !Fn(n, i)) return !0;
    }
    return !1;
}
function Oo({vnode: e, parent: t}, n) {
    for (; t; ) {
        const s = t.subTree;
        if ((s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e))
            ((e = t.vnode).el = n), (t = t.parent);
        else break;
    }
}
const Io = Symbol.for('v-ndc'),
    Lo = (e) => e.__isSuspense;
function Ro(e, t) {
    t && t.pendingBranch ? (K(e) ? t.effects.push(...e) : t.effects.push(e)) : Fo(e);
}
const Mo = Symbol.for('v-scx'),
    No = () => fn(Mo);
function Do(e, t) {
    return Ss(e, null, {flush: 'post'});
}
const on = {};
function un(e, t, n) {
    return Ss(e, t, n);
}
function Ss(e, t, {immediate: n, deep: s, flush: r, once: i, onTrack: o, onTrigger: l} = ne) {
    if (t && i) {
        const v = t;
        t = (...P) => {
            v(...P), A();
        };
    }
    const a = ge,
        d = (v) => (s === !0 ? v : pt(v, s === !1 ? 1 : void 0));
    let f,
        h = !1,
        b = !1;
    if (
        (we(e)
            ? ((f = () => e.value), (h = hn(e)))
            : At(e)
              ? ((f = () => d(e)), (h = !0))
              : K(e)
                ? ((b = !0),
                  (h = e.some((v) => At(v) || hn(v))),
                  (f = () =>
                      e.map((v) => {
                          if (we(v)) return v.value;
                          if (At(v)) return d(v);
                          if (V(v)) return et(v, a, 2);
                      })))
                : V(e)
                  ? t
                      ? (f = () => et(e, a, 2))
                      : (f = () => (R && R(), $e(e, a, 3, [z])))
                  : (f = Oe),
        t && s)
    ) {
        const v = f;
        f = () => pt(v());
    }
    let R,
        z = (v) => {
            R = p.onStop = () => {
                et(v, a, 4), (R = p.onStop = void 0);
            };
        },
        I;
    if (Pn)
        if (((z = Oe), t ? n && $e(t, a, 3, [f(), b ? [] : void 0, z]) : f(), r === 'sync')) {
            const v = No();
            I = v.__watcherHandles || (v.__watcherHandles = []);
        } else return Oe;
    let N = b ? new Array(e.length).fill(on) : on;
    const H = () => {
        if (!(!p.active || !p.dirty))
            if (t) {
                const v = p.run();
                (s || h || (b ? v.some((P, $) => zs(P, N[$])) : zs(v, N))) &&
                    (R && R(),
                    $e(t, a, 3, [v, N === on ? void 0 : b && N[0] === on ? [] : N, z]),
                    (N = v));
            } else p.run();
    };
    H.allowRecurse = !!t;
    let g;
    r === 'sync'
        ? (g = H)
        : r === 'post'
          ? (g = () => _e(H, a && a.suspense))
          : ((H.pre = !0), a && (H.id = a.uid), (g = () => Es(H)));
    const p = new ds(f, Oe, g),
        y = Hi(),
        A = () => {
            p.stop(), y && xs(y.effects, p);
        };
    return (
        t ? (n ? H() : (N = p.run())) : r === 'post' ? _e(p.run.bind(p), a && a.suspense) : p.run(),
        I && I.push(A),
        A
    );
}
function jo(e, t, n) {
    const s = this.proxy,
        r = Ae(e) ? (e.includes('.') ? Qr(s, e) : () => s[e]) : e.bind(s, s);
    let i;
    V(t) ? (i = t) : ((i = t.handler), (n = t));
    const o = Zt(this),
        l = Ss(r, i.bind(s), n);
    return o(), l;
}
function Qr(e, t) {
    const n = t.split('.');
    return () => {
        let s = e;
        for (let r = 0; r < n.length && s; r++) s = s[n[r]];
        return s;
    };
}
function pt(e, t, n = 0, s) {
    if (!le(e) || e.__v_skip) return e;
    if (t && t > 0) {
        if (n >= t) return e;
        n++;
    }
    if (((s = s || new Set()), s.has(e))) return e;
    if ((s.add(e), we(e))) pt(e.value, t, n, s);
    else if (K(e)) for (let r = 0; r < e.length; r++) pt(e[r], t, n, s);
    else if (Hr(e) || jr(e))
        e.forEach((r) => {
            pt(r, t, n, s);
        });
    else if (Vr(e)) for (const r in e) pt(e[r], t, n, s);
    return e;
}
function ei(e, t) {
    if (fe === null) return e;
    const n = On(fe) || fe.proxy,
        s = e.dirs || (e.dirs = []);
    for (let r = 0; r < t.length; r++) {
        let [i, o, l, a = ne] = t[r];
        i &&
            (V(i) && (i = {mounted: i, updated: i}),
            i.deep && pt(o),
            s.push({dir: i, instance: n, value: o, oldValue: void 0, arg: l, modifiers: a}));
    }
    return e;
}
function lt(e, t, n, s) {
    const r = e.dirs,
        i = t && t.dirs;
    for (let o = 0; o < r.length; o++) {
        const l = r[o];
        i && (l.oldValue = i[o].value);
        let a = l.dir[s];
        a && (yt(), $e(a, n, 8, [e.el, l, e, t]), bt());
    }
}
const Xe = Symbol('_leaveCb'),
    ln = Symbol('_enterCb');
function Ho() {
    const e = {isMounted: !1, isLeaving: !1, isUnmounting: !1, leavingVNodes: new Map()};
    return (
        $t(() => {
            e.isMounted = !0;
        }),
        ii(() => {
            e.isUnmounting = !0;
        }),
        e
    );
}
const Ce = [Function, Array],
    ti = {
        mode: String,
        appear: Boolean,
        persisted: Boolean,
        onBeforeEnter: Ce,
        onEnter: Ce,
        onAfterEnter: Ce,
        onEnterCancelled: Ce,
        onBeforeLeave: Ce,
        onLeave: Ce,
        onAfterLeave: Ce,
        onLeaveCancelled: Ce,
        onBeforeAppear: Ce,
        onAppear: Ce,
        onAfterAppear: Ce,
        onAppearCancelled: Ce,
    },
    Bo = {
        name: 'BaseTransition',
        props: ti,
        setup(e, {slots: t}) {
            const n = ks(),
                s = Ho();
            let r;
            return () => {
                const i = t.default && si(t.default(), !0);
                if (!i || !i.length) return;
                let o = i[0];
                if (i.length > 1) {
                    for (const I of i)
                        if (I.type !== He) {
                            o = I;
                            break;
                        }
                }
                const l = Y(e),
                    {mode: a} = l;
                if (s.isLeaving) return Dn(o);
                const d = qs(o);
                if (!d) return Dn(o);
                const f = Zn(d, l, s, n);
                Jn(d, f);
                const h = n.subTree,
                    b = h && qs(h);
                let R = !1;
                const {getTransitionKey: z} = d.type;
                if (z) {
                    const I = z();
                    r === void 0 ? (r = I) : I !== r && ((r = I), (R = !0));
                }
                if (b && b.type !== He && (!dt(d, b) || R)) {
                    const I = Zn(b, l, s, n);
                    if ((Jn(b, I), a === 'out-in'))
                        return (
                            (s.isLeaving = !0),
                            (I.afterLeave = () => {
                                (s.isLeaving = !1),
                                    n.update.active !== !1 && ((n.effect.dirty = !0), n.update());
                            }),
                            Dn(o)
                        );
                    a === 'in-out' &&
                        d.type !== He &&
                        (I.delayLeave = (N, H, g) => {
                            const p = ni(s, b);
                            (p[String(b.key)] = b),
                                (N[Xe] = () => {
                                    H(), (N[Xe] = void 0), delete f.delayedLeave;
                                }),
                                (f.delayedLeave = g);
                        });
                }
                return o;
            };
        },
    },
    Uo = Bo;
function ni(e, t) {
    const {leavingVNodes: n} = e;
    let s = n.get(t.type);
    return s || ((s = Object.create(null)), n.set(t.type, s)), s;
}
function Zn(e, t, n, s) {
    const {
            appear: r,
            mode: i,
            persisted: o = !1,
            onBeforeEnter: l,
            onEnter: a,
            onAfterEnter: d,
            onEnterCancelled: f,
            onBeforeLeave: h,
            onLeave: b,
            onAfterLeave: R,
            onLeaveCancelled: z,
            onBeforeAppear: I,
            onAppear: N,
            onAfterAppear: H,
            onAppearCancelled: g,
        } = t,
        p = String(e.key),
        y = ni(n, e),
        A = ($, T) => {
            $ && $e($, s, 9, T);
        },
        v = ($, T) => {
            const j = T[1];
            A($, T), K($) ? $.every((W) => W.length <= 1) && j() : $.length <= 1 && j();
        },
        P = {
            mode: i,
            persisted: o,
            beforeEnter($) {
                let T = l;
                if (!n.isMounted)
                    if (r) T = I || l;
                    else return;
                $[Xe] && $[Xe](!0);
                const j = y[p];
                j && dt(e, j) && j.el[Xe] && j.el[Xe](), A(T, [$]);
            },
            enter($) {
                let T = a,
                    j = d,
                    W = f;
                if (!n.isMounted)
                    if (r) (T = N || a), (j = H || d), (W = g || f);
                    else return;
                let L = !1;
                const Q = ($[ln] = (pe) => {
                    L ||
                        ((L = !0),
                        pe ? A(W, [$]) : A(j, [$]),
                        P.delayedLeave && P.delayedLeave(),
                        ($[ln] = void 0));
                });
                T ? v(T, [$, Q]) : Q();
            },
            leave($, T) {
                const j = String(e.key);
                if (($[ln] && $[ln](!0), n.isUnmounting)) return T();
                A(h, [$]);
                let W = !1;
                const L = ($[Xe] = (Q) => {
                    W ||
                        ((W = !0),
                        T(),
                        Q ? A(z, [$]) : A(R, [$]),
                        ($[Xe] = void 0),
                        y[j] === e && delete y[j]);
                });
                (y[j] = e), b ? v(b, [$, L]) : L();
            },
            clone($) {
                return Zn($, t, n, s);
            },
        };
    return P;
}
function Dn(e) {
    if (Cn(e)) return (e = tt(e)), (e.children = null), e;
}
function qs(e) {
    return Cn(e) ? (e.children ? e.children[0] : void 0) : e;
}
function Jn(e, t) {
    e.shapeFlag & 6 && e.component
        ? Jn(e.component.subTree, t)
        : e.shapeFlag & 128
          ? ((e.ssContent.transition = t.clone(e.ssContent)),
            (e.ssFallback.transition = t.clone(e.ssFallback)))
          : (e.transition = t);
}
function si(e, t = !1, n) {
    let s = [],
        r = 0;
    for (let i = 0; i < e.length; i++) {
        let o = e[i];
        const l = n == null ? o.key : String(n) + String(o.key != null ? o.key : i);
        o.type === re
            ? (o.patchFlag & 128 && r++, (s = s.concat(si(o.children, t, l))))
            : (t || o.type !== He) && s.push(l != null ? tt(o, {key: l}) : o);
    }
    if (r > 1) for (let i = 0; i < s.length; i++) s[i].patchFlag = -2;
    return s;
}
/*! #__NO_SIDE_EFFECTS__ */ function Be(e, t) {
    return V(e) ? me({name: e.name}, t, {setup: e}) : e;
}
const Dt = (e) => !!e.type.__asyncLoader,
    Cn = (e) => e.type.__isKeepAlive;
function zo(e, t) {
    ri(e, 'a', t);
}
function Vo(e, t) {
    ri(e, 'da', t);
}
function ri(e, t, n = ge) {
    const s =
        e.__wdc ||
        (e.__wdc = () => {
            let r = n;
            for (; r; ) {
                if (r.isDeactivated) return;
                r = r.parent;
            }
            return e();
        });
    if (($n(t, s, n), n)) {
        let r = n.parent;
        for (; r && r.parent; ) Cn(r.parent.vnode) && Go(s, t, n, r), (r = r.parent);
    }
}
function Go(e, t, n, s) {
    const r = $n(t, e, s, !0);
    Xt(() => {
        xs(s[t], r);
    }, n);
}
function $n(e, t, n = ge, s = !1) {
    if (n) {
        const r = n[e] || (n[e] = []),
            i =
                t.__weh ||
                (t.__weh = (...o) => {
                    if (n.isUnmounted) return;
                    yt();
                    const l = Zt(n),
                        a = $e(t, n, e, o);
                    return l(), bt(), a;
                });
        return s ? r.unshift(i) : r.push(i), i;
    }
}
const Ge =
        (e) =>
        (t, n = ge) =>
            (!Pn || e === 'sp') && $n(e, (...s) => t(...s), n),
    Ko = Ge('bm'),
    $t = Ge('m'),
    qo = Ge('bu'),
    Wo = Ge('u'),
    ii = Ge('bum'),
    Xt = Ge('um'),
    Yo = Ge('sp'),
    Xo = Ge('rtg'),
    Zo = Ge('rtc');
function Jo(e, t = ge) {
    $n('ec', e, t);
}
function Rt(e, t, n, s) {
    let r;
    const i = n;
    if (K(e) || Ae(e)) {
        r = new Array(e.length);
        for (let o = 0, l = e.length; o < l; o++) r[o] = t(e[o], o, void 0, i);
    } else if (typeof e == 'number') {
        r = new Array(e);
        for (let o = 0; o < e; o++) r[o] = t(o + 1, o, void 0, i);
    } else if (le(e))
        if (e[Symbol.iterator]) r = Array.from(e, (o, l) => t(o, l, void 0, i));
        else {
            const o = Object.keys(e);
            r = new Array(o.length);
            for (let l = 0, a = o.length; l < a; l++) {
                const d = o[l];
                r[l] = t(e[d], d, l, i);
            }
        }
    else r = [];
    return r;
}
function Qn(e, t, n = {}, s, r) {
    if (fe.isCE || (fe.parent && Dt(fe.parent) && fe.parent.isCE))
        return t !== 'default' && (n.name = t), q('slot', n, s);
    let i = e[t];
    i && i._c && (i._d = !1), de();
    const o = i && oi(i(n)),
        l = vi(re, {key: n.key || (o && o.key) || `_${t}`}, o || [], o && e._ === 1 ? 64 : -2);
    return l.scopeId && (l.slotScopeIds = [l.scopeId + '-s']), i && i._c && (i._d = !0), l;
}
function oi(e) {
    return e.some((t) => (vn(t) ? !(t.type === He || (t.type === re && !oi(t.children))) : !0))
        ? e
        : null;
}
const es = (e) => (e ? (bi(e) ? On(e) || e.proxy : es(e.parent)) : null),
    jt = me(Object.create(null), {
        $: (e) => e,
        $el: (e) => e.vnode.el,
        $data: (e) => e.data,
        $props: (e) => e.props,
        $attrs: (e) => e.attrs,
        $slots: (e) => e.slots,
        $refs: (e) => e.refs,
        $parent: (e) => es(e.parent),
        $root: (e) => es(e.root),
        $emit: (e) => e.emit,
        $options: (e) => Fs(e),
        $forceUpdate: (e) =>
            e.f ||
            (e.f = () => {
                (e.effect.dirty = !0), Es(e.update);
            }),
        $nextTick: (e) => e.n || (e.n = Xn.bind(e.proxy)),
        $watch: (e) => jo.bind(e),
    }),
    jn = (e, t) => e !== ne && !e.__isScriptSetup && X(e, t),
    Qo = {
        get({_: e}, t) {
            const {
                ctx: n,
                setupState: s,
                data: r,
                props: i,
                accessCache: o,
                type: l,
                appContext: a,
            } = e;
            let d;
            if (t[0] !== '$') {
                const R = o[t];
                if (R !== void 0)
                    switch (R) {
                        case 1:
                            return s[t];
                        case 2:
                            return r[t];
                        case 4:
                            return n[t];
                        case 3:
                            return i[t];
                    }
                else {
                    if (jn(s, t)) return (o[t] = 1), s[t];
                    if (r !== ne && X(r, t)) return (o[t] = 2), r[t];
                    if ((d = e.propsOptions[0]) && X(d, t)) return (o[t] = 3), i[t];
                    if (n !== ne && X(n, t)) return (o[t] = 4), n[t];
                    ts && (o[t] = 0);
                }
            }
            const f = jt[t];
            let h, b;
            if (f) return t === '$attrs' && xe(e, 'get', t), f(e);
            if ((h = l.__cssModules) && (h = h[t])) return h;
            if (n !== ne && X(n, t)) return (o[t] = 4), n[t];
            if (((b = a.config.globalProperties), X(b, t))) return b[t];
        },
        set({_: e}, t, n) {
            const {data: s, setupState: r, ctx: i} = e;
            return jn(r, t)
                ? ((r[t] = n), !0)
                : s !== ne && X(s, t)
                  ? ((s[t] = n), !0)
                  : X(e.props, t) || (t[0] === '$' && t.slice(1) in e)
                    ? !1
                    : ((i[t] = n), !0);
        },
        has(
            {_: {data: e, setupState: t, accessCache: n, ctx: s, appContext: r, propsOptions: i}},
            o
        ) {
            let l;
            return (
                !!n[o] ||
                (e !== ne && X(e, o)) ||
                jn(t, o) ||
                ((l = i[0]) && X(l, o)) ||
                X(s, o) ||
                X(jt, o) ||
                X(r.config.globalProperties, o)
            );
        },
        defineProperty(e, t, n) {
            return (
                n.get != null
                    ? (e._.accessCache[t] = 0)
                    : X(n, 'value') && this.set(e, t, n.value, null),
                Reflect.defineProperty(e, t, n)
            );
        },
    };
function el() {
    return tl().slots;
}
function tl() {
    const e = ks();
    return e.setupContext || (e.setupContext = xi(e));
}
function Ws(e) {
    return K(e) ? e.reduce((t, n) => ((t[n] = null), t), {}) : e;
}
let ts = !0;
function nl(e) {
    const t = Fs(e),
        n = e.proxy,
        s = e.ctx;
    (ts = !1), t.beforeCreate && Ys(t.beforeCreate, e, 'bc');
    const {
        data: r,
        computed: i,
        methods: o,
        watch: l,
        provide: a,
        inject: d,
        created: f,
        beforeMount: h,
        mounted: b,
        beforeUpdate: R,
        updated: z,
        activated: I,
        deactivated: N,
        beforeDestroy: H,
        beforeUnmount: g,
        destroyed: p,
        unmounted: y,
        render: A,
        renderTracked: v,
        renderTriggered: P,
        errorCaptured: $,
        serverPrefetch: T,
        expose: j,
        inheritAttrs: W,
        components: L,
        directives: Q,
        filters: pe,
    } = t;
    if ((d && sl(d, s, null), o))
        for (const ee in o) {
            const U = o[ee];
            V(U) && (s[ee] = U.bind(n));
        }
    if (r) {
        const ee = r.call(n, n);
        le(ee) && (e.data = vs(ee));
    }
    if (((ts = !0), i))
        for (const ee in i) {
            const U = i[ee],
                ce = V(U) ? U.bind(n, n) : V(U.get) ? U.get.bind(n, n) : Oe,
                Te = !V(U) && V(U.set) ? U.set.bind(n) : Oe,
                Fe = vt({get: ce, set: Te});
            Object.defineProperty(s, ee, {
                enumerable: !0,
                configurable: !0,
                get: () => Fe.value,
                set: (ie) => (Fe.value = ie),
            });
        }
    if (l) for (const ee in l) li(l[ee], s, n, ee);
    if (a) {
        const ee = V(a) ? a.call(n) : a;
        Reflect.ownKeys(ee).forEach((U) => {
            cl(U, ee[U]);
        });
    }
    f && Ys(f, e, 'c');
    function oe(ee, U) {
        K(U) ? U.forEach((ce) => ee(ce.bind(n))) : U && ee(U.bind(n));
    }
    if (
        (oe(Ko, h),
        oe($t, b),
        oe(qo, R),
        oe(Wo, z),
        oe(zo, I),
        oe(Vo, N),
        oe(Jo, $),
        oe(Zo, v),
        oe(Xo, P),
        oe(ii, g),
        oe(Xt, y),
        oe(Yo, T),
        K(j))
    )
        if (j.length) {
            const ee = e.exposed || (e.exposed = {});
            j.forEach((U) => {
                Object.defineProperty(ee, U, {get: () => n[U], set: (ce) => (n[U] = ce)});
            });
        } else e.exposed || (e.exposed = {});
    A && e.render === Oe && (e.render = A),
        W != null && (e.inheritAttrs = W),
        L && (e.components = L),
        Q && (e.directives = Q);
}
function sl(e, t, n = Oe) {
    K(e) && (e = ns(e));
    for (const s in e) {
        const r = e[s];
        let i;
        le(r)
            ? 'default' in r
                ? (i = fn(r.from || s, r.default, !0))
                : (i = fn(r.from || s))
            : (i = fn(r)),
            we(i)
                ? Object.defineProperty(t, s, {
                      enumerable: !0,
                      configurable: !0,
                      get: () => i.value,
                      set: (o) => (i.value = o),
                  })
                : (t[s] = i);
    }
}
function Ys(e, t, n) {
    $e(K(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function li(e, t, n, s) {
    const r = s.includes('.') ? Qr(n, s) : () => n[s];
    if (Ae(e)) {
        const i = t[e];
        V(i) && un(r, i);
    } else if (V(e)) un(r, e.bind(n));
    else if (le(e))
        if (K(e)) e.forEach((i) => li(i, t, n, s));
        else {
            const i = V(e.handler) ? e.handler.bind(n) : t[e.handler];
            V(i) && un(r, i, e);
        }
}
function Fs(e) {
    const t = e.type,
        {mixins: n, extends: s} = t,
        {
            mixins: r,
            optionsCache: i,
            config: {optionMergeStrategies: o},
        } = e.appContext,
        l = i.get(t);
    let a;
    return (
        l
            ? (a = l)
            : !r.length && !n && !s
              ? (a = t)
              : ((a = {}), r.length && r.forEach((d) => mn(a, d, o, !0)), mn(a, t, o)),
        le(t) && i.set(t, a),
        a
    );
}
function mn(e, t, n, s = !1) {
    const {mixins: r, extends: i} = t;
    i && mn(e, i, n, !0), r && r.forEach((o) => mn(e, o, n, !0));
    for (const o in t)
        if (!(s && o === 'expose')) {
            const l = rl[o] || (n && n[o]);
            e[o] = l ? l(e[o], t[o]) : t[o];
        }
    return e;
}
const rl = {
    data: Xs,
    props: Zs,
    emits: Zs,
    methods: Mt,
    computed: Mt,
    beforeCreate: ve,
    created: ve,
    beforeMount: ve,
    mounted: ve,
    beforeUpdate: ve,
    updated: ve,
    beforeDestroy: ve,
    beforeUnmount: ve,
    destroyed: ve,
    unmounted: ve,
    activated: ve,
    deactivated: ve,
    errorCaptured: ve,
    serverPrefetch: ve,
    components: Mt,
    directives: Mt,
    watch: ol,
    provide: Xs,
    inject: il,
};
function Xs(e, t) {
    return t
        ? e
            ? function () {
                  return me(V(e) ? e.call(this, this) : e, V(t) ? t.call(this, this) : t);
              }
            : t
        : e;
}
function il(e, t) {
    return Mt(ns(e), ns(t));
}
function ns(e) {
    if (K(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
        return t;
    }
    return e;
}
function ve(e, t) {
    return e ? [...new Set([].concat(e, t))] : t;
}
function Mt(e, t) {
    return e ? me(Object.create(null), e, t) : t;
}
function Zs(e, t) {
    return e
        ? K(e) && K(t)
            ? [...new Set([...e, ...t])]
            : me(Object.create(null), Ws(e), Ws(t ?? {}))
        : t;
}
function ol(e, t) {
    if (!e) return t;
    if (!t) return e;
    const n = me(Object.create(null), e);
    for (const s in t) n[s] = ve(e[s], t[s]);
    return n;
}
function ai() {
    return {
        app: null,
        config: {
            isNativeTag: po,
            performance: !1,
            globalProperties: {},
            optionMergeStrategies: {},
            errorHandler: void 0,
            warnHandler: void 0,
            compilerOptions: {},
        },
        mixins: [],
        components: {},
        directives: {},
        provides: Object.create(null),
        optionsCache: new WeakMap(),
        propsCache: new WeakMap(),
        emitsCache: new WeakMap(),
    };
}
let ll = 0;
function al(e, t) {
    return function (s, r = null) {
        V(s) || (s = me({}, s)), r != null && !le(r) && (r = null);
        const i = ai(),
            o = new WeakSet();
        let l = !1;
        const a = (i.app = {
            _uid: ll++,
            _component: s,
            _props: r,
            _container: null,
            _context: i,
            _instance: null,
            version: Ol,
            get config() {
                return i.config;
            },
            set config(d) {},
            use(d, ...f) {
                return (
                    o.has(d) ||
                        (d && V(d.install)
                            ? (o.add(d), d.install(a, ...f))
                            : V(d) && (o.add(d), d(a, ...f))),
                    a
                );
            },
            mixin(d) {
                return i.mixins.includes(d) || i.mixins.push(d), a;
            },
            component(d, f) {
                return f ? ((i.components[d] = f), a) : i.components[d];
            },
            directive(d, f) {
                return f ? ((i.directives[d] = f), a) : i.directives[d];
            },
            mount(d, f, h) {
                if (!l) {
                    const b = q(s, r);
                    return (
                        (b.appContext = i),
                        h === !0 ? (h = 'svg') : h === !1 && (h = void 0),
                        f && t ? t(b, d) : e(b, d, h),
                        (l = !0),
                        (a._container = d),
                        (d.__vue_app__ = a),
                        On(b.component) || b.component.proxy
                    );
                }
            },
            unmount() {
                l && (e(null, a._container), delete a._container.__vue_app__);
            },
            provide(d, f) {
                return (i.provides[d] = f), a;
            },
            runWithContext(d) {
                const f = Ht;
                Ht = a;
                try {
                    return d();
                } finally {
                    Ht = f;
                }
            },
        });
        return a;
    };
}
let Ht = null;
function cl(e, t) {
    if (ge) {
        let n = ge.provides;
        const s = ge.parent && ge.parent.provides;
        s === n && (n = ge.provides = Object.create(s)), (n[e] = t);
    }
}
function fn(e, t, n = !1) {
    const s = ge || fe;
    if (s || Ht) {
        const r = s
            ? s.parent == null
                ? s.vnode.appContext && s.vnode.appContext.provides
                : s.parent.provides
            : Ht._context.provides;
        if (r && e in r) return r[e];
        if (arguments.length > 1) return n && V(t) ? t.call(s && s.proxy) : t;
    }
}
function ul(e, t, n, s = !1) {
    const r = {},
        i = {};
    Wn(i, kn, 1), (e.propsDefaults = Object.create(null)), ci(e, t, r, i);
    for (const o in e.propsOptions[0]) o in r || (r[o] = void 0);
    n ? (e.props = s ? r : oo(r)) : e.type.props ? (e.props = r) : (e.props = i), (e.attrs = i);
}
function fl(e, t, n, s) {
    const {
            props: r,
            attrs: i,
            vnode: {patchFlag: o},
        } = e,
        l = Y(r),
        [a] = e.propsOptions;
    let d = !1;
    if ((s || o > 0) && !(o & 16)) {
        if (o & 8) {
            const f = e.vnode.dynamicProps;
            for (let h = 0; h < f.length; h++) {
                let b = f[h];
                if (Fn(e.emitsOptions, b)) continue;
                const R = t[b];
                if (a)
                    if (X(i, b)) R !== i[b] && ((i[b] = R), (d = !0));
                    else {
                        const z = Ct(b);
                        r[z] = ss(a, l, z, R, e, !1);
                    }
                else R !== i[b] && ((i[b] = R), (d = !0));
            }
        }
    } else {
        ci(e, t, r, i) && (d = !0);
        let f;
        for (const h in l)
            (!t || (!X(t, h) && ((f = An(h)) === h || !X(t, f)))) &&
                (a
                    ? n &&
                      (n[h] !== void 0 || n[f] !== void 0) &&
                      (r[h] = ss(a, l, h, void 0, e, !0))
                    : delete r[h]);
        if (i !== l) for (const h in i) (!t || !X(t, h)) && (delete i[h], (d = !0));
    }
    d && Ve(e, 'set', '$attrs');
}
function ci(e, t, n, s) {
    const [r, i] = e.propsOptions;
    let o = !1,
        l;
    if (t)
        for (let a in t) {
            if (Nt(a)) continue;
            const d = t[a];
            let f;
            r && X(r, (f = Ct(a)))
                ? !i || !i.includes(f)
                    ? (n[f] = d)
                    : ((l || (l = {}))[f] = d)
                : Fn(e.emitsOptions, a) || ((!(a in s) || d !== s[a]) && ((s[a] = d), (o = !0)));
        }
    if (i) {
        const a = Y(n),
            d = l || ne;
        for (let f = 0; f < i.length; f++) {
            const h = i[f];
            n[h] = ss(r, a, h, d[h], e, !X(d, h));
        }
    }
    return o;
}
function ss(e, t, n, s, r, i) {
    const o = e[n];
    if (o != null) {
        const l = X(o, 'default');
        if (l && s === void 0) {
            const a = o.default;
            if (o.type !== Function && !o.skipFactory && V(a)) {
                const {propsDefaults: d} = r;
                if (n in d) s = d[n];
                else {
                    const f = Zt(r);
                    (s = d[n] = a.call(null, t)), f();
                }
            } else s = a;
        }
        o[0] && (i && !l ? (s = !1) : o[1] && (s === '' || s === An(n)) && (s = !0));
    }
    return s;
}
function ui(e, t, n = !1) {
    const s = t.propsCache,
        r = s.get(e);
    if (r) return r;
    const i = e.props,
        o = {},
        l = [];
    let a = !1;
    if (!V(e)) {
        const f = (h) => {
            a = !0;
            const [b, R] = ui(h, t, !0);
            me(o, b), R && l.push(...R);
        };
        !n && t.mixins.length && t.mixins.forEach(f),
            e.extends && f(e.extends),
            e.mixins && e.mixins.forEach(f);
    }
    if (!i && !a) return le(e) && s.set(e, Et), Et;
    if (K(i))
        for (let f = 0; f < i.length; f++) {
            const h = Ct(i[f]);
            Js(h) && (o[h] = ne);
        }
    else if (i)
        for (const f in i) {
            const h = Ct(f);
            if (Js(h)) {
                const b = i[f],
                    R = (o[h] = K(b) || V(b) ? {type: b} : me({}, b));
                if (R) {
                    const z = tr(Boolean, R.type),
                        I = tr(String, R.type);
                    (R[0] = z > -1),
                        (R[1] = I < 0 || z < I),
                        (z > -1 || X(R, 'default')) && l.push(h);
                }
            }
        }
    const d = [o, l];
    return le(e) && s.set(e, d), d;
}
function Js(e) {
    return e[0] !== '$' && !Nt(e);
}
function Qs(e) {
    return e === null
        ? 'null'
        : typeof e == 'function'
          ? e.name || ''
          : (typeof e == 'object' && e.constructor && e.constructor.name) || '';
}
function er(e, t) {
    return Qs(e) === Qs(t);
}
function tr(e, t) {
    return K(t) ? t.findIndex((n) => er(n, e)) : V(t) && er(t, e) ? 0 : -1;
}
const fi = (e) => e[0] === '_' || e === '$stable',
    Cs = (e) => (K(e) ? e.map(Ne) : [Ne(e)]),
    dl = (e, t, n) => {
        if (t._n) return t;
        const s = ae((...r) => Cs(t(...r)), n);
        return (s._c = !1), s;
    },
    di = (e, t, n) => {
        const s = e._ctx;
        for (const r in e) {
            if (fi(r)) continue;
            const i = e[r];
            if (V(i)) t[r] = dl(r, i, s);
            else if (i != null) {
                const o = Cs(i);
                t[r] = () => o;
            }
        }
    },
    pi = (e, t) => {
        const n = Cs(t);
        e.slots.default = () => n;
    },
    pl = (e, t) => {
        if (e.vnode.shapeFlag & 32) {
            const n = t._;
            n ? ((e.slots = Y(t)), Wn(t, '_', n)) : di(t, (e.slots = {}));
        } else (e.slots = {}), t && pi(e, t);
        Wn(e.slots, kn, 1);
    },
    hl = (e, t, n) => {
        const {vnode: s, slots: r} = e;
        let i = !0,
            o = ne;
        if (s.shapeFlag & 32) {
            const l = t._;
            l
                ? n && l === 1
                    ? (i = !1)
                    : (me(r, t), !n && l === 1 && delete r._)
                : ((i = !t.$stable), di(t, r)),
                (o = t);
        } else t && (pi(e, t), (o = {default: 1}));
        if (i) for (const l in r) !fi(l) && o[l] == null && delete r[l];
    };
function rs(e, t, n, s, r = !1) {
    if (K(e)) {
        e.forEach((b, R) => rs(b, t && (K(t) ? t[R] : t), n, s, r));
        return;
    }
    if (Dt(s) && !r) return;
    const i = s.shapeFlag & 4 ? On(s.component) || s.component.proxy : s.el,
        o = r ? null : i,
        {i: l, r: a} = e,
        d = t && t.r,
        f = l.refs === ne ? (l.refs = {}) : l.refs,
        h = l.setupState;
    if (
        (d != null &&
            d !== a &&
            (Ae(d) ? ((f[d] = null), X(h, d) && (h[d] = null)) : we(d) && (d.value = null)),
        V(a))
    )
        et(a, l, 12, [o, f]);
    else {
        const b = Ae(a),
            R = we(a);
        if (b || R) {
            const z = () => {
                if (e.f) {
                    const I = b ? (X(h, a) ? h[a] : f[a]) : a.value;
                    r
                        ? K(I) && xs(I, i)
                        : K(I)
                          ? I.includes(i) || I.push(i)
                          : b
                            ? ((f[a] = [i]), X(h, a) && (h[a] = f[a]))
                            : ((a.value = [i]), e.k && (f[e.k] = a.value));
                } else
                    b
                        ? ((f[a] = o), X(h, a) && (h[a] = o))
                        : R && ((a.value = o), e.k && (f[e.k] = o));
            };
            o ? ((z.id = -1), _e(z, n)) : z();
        }
    }
}
const _e = Ro;
function gl(e) {
    return ml(e);
}
function ml(e, t) {
    const n = Gr();
    n.__VUE__ = !0;
    const {
            insert: s,
            remove: r,
            patchProp: i,
            createElement: o,
            createText: l,
            createComment: a,
            setText: d,
            setElementText: f,
            parentNode: h,
            nextSibling: b,
            setScopeId: R = Oe,
            insertStaticContent: z,
        } = e,
        I = (
            c,
            u,
            m,
            _ = null,
            w = null,
            F = null,
            k = void 0,
            S = null,
            C = !!u.dynamicChildren
        ) => {
            if (c === u) return;
            c && !dt(c, u) && ((_ = Ue(c)), ie(c, w, F, !0), (c = null)),
                u.patchFlag === -2 && ((C = !1), (u.dynamicChildren = null));
            const {type: E, ref: O, shapeFlag: D} = u;
            switch (E) {
                case Tn:
                    N(c, u, m, _);
                    break;
                case He:
                    H(c, u, m, _);
                    break;
                case Bt:
                    c == null && g(u, m, _, k);
                    break;
                case re:
                    L(c, u, m, _, w, F, k, S, C);
                    break;
                default:
                    D & 1
                        ? A(c, u, m, _, w, F, k, S, C)
                        : D & 6
                          ? Q(c, u, m, _, w, F, k, S, C)
                          : (D & 64 || D & 128) && E.process(c, u, m, _, w, F, k, S, C, ze);
            }
            O != null && w && rs(O, c && c.ref, F, u || c, !u);
        },
        N = (c, u, m, _) => {
            if (c == null) s((u.el = l(u.children)), m, _);
            else {
                const w = (u.el = c.el);
                u.children !== c.children && d(w, u.children);
            }
        },
        H = (c, u, m, _) => {
            c == null ? s((u.el = a(u.children || '')), m, _) : (u.el = c.el);
        },
        g = (c, u, m, _) => {
            [c.el, c.anchor] = z(c.children, u, m, _, c.el, c.anchor);
        },
        p = ({el: c, anchor: u}, m, _) => {
            let w;
            for (; c && c !== u; ) (w = b(c)), s(c, m, _), (c = w);
            s(u, m, _);
        },
        y = ({el: c, anchor: u}) => {
            let m;
            for (; c && c !== u; ) (m = b(c)), r(c), (c = m);
            r(u);
        },
        A = (c, u, m, _, w, F, k, S, C) => {
            u.type === 'svg' ? (k = 'svg') : u.type === 'math' && (k = 'mathml'),
                c == null ? v(u, m, _, w, F, k, S, C) : T(c, u, w, F, k, S, C);
        },
        v = (c, u, m, _, w, F, k, S) => {
            let C, E;
            const {props: O, shapeFlag: D, transition: M, dirs: B} = c;
            if (
                ((C = c.el = o(c.type, F, O && O.is, O)),
                D & 8 ? f(C, c.children) : D & 16 && $(c.children, C, null, _, w, Hn(c, F), k, S),
                B && lt(c, null, _, 'created'),
                P(C, c, c.scopeId, k, _),
                O)
            ) {
                for (const Z in O)
                    Z !== 'value' && !Nt(Z) && i(C, Z, null, O[Z], F, c.children, _, w, be);
                'value' in O && i(C, 'value', null, O.value, F),
                    (E = O.onVnodeBeforeMount) && Me(E, _, c);
            }
            B && lt(c, null, _, 'beforeMount');
            const G = vl(w, M);
            G && M.beforeEnter(C),
                s(C, u, m),
                ((E = O && O.onVnodeMounted) || G || B) &&
                    _e(() => {
                        E && Me(E, _, c), G && M.enter(C), B && lt(c, null, _, 'mounted');
                    }, w);
        },
        P = (c, u, m, _, w) => {
            if ((m && R(c, m), _)) for (let F = 0; F < _.length; F++) R(c, _[F]);
            if (w) {
                let F = w.subTree;
                if (u === F) {
                    const k = w.vnode;
                    P(c, k, k.scopeId, k.slotScopeIds, w.parent);
                }
            }
        },
        $ = (c, u, m, _, w, F, k, S, C = 0) => {
            for (let E = C; E < c.length; E++) {
                const O = (c[E] = S ? Ze(c[E]) : Ne(c[E]));
                I(null, O, u, m, _, w, F, k, S);
            }
        },
        T = (c, u, m, _, w, F, k) => {
            const S = (u.el = c.el);
            let {patchFlag: C, dynamicChildren: E, dirs: O} = u;
            C |= c.patchFlag & 16;
            const D = c.props || ne,
                M = u.props || ne;
            let B;
            if (
                (m && at(m, !1),
                (B = M.onVnodeBeforeUpdate) && Me(B, m, u, c),
                O && lt(u, c, m, 'beforeUpdate'),
                m && at(m, !0),
                E
                    ? j(c.dynamicChildren, E, S, m, _, Hn(u, w), F)
                    : k || U(c, u, S, null, m, _, Hn(u, w), F, !1),
                C > 0)
            ) {
                if (C & 16) W(S, u, D, M, m, _, w);
                else if (
                    (C & 2 && D.class !== M.class && i(S, 'class', null, M.class, w),
                    C & 4 && i(S, 'style', D.style, M.style, w),
                    C & 8)
                ) {
                    const G = u.dynamicProps;
                    for (let Z = 0; Z < G.length; Z++) {
                        const se = G[Z],
                            ue = D[se],
                            ke = M[se];
                        (ke !== ue || se === 'value') && i(S, se, ue, ke, w, c.children, m, _, be);
                    }
                }
                C & 1 && c.children !== u.children && f(S, u.children);
            } else !k && E == null && W(S, u, D, M, m, _, w);
            ((B = M.onVnodeUpdated) || O) &&
                _e(() => {
                    B && Me(B, m, u, c), O && lt(u, c, m, 'updated');
                }, _);
        },
        j = (c, u, m, _, w, F, k) => {
            for (let S = 0; S < u.length; S++) {
                const C = c[S],
                    E = u[S],
                    O = C.el && (C.type === re || !dt(C, E) || C.shapeFlag & 70) ? h(C.el) : m;
                I(C, E, O, null, _, w, F, k, !0);
            }
        },
        W = (c, u, m, _, w, F, k) => {
            if (m !== _) {
                if (m !== ne)
                    for (const S in m)
                        !Nt(S) && !(S in _) && i(c, S, m[S], null, k, u.children, w, F, be);
                for (const S in _) {
                    if (Nt(S)) continue;
                    const C = _[S],
                        E = m[S];
                    C !== E && S !== 'value' && i(c, S, E, C, k, u.children, w, F, be);
                }
                'value' in _ && i(c, 'value', m.value, _.value, k);
            }
        },
        L = (c, u, m, _, w, F, k, S, C) => {
            const E = (u.el = c ? c.el : l('')),
                O = (u.anchor = c ? c.anchor : l(''));
            let {patchFlag: D, dynamicChildren: M, slotScopeIds: B} = u;
            B && (S = S ? S.concat(B) : B),
                c == null
                    ? (s(E, m, _), s(O, m, _), $(u.children || [], m, O, w, F, k, S, C))
                    : D > 0 && D & 64 && M && c.dynamicChildren
                      ? (j(c.dynamicChildren, M, m, w, F, k, S),
                        (u.key != null || (w && u === w.subTree)) && hi(c, u, !0))
                      : U(c, u, m, O, w, F, k, S, C);
        },
        Q = (c, u, m, _, w, F, k, S, C) => {
            (u.slotScopeIds = S),
                c == null
                    ? u.shapeFlag & 512
                        ? w.ctx.activate(u, m, _, k, C)
                        : pe(u, m, _, w, F, k, C)
                    : st(c, u, C);
        },
        pe = (c, u, m, _, w, F, k) => {
            const S = (c.component = Fl(c, _, w));
            if ((Cn(c) && (S.ctx.renderer = ze), Cl(S), S.asyncDep)) {
                if ((w && w.registerDep(S, oe), !c.el)) {
                    const C = (S.subTree = q(He));
                    H(null, C, u, m);
                }
            } else oe(S, c, u, m, w, F, k);
        },
        st = (c, u, m) => {
            const _ = (u.component = c.component);
            if (Po(c, u, m))
                if (_.asyncDep && !_.asyncResolved) {
                    ee(_, u, m);
                    return;
                } else (_.next = u), So(_.update), (_.effect.dirty = !0), _.update();
            else (u.el = c.el), (_.vnode = u);
        },
        oe = (c, u, m, _, w, F, k) => {
            const S = () => {
                    if (c.isMounted) {
                        let {next: O, bu: D, u: M, parent: B, vnode: G} = c;
                        {
                            const _t = gi(c);
                            if (_t) {
                                O && ((O.el = G.el), ee(c, O, k)),
                                    _t.asyncDep.then(() => {
                                        c.isUnmounted || S();
                                    });
                                return;
                            }
                        }
                        let Z = O,
                            se;
                        at(c, !1),
                            O ? ((O.el = G.el), ee(c, O, k)) : (O = G),
                            D && Rn(D),
                            (se = O.props && O.props.onVnodeBeforeUpdate) && Me(se, B, O, G),
                            at(c, !0);
                        const ue = Nn(c),
                            ke = c.subTree;
                        (c.subTree = ue),
                            I(ke, ue, h(ke.el), Ue(ke), c, w, F),
                            (O.el = ue.el),
                            Z === null && Oo(c, ue.el),
                            M && _e(M, w),
                            (se = O.props && O.props.onVnodeUpdated) &&
                                _e(() => Me(se, B, O, G), w);
                    } else {
                        let O;
                        const {el: D, props: M} = u,
                            {bm: B, m: G, parent: Z} = c,
                            se = Dt(u);
                        if (
                            (at(c, !1),
                            B && Rn(B),
                            !se && (O = M && M.onVnodeBeforeMount) && Me(O, Z, u),
                            at(c, !0),
                            D && Qt)
                        ) {
                            const ue = () => {
                                (c.subTree = Nn(c)), Qt(D, c.subTree, c, w, null);
                            };
                            se ? u.type.__asyncLoader().then(() => !c.isUnmounted && ue()) : ue();
                        } else {
                            const ue = (c.subTree = Nn(c));
                            I(null, ue, m, _, c, w, F), (u.el = ue.el);
                        }
                        if ((G && _e(G, w), !se && (O = M && M.onVnodeMounted))) {
                            const ue = u;
                            _e(() => Me(O, Z, ue), w);
                        }
                        (u.shapeFlag & 256 || (Z && Dt(Z.vnode) && Z.vnode.shapeFlag & 256)) &&
                            c.a &&
                            _e(c.a, w),
                            (c.isMounted = !0),
                            (u = m = _ = null);
                    }
                },
                C = (c.effect = new ds(S, Oe, () => Es(E), c.scope)),
                E = (c.update = () => {
                    C.dirty && C.run();
                });
            (E.id = c.uid), at(c, !0), E();
        },
        ee = (c, u, m) => {
            u.component = c;
            const _ = c.vnode.props;
            (c.vnode = u),
                (c.next = null),
                fl(c, u.props, _, m),
                hl(c, u.children, m),
                yt(),
                Gs(c),
                bt();
        },
        U = (c, u, m, _, w, F, k, S, C = !1) => {
            const E = c && c.children,
                O = c ? c.shapeFlag : 0,
                D = u.children,
                {patchFlag: M, shapeFlag: B} = u;
            if (M > 0) {
                if (M & 128) {
                    Te(E, D, m, _, w, F, k, S, C);
                    return;
                } else if (M & 256) {
                    ce(E, D, m, _, w, F, k, S, C);
                    return;
                }
            }
            B & 8
                ? (O & 16 && be(E, w, F), D !== E && f(m, D))
                : O & 16
                  ? B & 16
                      ? Te(E, D, m, _, w, F, k, S, C)
                      : be(E, w, F, !0)
                  : (O & 8 && f(m, ''), B & 16 && $(D, m, _, w, F, k, S, C));
        },
        ce = (c, u, m, _, w, F, k, S, C) => {
            (c = c || Et), (u = u || Et);
            const E = c.length,
                O = u.length,
                D = Math.min(E, O);
            let M;
            for (M = 0; M < D; M++) {
                const B = (u[M] = C ? Ze(u[M]) : Ne(u[M]));
                I(c[M], B, m, null, w, F, k, S, C);
            }
            E > O ? be(c, w, F, !0, !1, D) : $(u, m, _, w, F, k, S, C, D);
        },
        Te = (c, u, m, _, w, F, k, S, C) => {
            let E = 0;
            const O = u.length;
            let D = c.length - 1,
                M = O - 1;
            for (; E <= D && E <= M; ) {
                const B = c[E],
                    G = (u[E] = C ? Ze(u[E]) : Ne(u[E]));
                if (dt(B, G)) I(B, G, m, null, w, F, k, S, C);
                else break;
                E++;
            }
            for (; E <= D && E <= M; ) {
                const B = c[D],
                    G = (u[M] = C ? Ze(u[M]) : Ne(u[M]));
                if (dt(B, G)) I(B, G, m, null, w, F, k, S, C);
                else break;
                D--, M--;
            }
            if (E > D) {
                if (E <= M) {
                    const B = M + 1,
                        G = B < O ? u[B].el : _;
                    for (; E <= M; )
                        I(null, (u[E] = C ? Ze(u[E]) : Ne(u[E])), m, G, w, F, k, S, C), E++;
                }
            } else if (E > M) for (; E <= D; ) ie(c[E], w, F, !0), E++;
            else {
                const B = E,
                    G = E,
                    Z = new Map();
                for (E = G; E <= M; E++) {
                    const Ee = (u[E] = C ? Ze(u[E]) : Ne(u[E]));
                    Ee.key != null && Z.set(Ee.key, E);
                }
                let se,
                    ue = 0;
                const ke = M - G + 1;
                let _t = !1,
                    Is = 0;
                const Ot = new Array(ke);
                for (E = 0; E < ke; E++) Ot[E] = 0;
                for (E = B; E <= D; E++) {
                    const Ee = c[E];
                    if (ue >= ke) {
                        ie(Ee, w, F, !0);
                        continue;
                    }
                    let Re;
                    if (Ee.key != null) Re = Z.get(Ee.key);
                    else
                        for (se = G; se <= M; se++)
                            if (Ot[se - G] === 0 && dt(Ee, u[se])) {
                                Re = se;
                                break;
                            }
                    Re === void 0
                        ? ie(Ee, w, F, !0)
                        : ((Ot[Re - G] = E + 1),
                          Re >= Is ? (Is = Re) : (_t = !0),
                          I(Ee, u[Re], m, null, w, F, k, S, C),
                          ue++);
                }
                const Ls = _t ? yl(Ot) : Et;
                for (se = Ls.length - 1, E = ke - 1; E >= 0; E--) {
                    const Ee = G + E,
                        Re = u[Ee],
                        Rs = Ee + 1 < O ? u[Ee + 1].el : _;
                    Ot[E] === 0
                        ? I(null, Re, m, Rs, w, F, k, S, C)
                        : _t && (se < 0 || E !== Ls[se] ? Fe(Re, m, Rs, 2) : se--);
                }
            }
        },
        Fe = (c, u, m, _, w = null) => {
            const {el: F, type: k, transition: S, children: C, shapeFlag: E} = c;
            if (E & 6) {
                Fe(c.component.subTree, u, m, _);
                return;
            }
            if (E & 128) {
                c.suspense.move(u, m, _);
                return;
            }
            if (E & 64) {
                k.move(c, u, m, ze);
                return;
            }
            if (k === re) {
                s(F, u, m);
                for (let D = 0; D < C.length; D++) Fe(C[D], u, m, _);
                s(c.anchor, u, m);
                return;
            }
            if (k === Bt) {
                p(c, u, m);
                return;
            }
            if (_ !== 2 && E & 1 && S)
                if (_ === 0) S.beforeEnter(F), s(F, u, m), _e(() => S.enter(F), w);
                else {
                    const {leave: D, delayLeave: M, afterLeave: B} = S,
                        G = () => s(F, u, m),
                        Z = () => {
                            D(F, () => {
                                G(), B && B();
                            });
                        };
                    M ? M(F, G, Z) : Z();
                }
            else s(F, u, m);
        },
        ie = (c, u, m, _ = !1, w = !1) => {
            const {
                type: F,
                props: k,
                ref: S,
                children: C,
                dynamicChildren: E,
                shapeFlag: O,
                patchFlag: D,
                dirs: M,
            } = c;
            if ((S != null && rs(S, null, m, c, !0), O & 256)) {
                u.ctx.deactivate(c);
                return;
            }
            const B = O & 1 && M,
                G = !Dt(c);
            let Z;
            if ((G && (Z = k && k.onVnodeBeforeUnmount) && Me(Z, u, c), O & 6))
                rt(c.component, m, _);
            else {
                if (O & 128) {
                    c.suspense.unmount(m, _);
                    return;
                }
                B && lt(c, null, u, 'beforeUnmount'),
                    O & 64
                        ? c.type.remove(c, u, m, w, ze, _)
                        : E && (F !== re || (D > 0 && D & 64))
                          ? be(E, u, m, !1, !0)
                          : ((F === re && D & 384) || (!w && O & 16)) && be(C, u, m),
                    _ && Jt(c);
            }
            ((G && (Z = k && k.onVnodeUnmounted)) || B) &&
                _e(() => {
                    Z && Me(Z, u, c), B && lt(c, null, u, 'unmounted');
                }, m);
        },
        Jt = (c) => {
            const {type: u, el: m, anchor: _, transition: w} = c;
            if (u === re) {
                Le(m, _);
                return;
            }
            if (u === Bt) {
                y(c);
                return;
            }
            const F = () => {
                r(m), w && !w.persisted && w.afterLeave && w.afterLeave();
            };
            if (c.shapeFlag & 1 && w && !w.persisted) {
                const {leave: k, delayLeave: S} = w,
                    C = () => k(m, F);
                S ? S(c.el, F, C) : C();
            } else F();
        },
        Le = (c, u) => {
            let m;
            for (; c !== u; ) (m = b(c)), r(c), (c = m);
            r(u);
        },
        rt = (c, u, m) => {
            const {bum: _, scope: w, update: F, subTree: k, um: S} = c;
            _ && Rn(_),
                w.stop(),
                F && ((F.active = !1), ie(k, c, u, m)),
                S && _e(S, u),
                _e(() => {
                    c.isUnmounted = !0;
                }, u),
                u &&
                    u.pendingBranch &&
                    !u.isUnmounted &&
                    c.asyncDep &&
                    !c.asyncResolved &&
                    c.suspenseId === u.pendingId &&
                    (u.deps--, u.deps === 0 && u.resolve());
        },
        be = (c, u, m, _ = !1, w = !1, F = 0) => {
            for (let k = F; k < c.length; k++) ie(c[k], u, m, _, w);
        },
        Ue = (c) =>
            c.shapeFlag & 6
                ? Ue(c.component.subTree)
                : c.shapeFlag & 128
                  ? c.suspense.next()
                  : b(c.anchor || c.el);
    let it = !1;
    const Pt = (c, u, m) => {
            c == null
                ? u._vnode && ie(u._vnode, null, null, !0)
                : I(u._vnode || null, c, u, null, null, null, m),
                it || ((it = !0), Gs(), Yr(), (it = !1)),
                (u._vnode = c);
        },
        ze = {p: I, um: ie, m: Fe, r: Jt, mt: pe, mc: $, pc: U, pbc: j, n: Ue, o: e};
    let ot, Qt;
    return {render: Pt, hydrate: ot, createApp: al(Pt, ot)};
}
function Hn({type: e, props: t}, n) {
    return (n === 'svg' && e === 'foreignObject') ||
        (n === 'mathml' && e === 'annotation-xml' && t && t.encoding && t.encoding.includes('html'))
        ? void 0
        : n;
}
function at({effect: e, update: t}, n) {
    e.allowRecurse = t.allowRecurse = n;
}
function vl(e, t) {
    return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function hi(e, t, n = !1) {
    const s = e.children,
        r = t.children;
    if (K(s) && K(r))
        for (let i = 0; i < s.length; i++) {
            const o = s[i];
            let l = r[i];
            l.shapeFlag & 1 &&
                !l.dynamicChildren &&
                ((l.patchFlag <= 0 || l.patchFlag === 32) && ((l = r[i] = Ze(r[i])), (l.el = o.el)),
                n || hi(o, l)),
                l.type === Tn && (l.el = o.el);
        }
}
function yl(e) {
    const t = e.slice(),
        n = [0];
    let s, r, i, o, l;
    const a = e.length;
    for (s = 0; s < a; s++) {
        const d = e[s];
        if (d !== 0) {
            if (((r = n[n.length - 1]), e[r] < d)) {
                (t[s] = r), n.push(s);
                continue;
            }
            for (i = 0, o = n.length - 1; i < o; )
                (l = (i + o) >> 1), e[n[l]] < d ? (i = l + 1) : (o = l);
            d < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), (n[i] = s));
        }
    }
    for (i = n.length, o = n[i - 1]; i-- > 0; ) (n[i] = o), (o = t[o]);
    return n;
}
function gi(e) {
    const t = e.subTree.component;
    if (t) return t.asyncDep && !t.asyncResolved ? t : gi(t);
}
const bl = (e) => e.__isTeleport,
    re = Symbol.for('v-fgt'),
    Tn = Symbol.for('v-txt'),
    He = Symbol.for('v-cmt'),
    Bt = Symbol.for('v-stc'),
    Ut = [];
let Ie = null;
function de(e = !1) {
    Ut.push((Ie = e ? null : []));
}
function _l() {
    Ut.pop(), (Ie = Ut[Ut.length - 1] || null);
}
let Kt = 1;
function nr(e) {
    Kt += e;
}
function mi(e) {
    return (e.dynamicChildren = Kt > 0 ? Ie || Et : null), _l(), Kt > 0 && Ie && Ie.push(e), e;
}
function ye(e, t, n, s, r, i) {
    return mi(x(e, t, n, s, r, i, !0));
}
function vi(e, t, n, s, r) {
    return mi(q(e, t, n, s, r, !0));
}
function vn(e) {
    return e ? e.__v_isVNode === !0 : !1;
}
function dt(e, t) {
    return e.type === t.type && e.key === t.key;
}
const kn = '__vInternal',
    yi = ({key: e}) => e ?? null,
    dn = ({ref: e, ref_key: t, ref_for: n}) => (
        typeof e == 'number' && (e = '' + e),
        e != null ? (Ae(e) || we(e) || V(e) ? {i: fe, r: e, k: t, f: !!n} : e) : null
    );
function x(e, t = null, n = null, s = 0, r = null, i = e === re ? 0 : 1, o = !1, l = !1) {
    const a = {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e,
        props: t,
        key: t && yi(t),
        ref: t && dn(t),
        scopeId: Jr,
        slotScopeIds: null,
        children: n,
        component: null,
        suspense: null,
        ssContent: null,
        ssFallback: null,
        dirs: null,
        transition: null,
        el: null,
        anchor: null,
        target: null,
        targetAnchor: null,
        staticCount: 0,
        shapeFlag: i,
        patchFlag: s,
        dynamicProps: r,
        dynamicChildren: null,
        appContext: null,
        ctx: fe,
    };
    return (
        l ? (Ts(a, n), i & 128 && e.normalize(a)) : n && (a.shapeFlag |= Ae(n) ? 8 : 16),
        Kt > 0 && !o && Ie && (a.patchFlag > 0 || i & 6) && a.patchFlag !== 32 && Ie.push(a),
        a
    );
}
const q = xl;
function xl(e, t = null, n = null, s = 0, r = null, i = !1) {
    if (((!e || e === Io) && (e = He), vn(e))) {
        const l = tt(e, t, !0);
        return (
            n && Ts(l, n),
            Kt > 0 && !i && Ie && (l.shapeFlag & 6 ? (Ie[Ie.indexOf(e)] = l) : Ie.push(l)),
            (l.patchFlag |= -2),
            l
        );
    }
    if ((kl(e) && (e = e.__vccOpts), t)) {
        t = wl(t);
        let {class: l, style: a} = t;
        l && !Ae(l) && (t.class = je(l)),
            le(a) && (Ir(a) && !K(a) && (a = me({}, a)), (t.style = En(a)));
    }
    const o = Ae(e) ? 1 : Lo(e) ? 128 : bl(e) ? 64 : le(e) ? 4 : V(e) ? 2 : 0;
    return x(e, t, n, s, r, o, i, !0);
}
function wl(e) {
    return e ? (Ir(e) || kn in e ? me({}, e) : e) : null;
}
function tt(e, t, n = !1) {
    const {props: s, ref: r, patchFlag: i, children: o} = e,
        l = t ? Al(s || {}, t) : s;
    return {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e.type,
        props: l,
        key: l && yi(l),
        ref: t && t.ref ? (n && r ? (K(r) ? r.concat(dn(t)) : [r, dn(t)]) : dn(t)) : r,
        scopeId: e.scopeId,
        slotScopeIds: e.slotScopeIds,
        children: o,
        target: e.target,
        targetAnchor: e.targetAnchor,
        staticCount: e.staticCount,
        shapeFlag: e.shapeFlag,
        patchFlag: t && e.type !== re ? (i === -1 ? 16 : i | 16) : i,
        dynamicProps: e.dynamicProps,
        dynamicChildren: e.dynamicChildren,
        appContext: e.appContext,
        dirs: e.dirs,
        transition: e.transition,
        component: e.component,
        suspense: e.suspense,
        ssContent: e.ssContent && tt(e.ssContent),
        ssFallback: e.ssFallback && tt(e.ssFallback),
        el: e.el,
        anchor: e.anchor,
        ctx: e.ctx,
        ce: e.ce,
    };
}
function te(e = ' ', t = 0) {
    return q(Tn, null, e, t);
}
function $s(e, t) {
    const n = q(Bt, null, e);
    return (n.staticCount = t), n;
}
function Ne(e) {
    return e == null || typeof e == 'boolean'
        ? q(He)
        : K(e)
          ? q(re, null, e.slice())
          : typeof e == 'object'
            ? Ze(e)
            : q(Tn, null, String(e));
}
function Ze(e) {
    return (e.el === null && e.patchFlag !== -1) || e.memo ? e : tt(e);
}
function Ts(e, t) {
    let n = 0;
    const {shapeFlag: s} = e;
    if (t == null) t = null;
    else if (K(t)) n = 16;
    else if (typeof t == 'object')
        if (s & 65) {
            const r = t.default;
            r && (r._c && (r._d = !1), Ts(e, r()), r._c && (r._d = !0));
            return;
        } else {
            n = 32;
            const r = t._;
            !r && !(kn in t)
                ? (t._ctx = fe)
                : r === 3 &&
                  fe &&
                  (fe.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
        }
    else
        V(t)
            ? ((t = {default: t, _ctx: fe}), (n = 32))
            : ((t = String(t)), s & 64 ? ((n = 16), (t = [te(t)])) : (n = 8));
    (e.children = t), (e.shapeFlag |= n);
}
function Al(...e) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
        const s = e[n];
        for (const r in s)
            if (r === 'class') t.class !== s.class && (t.class = je([t.class, s.class]));
            else if (r === 'style') t.style = En([t.style, s.style]);
            else if (_s(r)) {
                const i = t[r],
                    o = s[r];
                o && i !== o && !(K(i) && i.includes(o)) && (t[r] = i ? [].concat(i, o) : o);
            } else r !== '' && (t[r] = s[r]);
    }
    return t;
}
function Me(e, t, n, s = null) {
    $e(e, t, 7, [n, s]);
}
const El = ai();
let Sl = 0;
function Fl(e, t, n) {
    const s = e.type,
        r = (t ? t.appContext : e.appContext) || El,
        i = {
            uid: Sl++,
            vnode: e,
            type: s,
            parent: t,
            appContext: r,
            root: null,
            next: null,
            subTree: null,
            effect: null,
            update: null,
            scope: new Di(!0),
            render: null,
            proxy: null,
            exposed: null,
            exposeProxy: null,
            withProxy: null,
            provides: t ? t.provides : Object.create(r.provides),
            accessCache: null,
            renderCache: [],
            components: null,
            directives: null,
            propsOptions: ui(s, r),
            emitsOptions: Zr(s, r),
            emit: null,
            emitted: null,
            propsDefaults: ne,
            inheritAttrs: s.inheritAttrs,
            ctx: ne,
            data: ne,
            props: ne,
            attrs: ne,
            slots: ne,
            refs: ne,
            setupState: ne,
            setupContext: null,
            attrsProxy: null,
            slotsProxy: null,
            suspense: n,
            suspenseId: n ? n.pendingId : 0,
            asyncDep: null,
            asyncResolved: !1,
            isMounted: !1,
            isUnmounted: !1,
            isDeactivated: !1,
            bc: null,
            c: null,
            bm: null,
            m: null,
            bu: null,
            u: null,
            um: null,
            bum: null,
            da: null,
            a: null,
            rtg: null,
            rtc: null,
            ec: null,
            sp: null,
        };
    return (
        (i.ctx = {_: i}), (i.root = t ? t.root : i), (i.emit = $o.bind(null, i)), e.ce && e.ce(i), i
    );
}
let ge = null;
const ks = () => ge || fe;
let yn, is;
{
    const e = Gr(),
        t = (n, s) => {
            let r;
            return (
                (r = e[n]) || (r = e[n] = []),
                r.push(s),
                (i) => {
                    r.length > 1 ? r.forEach((o) => o(i)) : r[0](i);
                }
            );
        };
    (yn = t('__VUE_INSTANCE_SETTERS__', (n) => (ge = n))),
        (is = t('__VUE_SSR_SETTERS__', (n) => (Pn = n)));
}
const Zt = (e) => {
        const t = ge;
        return (
            yn(e),
            e.scope.on(),
            () => {
                e.scope.off(), yn(t);
            }
        );
    },
    sr = () => {
        ge && ge.scope.off(), yn(null);
    };
function bi(e) {
    return e.vnode.shapeFlag & 4;
}
let Pn = !1;
function Cl(e, t = !1) {
    t && is(t);
    const {props: n, children: s} = e.vnode,
        r = bi(e);
    ul(e, n, r, t), pl(e, s);
    const i = r ? $l(e, t) : void 0;
    return t && is(!1), i;
}
function $l(e, t) {
    const n = e.type;
    (e.accessCache = Object.create(null)), (e.proxy = Lr(new Proxy(e.ctx, Qo)));
    const {setup: s} = n;
    if (s) {
        const r = (e.setupContext = s.length > 1 ? xi(e) : null),
            i = Zt(e);
        yt();
        const o = et(s, e, 0, [e.props, r]);
        if ((bt(), i(), Ur(o))) {
            if ((o.then(sr, sr), t))
                return o
                    .then((l) => {
                        rr(e, l, t);
                    })
                    .catch((l) => {
                        Sn(l, e, 0);
                    });
            e.asyncDep = o;
        } else rr(e, o, t);
    } else _i(e, t);
}
function rr(e, t, n) {
    V(t)
        ? e.type.__ssrInlineRender
            ? (e.ssrRender = t)
            : (e.render = t)
        : le(t) && (e.setupState = Nr(t)),
        _i(e, n);
}
let ir;
function _i(e, t, n) {
    const s = e.type;
    if (!e.render) {
        if (!t && ir && !s.render) {
            const r = s.template || Fs(e).template;
            if (r) {
                const {isCustomElement: i, compilerOptions: o} = e.appContext.config,
                    {delimiters: l, compilerOptions: a} = s,
                    d = me(me({isCustomElement: i, delimiters: l}, o), a);
                s.render = ir(r, d);
            }
        }
        e.render = s.render || Oe;
    }
    {
        const r = Zt(e);
        yt();
        try {
            nl(e);
        } finally {
            bt(), r();
        }
    }
}
function Tl(e) {
    return (
        e.attrsProxy ||
        (e.attrsProxy = new Proxy(e.attrs, {
            get(t, n) {
                return xe(e, 'get', '$attrs'), t[n];
            },
        }))
    );
}
function xi(e) {
    const t = (n) => {
        e.exposed = n || {};
    };
    return {
        get attrs() {
            return Tl(e);
        },
        slots: e.slots,
        emit: e.emit,
        expose: t,
    };
}
function On(e) {
    if (e.exposed)
        return (
            e.exposeProxy ||
            (e.exposeProxy = new Proxy(Nr(Lr(e.exposed)), {
                get(t, n) {
                    if (n in t) return t[n];
                    if (n in jt) return jt[n](e);
                },
                has(t, n) {
                    return n in t || n in jt;
                },
            }))
        );
}
function kl(e) {
    return V(e) && '__vccOpts' in e;
}
const vt = (e, t) => lo(e, t, Pn);
function Pl(e, t, n) {
    const s = arguments.length;
    return s === 2
        ? le(t) && !K(t)
            ? vn(t)
                ? q(e, null, [t])
                : q(e, t)
            : q(e, null, t)
        : (s > 3 ? (n = Array.prototype.slice.call(arguments, 2)) : s === 3 && vn(n) && (n = [n]),
          q(e, t, n));
}
const Ol = '3.4.19';
/**
 * @vue/shared v3.4.19
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function Il(e, t) {
    const n = new Set(e.split(','));
    return (s) => n.has(s);
}
const Ll = (e) =>
        e.charCodeAt(0) === 111 &&
        e.charCodeAt(1) === 110 &&
        (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
    Rl = (e) => e.startsWith('onUpdate:'),
    Ps = Object.assign,
    In = Array.isArray,
    wi = (e) => typeof e == 'function',
    qt = (e) => typeof e == 'string',
    Ml = (e) => e !== null && typeof e == 'object',
    Ai = (e) => {
        const t = Object.create(null);
        return (n) => t[n] || (t[n] = e(n));
    },
    Nl = /\B([A-Z])/g,
    Ei = Ai((e) => e.replace(Nl, '-$1').toLowerCase()),
    Dl = Ai((e) => e.charAt(0).toUpperCase() + e.slice(1)),
    jl = (e) => {
        const t = qt(e) ? Number(e) : NaN;
        return isNaN(t) ? e : t;
    },
    Hl = 'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly',
    Bl = Il(Hl);
function Si(e) {
    return !!e || e === '';
}
/**
 * @vue/runtime-dom v3.4.19
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ const Ul = 'http://www.w3.org/2000/svg',
    zl = 'http://www.w3.org/1998/Math/MathML',
    Je = typeof document < 'u' ? document : null,
    or = Je && Je.createElement('template'),
    Vl = {
        insert: (e, t, n) => {
            t.insertBefore(e, n || null);
        },
        remove: (e) => {
            const t = e.parentNode;
            t && t.removeChild(e);
        },
        createElement: (e, t, n, s) => {
            const r =
                t === 'svg'
                    ? Je.createElementNS(Ul, e)
                    : t === 'mathml'
                      ? Je.createElementNS(zl, e)
                      : Je.createElement(e, n ? {is: n} : void 0);
            return (
                e === 'select' && s && s.multiple != null && r.setAttribute('multiple', s.multiple),
                r
            );
        },
        createText: (e) => Je.createTextNode(e),
        createComment: (e) => Je.createComment(e),
        setText: (e, t) => {
            e.nodeValue = t;
        },
        setElementText: (e, t) => {
            e.textContent = t;
        },
        parentNode: (e) => e.parentNode,
        nextSibling: (e) => e.nextSibling,
        querySelector: (e) => Je.querySelector(e),
        setScopeId(e, t) {
            e.setAttribute(t, '');
        },
        insertStaticContent(e, t, n, s, r, i) {
            const o = n ? n.previousSibling : t.lastChild;
            if (r && (r === i || r.nextSibling))
                for (; t.insertBefore(r.cloneNode(!0), n), !(r === i || !(r = r.nextSibling)); );
            else {
                or.innerHTML =
                    s === 'svg' ? `<svg>${e}</svg>` : s === 'mathml' ? `<math>${e}</math>` : e;
                const l = or.content;
                if (s === 'svg' || s === 'mathml') {
                    const a = l.firstChild;
                    for (; a.firstChild; ) l.appendChild(a.firstChild);
                    l.removeChild(a);
                }
                t.insertBefore(l, n);
            }
            return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
        },
    },
    qe = 'transition',
    It = 'animation',
    Wt = Symbol('_vtc'),
    Os = (e, {slots: t}) => Pl(Uo, Gl(e), t);
Os.displayName = 'Transition';
const Fi = {
    name: String,
    type: String,
    css: {type: Boolean, default: !0},
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String,
};
Os.props = Ps({}, ti, Fi);
const ct = (e, t = []) => {
        In(e) ? e.forEach((n) => n(...t)) : e && e(...t);
    },
    lr = (e) => (e ? (In(e) ? e.some((t) => t.length > 1) : e.length > 1) : !1);
function Gl(e) {
    const t = {};
    for (const L in e) L in Fi || (t[L] = e[L]);
    if (e.css === !1) return t;
    const {
            name: n = 'v',
            type: s,
            duration: r,
            enterFromClass: i = `${n}-enter-from`,
            enterActiveClass: o = `${n}-enter-active`,
            enterToClass: l = `${n}-enter-to`,
            appearFromClass: a = i,
            appearActiveClass: d = o,
            appearToClass: f = l,
            leaveFromClass: h = `${n}-leave-from`,
            leaveActiveClass: b = `${n}-leave-active`,
            leaveToClass: R = `${n}-leave-to`,
        } = e,
        z = Kl(r),
        I = z && z[0],
        N = z && z[1],
        {
            onBeforeEnter: H,
            onEnter: g,
            onEnterCancelled: p,
            onLeave: y,
            onLeaveCancelled: A,
            onBeforeAppear: v = H,
            onAppear: P = g,
            onAppearCancelled: $ = p,
        } = t,
        T = (L, Q, pe) => {
            ut(L, Q ? f : l), ut(L, Q ? d : o), pe && pe();
        },
        j = (L, Q) => {
            (L._isLeaving = !1), ut(L, h), ut(L, R), ut(L, b), Q && Q();
        },
        W = (L) => (Q, pe) => {
            const st = L ? P : g,
                oe = () => T(Q, L, pe);
            ct(st, [Q, oe]),
                ar(() => {
                    ut(Q, L ? a : i), We(Q, L ? f : l), lr(st) || cr(Q, s, I, oe);
                });
        };
    return Ps(t, {
        onBeforeEnter(L) {
            ct(H, [L]), We(L, i), We(L, o);
        },
        onBeforeAppear(L) {
            ct(v, [L]), We(L, a), We(L, d);
        },
        onEnter: W(!1),
        onAppear: W(!0),
        onLeave(L, Q) {
            L._isLeaving = !0;
            const pe = () => j(L, Q);
            We(L, h),
                Yl(),
                We(L, b),
                ar(() => {
                    L._isLeaving && (ut(L, h), We(L, R), lr(y) || cr(L, s, N, pe));
                }),
                ct(y, [L, pe]);
        },
        onEnterCancelled(L) {
            T(L, !1), ct(p, [L]);
        },
        onAppearCancelled(L) {
            T(L, !0), ct($, [L]);
        },
        onLeaveCancelled(L) {
            j(L), ct(A, [L]);
        },
    });
}
function Kl(e) {
    if (e == null) return null;
    if (Ml(e)) return [Bn(e.enter), Bn(e.leave)];
    {
        const t = Bn(e);
        return [t, t];
    }
}
function Bn(e) {
    return jl(e);
}
function We(e, t) {
    t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Wt] || (e[Wt] = new Set())).add(t);
}
function ut(e, t) {
    t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
    const n = e[Wt];
    n && (n.delete(t), n.size || (e[Wt] = void 0));
}
function ar(e) {
    requestAnimationFrame(() => {
        requestAnimationFrame(e);
    });
}
let ql = 0;
function cr(e, t, n, s) {
    const r = (e._endId = ++ql),
        i = () => {
            r === e._endId && s();
        };
    if (n) return setTimeout(i, n);
    const {type: o, timeout: l, propCount: a} = Wl(e, t);
    if (!o) return s();
    const d = o + 'end';
    let f = 0;
    const h = () => {
            e.removeEventListener(d, b), i();
        },
        b = (R) => {
            R.target === e && ++f >= a && h();
        };
    setTimeout(() => {
        f < a && h();
    }, l + 1),
        e.addEventListener(d, b);
}
function Wl(e, t) {
    const n = window.getComputedStyle(e),
        s = (z) => (n[z] || '').split(', '),
        r = s(`${qe}Delay`),
        i = s(`${qe}Duration`),
        o = ur(r, i),
        l = s(`${It}Delay`),
        a = s(`${It}Duration`),
        d = ur(l, a);
    let f = null,
        h = 0,
        b = 0;
    t === qe
        ? o > 0 && ((f = qe), (h = o), (b = i.length))
        : t === It
          ? d > 0 && ((f = It), (h = d), (b = a.length))
          : ((h = Math.max(o, d)),
            (f = h > 0 ? (o > d ? qe : It) : null),
            (b = f ? (f === qe ? i.length : a.length) : 0));
    const R = f === qe && /\b(transform|all)(,|$)/.test(s(`${qe}Property`).toString());
    return {type: f, timeout: h, propCount: b, hasTransform: R};
}
function ur(e, t) {
    for (; e.length < t.length; ) e = e.concat(e);
    return Math.max(...t.map((n, s) => fr(n) + fr(e[s])));
}
function fr(e) {
    return e === 'auto' ? 0 : Number(e.slice(0, -1).replace(',', '.')) * 1e3;
}
function Yl() {
    return document.body.offsetHeight;
}
function Xl(e, t, n) {
    const s = e[Wt];
    s && (t = (t ? [t, ...s] : [...s]).join(' ')),
        t == null ? e.removeAttribute('class') : n ? e.setAttribute('class', t) : (e.className = t);
}
const Yt = Symbol('_vod'),
    Ci = {
        beforeMount(e, {value: t}, {transition: n}) {
            (e[Yt] = e.style.display === 'none' ? '' : e.style.display),
                n && t ? n.beforeEnter(e) : Lt(e, t);
        },
        mounted(e, {value: t}, {transition: n}) {
            n && t && n.enter(e);
        },
        updated(e, {value: t, oldValue: n}, {transition: s}) {
            (!t == !n && (e.style.display === e[Yt] || !t)) ||
                (s
                    ? t
                        ? (s.beforeEnter(e), Lt(e, !0), s.enter(e))
                        : s.leave(e, () => {
                              Lt(e, !1);
                          })
                    : Lt(e, t));
        },
        beforeUnmount(e, {value: t}) {
            Lt(e, t);
        },
    };
function Lt(e, t) {
    e.style.display = t ? e[Yt] : 'none';
}
const $i = Symbol('');
function Zl(e) {
    const t = ks();
    if (!t) return;
    const n = (t.ut = (r = e(t.proxy)) => {
            Array.from(document.querySelectorAll(`[data-v-owner="${t.uid}"]`)).forEach((i) =>
                ls(i, r)
            );
        }),
        s = () => {
            const r = e(t.proxy);
            os(t.subTree, r), n(r);
        };
    Do(s),
        $t(() => {
            const r = new MutationObserver(s);
            r.observe(t.subTree.el.parentNode, {childList: !0}), Xt(() => r.disconnect());
        });
}
function os(e, t) {
    if (e.shapeFlag & 128) {
        const n = e.suspense;
        (e = n.activeBranch),
            n.pendingBranch &&
                !n.isHydrating &&
                n.effects.push(() => {
                    os(n.activeBranch, t);
                });
    }
    for (; e.component; ) e = e.component.subTree;
    if (e.shapeFlag & 1 && e.el) ls(e.el, t);
    else if (e.type === re) e.children.forEach((n) => os(n, t));
    else if (e.type === Bt) {
        let {el: n, anchor: s} = e;
        for (; n && (ls(n, t), n !== s); ) n = n.nextSibling;
    }
}
function ls(e, t) {
    if (e.nodeType === 1) {
        const n = e.style;
        let s = '';
        for (const r in t) n.setProperty(`--${r}`, t[r]), (s += `--${r}: ${t[r]};`);
        n[$i] = s;
    }
}
const Jl = /(^|;)\s*display\s*:/;
function Ql(e, t, n) {
    const s = e.style,
        r = qt(n),
        i = s.display;
    let o = !1;
    if (n && !r) {
        if (t && !qt(t)) for (const l in t) n[l] == null && as(s, l, '');
        for (const l in n) l === 'display' && (o = !0), as(s, l, n[l]);
    } else if (r) {
        if (t !== n) {
            const l = s[$i];
            l && (n += ';' + l), (s.cssText = n), (o = Jl.test(n));
        }
    } else t && e.removeAttribute('style');
    Yt in e && ((e[Yt] = o ? s.display : ''), (s.display = i));
}
const dr = /\s*!important$/;
function as(e, t, n) {
    if (In(n)) n.forEach((s) => as(e, t, s));
    else if ((n == null && (n = ''), t.startsWith('--'))) e.setProperty(t, n);
    else {
        const s = ea(e, t);
        dr.test(n) ? e.setProperty(Ei(s), n.replace(dr, ''), 'important') : (e[s] = n);
    }
}
const pr = ['Webkit', 'Moz', 'ms'],
    Un = {};
function ea(e, t) {
    const n = Un[t];
    if (n) return n;
    let s = Ct(t);
    if (s !== 'filter' && s in e) return (Un[t] = s);
    s = Dl(s);
    for (let r = 0; r < pr.length; r++) {
        const i = pr[r] + s;
        if (i in e) return (Un[t] = i);
    }
    return t;
}
const hr = 'http://www.w3.org/1999/xlink';
function ta(e, t, n, s, r) {
    if (s && t.startsWith('xlink:'))
        n == null ? e.removeAttributeNS(hr, t.slice(6, t.length)) : e.setAttributeNS(hr, t, n);
    else {
        const i = Bl(t);
        n == null || (i && !Si(n)) ? e.removeAttribute(t) : e.setAttribute(t, i ? '' : n);
    }
}
function na(e, t, n, s, r, i, o) {
    if (t === 'innerHTML' || t === 'textContent') {
        s && o(s, r, i), (e[t] = n ?? '');
        return;
    }
    const l = e.tagName;
    if (t === 'value' && l !== 'PROGRESS' && !l.includes('-')) {
        e._value = n;
        const d = l === 'OPTION' ? e.getAttribute('value') : e.value,
            f = n ?? '';
        d !== f && (e.value = f), n == null && e.removeAttribute(t);
        return;
    }
    let a = !1;
    if (n === '' || n == null) {
        const d = typeof e[t];
        d === 'boolean'
            ? (n = Si(n))
            : n == null && d === 'string'
              ? ((n = ''), (a = !0))
              : d === 'number' && ((n = 0), (a = !0));
    }
    try {
        e[t] = n;
    } catch {}
    a && e.removeAttribute(t);
}
function sa(e, t, n, s) {
    e.addEventListener(t, n, s);
}
function ra(e, t, n, s) {
    e.removeEventListener(t, n, s);
}
const gr = Symbol('_vei');
function ia(e, t, n, s, r = null) {
    const i = e[gr] || (e[gr] = {}),
        o = i[t];
    if (s && o) o.value = s;
    else {
        const [l, a] = oa(t);
        if (s) {
            const d = (i[t] = ca(s, r));
            sa(e, l, d, a);
        } else o && (ra(e, l, o, a), (i[t] = void 0));
    }
}
const mr = /(?:Once|Passive|Capture)$/;
function oa(e) {
    let t;
    if (mr.test(e)) {
        t = {};
        let s;
        for (; (s = e.match(mr)); )
            (e = e.slice(0, e.length - s[0].length)), (t[s[0].toLowerCase()] = !0);
    }
    return [e[2] === ':' ? e.slice(3) : Ei(e.slice(2)), t];
}
let zn = 0;
const la = Promise.resolve(),
    aa = () => zn || (la.then(() => (zn = 0)), (zn = Date.now()));
function ca(e, t) {
    const n = (s) => {
        if (!s._vts) s._vts = Date.now();
        else if (s._vts <= n.attached) return;
        $e(ua(s, n.value), t, 5, [s]);
    };
    return (n.value = e), (n.attached = aa()), n;
}
function ua(e, t) {
    if (In(t)) {
        const n = e.stopImmediatePropagation;
        return (
            (e.stopImmediatePropagation = () => {
                n.call(e), (e._stopped = !0);
            }),
            t.map((s) => (r) => !r._stopped && s && s(r))
        );
    } else return t;
}
const vr = (e) =>
        e.charCodeAt(0) === 111 &&
        e.charCodeAt(1) === 110 &&
        e.charCodeAt(2) > 96 &&
        e.charCodeAt(2) < 123,
    fa = (e, t, n, s, r, i, o, l, a) => {
        const d = r === 'svg';
        t === 'class'
            ? Xl(e, s, d)
            : t === 'style'
              ? Ql(e, n, s)
              : Ll(t)
                ? Rl(t) || ia(e, t, n, s, o)
                : (
                        t[0] === '.'
                            ? ((t = t.slice(1)), !0)
                            : t[0] === '^'
                              ? ((t = t.slice(1)), !1)
                              : da(e, t, s, d)
                    )
                  ? na(e, t, s, i, o, l, a)
                  : (t === 'true-value'
                        ? (e._trueValue = s)
                        : t === 'false-value' && (e._falseValue = s),
                    ta(e, t, s, d));
    };
function da(e, t, n, s) {
    if (s) return !!(t === 'innerHTML' || t === 'textContent' || (t in e && vr(t) && wi(n)));
    if (
        t === 'spellcheck' ||
        t === 'draggable' ||
        t === 'translate' ||
        t === 'form' ||
        (t === 'list' && e.tagName === 'INPUT') ||
        (t === 'type' && e.tagName === 'TEXTAREA')
    )
        return !1;
    if (t === 'width' || t === 'height') {
        const r = e.tagName;
        if (r === 'IMG' || r === 'VIDEO' || r === 'CANVAS' || r === 'SOURCE') return !1;
    }
    return vr(t) && qt(n) ? !1 : t in e;
}
const pa = Ps({patchProp: fa}, Vl);
let yr;
function ha() {
    return yr || (yr = gl(pa));
}
const ga = (...e) => {
    const t = ha().createApp(...e),
        {mount: n} = t;
    return (
        (t.mount = (s) => {
            const r = va(s);
            if (!r) return;
            const i = t._component;
            !wi(i) && !i.render && !i.template && (i.template = r.innerHTML), (r.innerHTML = '');
            const o = n(r, !1, ma(r));
            return (
                r instanceof Element &&
                    (r.removeAttribute('v-cloak'), r.setAttribute('data-v-app', '')),
                o
            );
        }),
        t
    );
};
function ma(e) {
    if (e instanceof SVGElement) return 'svg';
    if (typeof MathMLElement == 'function' && e instanceof MathMLElement) return 'mathml';
}
function va(e) {
    return qt(e) ? document.querySelector(e) : e;
}
const ya = '' + new URL('../images/vue.svg', import.meta.url).href;
var br =
    typeof globalThis < 'u'
        ? globalThis
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : typeof self < 'u'
              ? self
              : {};
function ba(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default') ? e.default : e;
}
var Ti = {exports: {}};
(function (e) {
    var t =
        typeof window < 'u'
            ? window
            : typeof WorkerGlobalScope < 'u' && self instanceof WorkerGlobalScope
              ? self
              : {};
    /**
     * Prism: Lightweight, robust, elegant syntax highlighting
     *
     * @license MIT <https://opensource.org/licenses/MIT>
     * @author Lea Verou <https://lea.verou.me>
     * @namespace
     * @public
     */ var n = (function (s) {
        var r = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
            i = 0,
            o = {},
            l = {
                manual: s.Prism && s.Prism.manual,
                disableWorkerMessageHandler: s.Prism && s.Prism.disableWorkerMessageHandler,
                util: {
                    encode: function g(p) {
                        return p instanceof a
                            ? new a(p.type, g(p.content), p.alias)
                            : Array.isArray(p)
                              ? p.map(g)
                              : p
                                    .replace(/&/g, '&amp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/\u00a0/g, ' ');
                    },
                    type: function (g) {
                        return Object.prototype.toString.call(g).slice(8, -1);
                    },
                    objId: function (g) {
                        return g.__id || Object.defineProperty(g, '__id', {value: ++i}), g.__id;
                    },
                    clone: function g(p, y) {
                        y = y || {};
                        var A, v;
                        switch (l.util.type(p)) {
                            case 'Object':
                                if (((v = l.util.objId(p)), y[v])) return y[v];
                                (A = {}), (y[v] = A);
                                for (var P in p) p.hasOwnProperty(P) && (A[P] = g(p[P], y));
                                return A;
                            case 'Array':
                                return (
                                    (v = l.util.objId(p)),
                                    y[v]
                                        ? y[v]
                                        : ((A = []),
                                          (y[v] = A),
                                          p.forEach(function ($, T) {
                                              A[T] = g($, y);
                                          }),
                                          A)
                                );
                            default:
                                return p;
                        }
                    },
                    getLanguage: function (g) {
                        for (; g; ) {
                            var p = r.exec(g.className);
                            if (p) return p[1].toLowerCase();
                            g = g.parentElement;
                        }
                        return 'none';
                    },
                    setLanguage: function (g, p) {
                        (g.className = g.className.replace(RegExp(r, 'gi'), '')),
                            g.classList.add('language-' + p);
                    },
                    currentScript: function () {
                        if (typeof document > 'u') return null;
                        if ('currentScript' in document) return document.currentScript;
                        try {
                            throw new Error();
                        } catch (A) {
                            var g = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(A.stack) || [])[1];
                            if (g) {
                                var p = document.getElementsByTagName('script');
                                for (var y in p) if (p[y].src == g) return p[y];
                            }
                            return null;
                        }
                    },
                    isActive: function (g, p, y) {
                        for (var A = 'no-' + p; g; ) {
                            var v = g.classList;
                            if (v.contains(p)) return !0;
                            if (v.contains(A)) return !1;
                            g = g.parentElement;
                        }
                        return !!y;
                    },
                },
                languages: {
                    plain: o,
                    plaintext: o,
                    text: o,
                    txt: o,
                    extend: function (g, p) {
                        var y = l.util.clone(l.languages[g]);
                        for (var A in p) y[A] = p[A];
                        return y;
                    },
                    insertBefore: function (g, p, y, A) {
                        A = A || l.languages;
                        var v = A[g],
                            P = {};
                        for (var $ in v)
                            if (v.hasOwnProperty($)) {
                                if ($ == p) for (var T in y) y.hasOwnProperty(T) && (P[T] = y[T]);
                                y.hasOwnProperty($) || (P[$] = v[$]);
                            }
                        var j = A[g];
                        return (
                            (A[g] = P),
                            l.languages.DFS(l.languages, function (W, L) {
                                L === j && W != g && (this[W] = P);
                            }),
                            P
                        );
                    },
                    DFS: function g(p, y, A, v) {
                        v = v || {};
                        var P = l.util.objId;
                        for (var $ in p)
                            if (p.hasOwnProperty($)) {
                                y.call(p, $, p[$], A || $);
                                var T = p[$],
                                    j = l.util.type(T);
                                j === 'Object' && !v[P(T)]
                                    ? ((v[P(T)] = !0), g(T, y, null, v))
                                    : j === 'Array' && !v[P(T)] && ((v[P(T)] = !0), g(T, y, $, v));
                            }
                    },
                },
                plugins: {},
                highlightAll: function (g, p) {
                    l.highlightAllUnder(document, g, p);
                },
                highlightAllUnder: function (g, p, y) {
                    var A = {
                        callback: y,
                        container: g,
                        selector:
                            'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
                    };
                    l.hooks.run('before-highlightall', A),
                        (A.elements = Array.prototype.slice.apply(
                            A.container.querySelectorAll(A.selector)
                        )),
                        l.hooks.run('before-all-elements-highlight', A);
                    for (var v = 0, P; (P = A.elements[v++]); )
                        l.highlightElement(P, p === !0, A.callback);
                },
                highlightElement: function (g, p, y) {
                    var A = l.util.getLanguage(g),
                        v = l.languages[A];
                    l.util.setLanguage(g, A);
                    var P = g.parentElement;
                    P && P.nodeName.toLowerCase() === 'pre' && l.util.setLanguage(P, A);
                    var $ = g.textContent,
                        T = {element: g, language: A, grammar: v, code: $};
                    function j(L) {
                        (T.highlightedCode = L),
                            l.hooks.run('before-insert', T),
                            (T.element.innerHTML = T.highlightedCode),
                            l.hooks.run('after-highlight', T),
                            l.hooks.run('complete', T),
                            y && y.call(T.element);
                    }
                    if (
                        (l.hooks.run('before-sanity-check', T),
                        (P = T.element.parentElement),
                        P &&
                            P.nodeName.toLowerCase() === 'pre' &&
                            !P.hasAttribute('tabindex') &&
                            P.setAttribute('tabindex', '0'),
                        !T.code)
                    ) {
                        l.hooks.run('complete', T), y && y.call(T.element);
                        return;
                    }
                    if ((l.hooks.run('before-highlight', T), !T.grammar)) {
                        j(l.util.encode(T.code));
                        return;
                    }
                    if (p && s.Worker) {
                        var W = new Worker(l.filename);
                        (W.onmessage = function (L) {
                            j(L.data);
                        }),
                            W.postMessage(
                                JSON.stringify({
                                    language: T.language,
                                    code: T.code,
                                    immediateClose: !0,
                                })
                            );
                    } else j(l.highlight(T.code, T.grammar, T.language));
                },
                highlight: function (g, p, y) {
                    var A = {code: g, grammar: p, language: y};
                    if ((l.hooks.run('before-tokenize', A), !A.grammar))
                        throw new Error('The language "' + A.language + '" has no grammar.');
                    return (
                        (A.tokens = l.tokenize(A.code, A.grammar)),
                        l.hooks.run('after-tokenize', A),
                        a.stringify(l.util.encode(A.tokens), A.language)
                    );
                },
                tokenize: function (g, p) {
                    var y = p.rest;
                    if (y) {
                        for (var A in y) p[A] = y[A];
                        delete p.rest;
                    }
                    var v = new h();
                    return b(v, v.head, g), f(g, v, p, v.head, 0), z(v);
                },
                hooks: {
                    all: {},
                    add: function (g, p) {
                        var y = l.hooks.all;
                        (y[g] = y[g] || []), y[g].push(p);
                    },
                    run: function (g, p) {
                        var y = l.hooks.all[g];
                        if (!(!y || !y.length)) for (var A = 0, v; (v = y[A++]); ) v(p);
                    },
                },
                Token: a,
            };
        s.Prism = l;
        function a(g, p, y, A) {
            (this.type = g),
                (this.content = p),
                (this.alias = y),
                (this.length = (A || '').length | 0);
        }
        a.stringify = function g(p, y) {
            if (typeof p == 'string') return p;
            if (Array.isArray(p)) {
                var A = '';
                return (
                    p.forEach(function (j) {
                        A += g(j, y);
                    }),
                    A
                );
            }
            var v = {
                    type: p.type,
                    content: g(p.content, y),
                    tag: 'span',
                    classes: ['token', p.type],
                    attributes: {},
                    language: y,
                },
                P = p.alias;
            P && (Array.isArray(P) ? Array.prototype.push.apply(v.classes, P) : v.classes.push(P)),
                l.hooks.run('wrap', v);
            var $ = '';
            for (var T in v.attributes)
                $ += ' ' + T + '="' + (v.attributes[T] || '').replace(/"/g, '&quot;') + '"';
            return (
                '<' +
                v.tag +
                ' class="' +
                v.classes.join(' ') +
                '"' +
                $ +
                '>' +
                v.content +
                '</' +
                v.tag +
                '>'
            );
        };
        function d(g, p, y, A) {
            g.lastIndex = p;
            var v = g.exec(y);
            if (v && A && v[1]) {
                var P = v[1].length;
                (v.index += P), (v[0] = v[0].slice(P));
            }
            return v;
        }
        function f(g, p, y, A, v, P) {
            for (var $ in y)
                if (!(!y.hasOwnProperty($) || !y[$])) {
                    var T = y[$];
                    T = Array.isArray(T) ? T : [T];
                    for (var j = 0; j < T.length; ++j) {
                        if (P && P.cause == $ + ',' + j) return;
                        var W = T[j],
                            L = W.inside,
                            Q = !!W.lookbehind,
                            pe = !!W.greedy,
                            st = W.alias;
                        if (pe && !W.pattern.global) {
                            var oe = W.pattern.toString().match(/[imsuy]*$/)[0];
                            W.pattern = RegExp(W.pattern.source, oe + 'g');
                        }
                        for (
                            var ee = W.pattern || W, U = A.next, ce = v;
                            U !== p.tail && !(P && ce >= P.reach);
                            ce += U.value.length, U = U.next
                        ) {
                            var Te = U.value;
                            if (p.length > g.length) return;
                            if (!(Te instanceof a)) {
                                var Fe = 1,
                                    ie;
                                if (pe) {
                                    if (((ie = d(ee, ce, g, Q)), !ie || ie.index >= g.length))
                                        break;
                                    var be = ie.index,
                                        Jt = ie.index + ie[0].length,
                                        Le = ce;
                                    for (Le += U.value.length; be >= Le; )
                                        (U = U.next), (Le += U.value.length);
                                    if (((Le -= U.value.length), (ce = Le), U.value instanceof a))
                                        continue;
                                    for (
                                        var rt = U;
                                        rt !== p.tail && (Le < Jt || typeof rt.value == 'string');
                                        rt = rt.next
                                    )
                                        Fe++, (Le += rt.value.length);
                                    Fe--, (Te = g.slice(ce, Le)), (ie.index -= ce);
                                } else if (((ie = d(ee, 0, Te, Q)), !ie)) continue;
                                var be = ie.index,
                                    Ue = ie[0],
                                    it = Te.slice(0, be),
                                    Pt = Te.slice(be + Ue.length),
                                    ze = ce + Te.length;
                                P && ze > P.reach && (P.reach = ze);
                                var ot = U.prev;
                                it && ((ot = b(p, ot, it)), (ce += it.length)), R(p, ot, Fe);
                                var Qt = new a($, L ? l.tokenize(Ue, L) : Ue, st, Ue);
                                if (((U = b(p, ot, Qt)), Pt && b(p, U, Pt), Fe > 1)) {
                                    var c = {cause: $ + ',' + j, reach: ze};
                                    f(g, p, y, U.prev, ce, c),
                                        P && c.reach > P.reach && (P.reach = c.reach);
                                }
                            }
                        }
                    }
                }
        }
        function h() {
            var g = {value: null, prev: null, next: null},
                p = {value: null, prev: g, next: null};
            (g.next = p), (this.head = g), (this.tail = p), (this.length = 0);
        }
        function b(g, p, y) {
            var A = p.next,
                v = {value: y, prev: p, next: A};
            return (p.next = v), (A.prev = v), g.length++, v;
        }
        function R(g, p, y) {
            for (var A = p.next, v = 0; v < y && A !== g.tail; v++) A = A.next;
            (p.next = A), (A.prev = p), (g.length -= v);
        }
        function z(g) {
            for (var p = [], y = g.head.next; y !== g.tail; ) p.push(y.value), (y = y.next);
            return p;
        }
        if (!s.document)
            return (
                s.addEventListener &&
                    (l.disableWorkerMessageHandler ||
                        s.addEventListener(
                            'message',
                            function (g) {
                                var p = JSON.parse(g.data),
                                    y = p.language,
                                    A = p.code,
                                    v = p.immediateClose;
                                s.postMessage(l.highlight(A, l.languages[y], y)), v && s.close();
                            },
                            !1
                        )),
                l
            );
        var I = l.util.currentScript();
        I && ((l.filename = I.src), I.hasAttribute('data-manual') && (l.manual = !0));
        function N() {
            l.manual || l.highlightAll();
        }
        if (!l.manual) {
            var H = document.readyState;
            H === 'loading' || (H === 'interactive' && I && I.defer)
                ? document.addEventListener('DOMContentLoaded', N)
                : window.requestAnimationFrame
                  ? window.requestAnimationFrame(N)
                  : window.setTimeout(N, 16);
        }
        return l;
    })(t);
    e.exports && (e.exports = n),
        typeof br < 'u' && (br.Prism = n),
        (n.languages.markup = {
            comment: {pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0},
            prolog: {pattern: /<\?[\s\S]+?\?>/, greedy: !0},
            doctype: {
                pattern:
                    /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
                greedy: !0,
                inside: {
                    'internal-subset': {
                        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
                        lookbehind: !0,
                        greedy: !0,
                        inside: null,
                    },
                    string: {pattern: /"[^"]*"|'[^']*'/, greedy: !0},
                    punctuation: /^<!|>$|[[\]]/,
                    'doctype-tag': /^DOCTYPE/i,
                    name: /[^\s<>'"]+/,
                },
            },
            cdata: {pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0},
            tag: {
                pattern:
                    /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
                greedy: !0,
                inside: {
                    tag: {
                        pattern: /^<\/?[^\s>\/]+/,
                        inside: {punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/},
                    },
                    'special-attr': [],
                    'attr-value': {
                        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                        inside: {
                            punctuation: [
                                {pattern: /^=/, alias: 'attr-equals'},
                                {pattern: /^(\s*)["']|["']$/, lookbehind: !0},
                            ],
                        },
                    },
                    punctuation: /\/?>/,
                    'attr-name': {pattern: /[^\s>\/]+/, inside: {namespace: /^[^\s>\/:]+:/}},
                },
            },
            entity: [{pattern: /&[\da-z]{1,8};/i, alias: 'named-entity'}, /&#x?[\da-f]{1,8};/i],
        }),
        (n.languages.markup.tag.inside['attr-value'].inside.entity = n.languages.markup.entity),
        (n.languages.markup.doctype.inside['internal-subset'].inside = n.languages.markup),
        n.hooks.add('wrap', function (s) {
            s.type === 'entity' && (s.attributes.title = s.content.replace(/&amp;/, '&'));
        }),
        Object.defineProperty(n.languages.markup.tag, 'addInlined', {
            value: function (r, i) {
                var o = {};
                (o['language-' + i] = {
                    pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
                    lookbehind: !0,
                    inside: n.languages[i],
                }),
                    (o.cdata = /^<!\[CDATA\[|\]\]>$/i);
                var l = {'included-cdata': {pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: o}};
                l['language-' + i] = {pattern: /[\s\S]+/, inside: n.languages[i]};
                var a = {};
                (a[r] = {
                    pattern: RegExp(
                        /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
                            /__/g,
                            function () {
                                return r;
                            }
                        ),
                        'i'
                    ),
                    lookbehind: !0,
                    greedy: !0,
                    inside: l,
                }),
                    n.languages.insertBefore('markup', 'cdata', a);
            },
        }),
        Object.defineProperty(n.languages.markup.tag, 'addAttribute', {
            value: function (s, r) {
                n.languages.markup.tag.inside['special-attr'].push({
                    pattern: RegExp(
                        /(^|["'\s])/.source +
                            '(?:' +
                            s +
                            ')' +
                            /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
                        'i'
                    ),
                    lookbehind: !0,
                    inside: {
                        'attr-name': /^[^\s=]+/,
                        'attr-value': {
                            pattern: /=[\s\S]+/,
                            inside: {
                                value: {
                                    pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                                    lookbehind: !0,
                                    alias: [r, 'language-' + r],
                                    inside: n.languages[r],
                                },
                                punctuation: [{pattern: /^=/, alias: 'attr-equals'}, /"|'/],
                            },
                        },
                    },
                });
            },
        }),
        (n.languages.html = n.languages.markup),
        (n.languages.mathml = n.languages.markup),
        (n.languages.svg = n.languages.markup),
        (n.languages.xml = n.languages.extend('markup', {})),
        (n.languages.ssml = n.languages.xml),
        (n.languages.atom = n.languages.xml),
        (n.languages.rss = n.languages.xml),
        (function (s) {
            var r = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
            (s.languages.css = {
                comment: /\/\*[\s\S]*?\*\//,
                atrule: {
                    pattern: RegExp(
                        '@[\\w-](?:' +
                            /[^;{\s"']|\s+(?!\s)/.source +
                            '|' +
                            r.source +
                            ')*?' +
                            /(?:;|(?=\s*\{))/.source
                    ),
                    inside: {
                        rule: /^@[\w-]+/,
                        'selector-function-argument': {
                            pattern:
                                /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                            lookbehind: !0,
                            alias: 'selector',
                        },
                        keyword: {
                            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                            lookbehind: !0,
                        },
                    },
                },
                url: {
                    pattern: RegExp(
                        '\\burl\\((?:' +
                            r.source +
                            '|' +
                            /(?:[^\\\r\n()"']|\\[\s\S])*/.source +
                            ')\\)',
                        'i'
                    ),
                    greedy: !0,
                    inside: {
                        function: /^url/i,
                        punctuation: /^\(|\)$/,
                        string: {pattern: RegExp('^' + r.source + '$'), alias: 'url'},
                    },
                },
                selector: {
                    pattern: RegExp(
                        `(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` +
                            r.source +
                            ')*(?=\\s*\\{)'
                    ),
                    lookbehind: !0,
                },
                string: {pattern: r, greedy: !0},
                property: {
                    pattern:
                        /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
                    lookbehind: !0,
                },
                important: /!important\b/i,
                function: {pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: !0},
                punctuation: /[(){};:,]/,
            }),
                (s.languages.css.atrule.inside.rest = s.languages.css);
            var i = s.languages.markup;
            i && (i.tag.addInlined('style', 'css'), i.tag.addAttribute('style', 'css'));
        })(n),
        (n.languages.clike = {
            comment: [
                {pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0, greedy: !0},
                {pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0},
            ],
            string: {pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0},
            'class-name': {
                pattern:
                    /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
                lookbehind: !0,
                inside: {punctuation: /[.\\]/},
            },
            keyword:
                /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
            boolean: /\b(?:false|true)\b/,
            function: /\b\w+(?=\()/,
            number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
            operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
            punctuation: /[{}[\];(),.:]/,
        }),
        (n.languages.javascript = n.languages.extend('clike', {
            'class-name': [
                n.languages.clike['class-name'],
                {
                    pattern:
                        /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
                    lookbehind: !0,
                },
            ],
            keyword: [
                {pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0},
                {
                    pattern:
                        /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
                    lookbehind: !0,
                },
            ],
            function:
                /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
            number: {
                pattern: RegExp(
                    /(^|[^\w$])/.source +
                        '(?:' +
                        (/NaN|Infinity/.source +
                            '|' +
                            /0[bB][01]+(?:_[01]+)*n?/.source +
                            '|' +
                            /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
                            '|' +
                            /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
                            '|' +
                            /\d+(?:_\d+)*n/.source +
                            '|' +
                            /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
                                .source) +
                        ')' +
                        /(?![\w$])/.source
                ),
                lookbehind: !0,
            },
            operator:
                /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
        })),
        (n.languages.javascript['class-name'][0].pattern =
            /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
        n.languages.insertBefore('javascript', 'keyword', {
            regex: {
                pattern: RegExp(
                    /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
                        /\//.source +
                        '(?:' +
                        /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source +
                        '|' +
                        /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
                            .source +
                        ')' +
                        /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
                ),
                lookbehind: !0,
                greedy: !0,
                inside: {
                    'regex-source': {
                        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                        lookbehind: !0,
                        alias: 'language-regex',
                        inside: n.languages.regex,
                    },
                    'regex-delimiter': /^\/|\/$/,
                    'regex-flags': /^[a-z]+$/,
                },
            },
            'function-variable': {
                pattern:
                    /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
                alias: 'function',
            },
            parameter: [
                {
                    pattern:
                        /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
                    lookbehind: !0,
                    inside: n.languages.javascript,
                },
                {
                    pattern:
                        /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
                    lookbehind: !0,
                    inside: n.languages.javascript,
                },
                {
                    pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
                    lookbehind: !0,
                    inside: n.languages.javascript,
                },
                {
                    pattern:
                        /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
                    lookbehind: !0,
                    inside: n.languages.javascript,
                },
            ],
            constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
        }),
        n.languages.insertBefore('javascript', 'string', {
            hashbang: {pattern: /^#!.*/, greedy: !0, alias: 'comment'},
            'template-string': {
                pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
                greedy: !0,
                inside: {
                    'template-punctuation': {pattern: /^`|`$/, alias: 'string'},
                    interpolation: {
                        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                        lookbehind: !0,
                        inside: {
                            'interpolation-punctuation': {
                                pattern: /^\$\{|\}$/,
                                alias: 'punctuation',
                            },
                            rest: n.languages.javascript,
                        },
                    },
                    string: /[\s\S]+/,
                },
            },
            'string-property': {
                pattern:
                    /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
                lookbehind: !0,
                greedy: !0,
                alias: 'property',
            },
        }),
        n.languages.insertBefore('javascript', 'operator', {
            'literal-property': {
                pattern:
                    /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
                lookbehind: !0,
                alias: 'property',
            },
        }),
        n.languages.markup &&
            (n.languages.markup.tag.addInlined('script', 'javascript'),
            n.languages.markup.tag.addAttribute(
                /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
                    .source,
                'javascript'
            )),
        (n.languages.js = n.languages.javascript),
        (function () {
            if (typeof n > 'u' || typeof document > 'u') return;
            Element.prototype.matches ||
                (Element.prototype.matches =
                    Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
            var s = 'Loading…',
                r = function (I, N) {
                    return '✖ Error ' + I + ' while fetching file: ' + N;
                },
                i = '✖ Error: File does not exist or is empty',
                o = {
                    js: 'javascript',
                    py: 'python',
                    rb: 'ruby',
                    ps1: 'powershell',
                    psm1: 'powershell',
                    sh: 'bash',
                    bat: 'batch',
                    h: 'c',
                    tex: 'latex',
                },
                l = 'data-src-status',
                a = 'loading',
                d = 'loaded',
                f = 'failed',
                h = 'pre[data-src]:not([' + l + '="' + d + '"]):not([' + l + '="' + a + '"])';
            function b(I, N, H) {
                var g = new XMLHttpRequest();
                g.open('GET', I, !0),
                    (g.onreadystatechange = function () {
                        g.readyState == 4 &&
                            (g.status < 400 && g.responseText
                                ? N(g.responseText)
                                : g.status >= 400
                                  ? H(r(g.status, g.statusText))
                                  : H(i));
                    }),
                    g.send(null);
            }
            function R(I) {
                var N = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(I || '');
                if (N) {
                    var H = Number(N[1]),
                        g = N[2],
                        p = N[3];
                    return g ? (p ? [H, Number(p)] : [H, void 0]) : [H, H];
                }
            }
            n.hooks.add('before-highlightall', function (I) {
                I.selector += ', ' + h;
            }),
                n.hooks.add('before-sanity-check', function (I) {
                    var N = I.element;
                    if (N.matches(h)) {
                        (I.code = ''), N.setAttribute(l, a);
                        var H = N.appendChild(document.createElement('CODE'));
                        H.textContent = s;
                        var g = N.getAttribute('data-src'),
                            p = I.language;
                        if (p === 'none') {
                            var y = (/\.(\w+)$/.exec(g) || [, 'none'])[1];
                            p = o[y] || y;
                        }
                        n.util.setLanguage(H, p), n.util.setLanguage(N, p);
                        var A = n.plugins.autoloader;
                        A && A.loadLanguages(p),
                            b(
                                g,
                                function (v) {
                                    N.setAttribute(l, d);
                                    var P = R(N.getAttribute('data-range'));
                                    if (P) {
                                        var $ = v.split(/\r\n?|\n/g),
                                            T = P[0],
                                            j = P[1] == null ? $.length : P[1];
                                        T < 0 && (T += $.length),
                                            (T = Math.max(0, Math.min(T - 1, $.length))),
                                            j < 0 && (j += $.length),
                                            (j = Math.max(0, Math.min(j, $.length))),
                                            (v = $.slice(T, j).join(`
`)),
                                            N.hasAttribute('data-start') ||
                                                N.setAttribute('data-start', String(T + 1));
                                    }
                                    (H.textContent = v), n.highlightElement(H);
                                },
                                function (v) {
                                    N.setAttribute(l, f), (H.textContent = v);
                                }
                            );
                    }
                }),
                (n.plugins.fileHighlight = {
                    highlight: function (N) {
                        for (var H = (N || document).querySelectorAll(h), g = 0, p; (p = H[g++]); )
                            n.highlightElement(p);
                    },
                });
            var z = !1;
            n.fileHighlight = function () {
                z ||
                    (console.warn(
                        'Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.'
                    ),
                    (z = !0)),
                    n.plugins.fileHighlight.highlight.apply(this, arguments);
            };
        })();
})(Ti);
var _a = Ti.exports;
const xt = ba(_a);
Prism.languages.javascript = Prism.languages.extend('clike', {
    'class-name': [
        Prism.languages.clike['class-name'],
        {
            pattern:
                /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
            lookbehind: !0,
        },
    ],
    keyword: [
        {pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0},
        {
            pattern:
                /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
            lookbehind: !0,
        },
    ],
    function:
        /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    number: {
        pattern: RegExp(
            /(^|[^\w$])/.source +
                '(?:' +
                (/NaN|Infinity/.source +
                    '|' +
                    /0[bB][01]+(?:_[01]+)*n?/.source +
                    '|' +
                    /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
                    '|' +
                    /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
                    '|' +
                    /\d+(?:_\d+)*n/.source +
                    '|' +
                    /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
                        .source) +
                ')' +
                /(?![\w$])/.source
        ),
        lookbehind: !0,
    },
    operator:
        /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
});
Prism.languages.javascript['class-name'][0].pattern =
    /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
Prism.languages.insertBefore('javascript', 'keyword', {
    regex: {
        pattern: RegExp(
            /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
                /\//.source +
                '(?:' +
                /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source +
                '|' +
                /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
                    .source +
                ')' +
                /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
            'regex-source': {
                pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                lookbehind: !0,
                alias: 'language-regex',
                inside: Prism.languages.regex,
            },
            'regex-delimiter': /^\/|\/$/,
            'regex-flags': /^[a-z]+$/,
        },
    },
    'function-variable': {
        pattern:
            /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
        alias: 'function',
    },
    parameter: [
        {
            pattern:
                /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
            lookbehind: !0,
            inside: Prism.languages.javascript,
        },
        {
            pattern:
                /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
            lookbehind: !0,
            inside: Prism.languages.javascript,
        },
        {
            pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
            lookbehind: !0,
            inside: Prism.languages.javascript,
        },
        {
            pattern:
                /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
            lookbehind: !0,
            inside: Prism.languages.javascript,
        },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
});
Prism.languages.insertBefore('javascript', 'string', {
    hashbang: {pattern: /^#!.*/, greedy: !0, alias: 'comment'},
    'template-string': {
        pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
        greedy: !0,
        inside: {
            'template-punctuation': {pattern: /^`|`$/, alias: 'string'},
            interpolation: {
                pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                lookbehind: !0,
                inside: {
                    'interpolation-punctuation': {pattern: /^\$\{|\}$/, alias: 'punctuation'},
                    rest: Prism.languages.javascript,
                },
            },
            string: /[\s\S]+/,
        },
    },
    'string-property': {
        pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
        lookbehind: !0,
        greedy: !0,
        alias: 'property',
    },
});
Prism.languages.insertBefore('javascript', 'operator', {
    'literal-property': {
        pattern:
            /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
        lookbehind: !0,
        alias: 'property',
    },
});
Prism.languages.markup &&
    (Prism.languages.markup.tag.addInlined('script', 'javascript'),
    Prism.languages.markup.tag.addAttribute(
        /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
            .source,
        'javascript'
    ));
Prism.languages.js = Prism.languages.javascript;
(function (e) {
    var t =
            '\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b',
        n = {
            pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
            lookbehind: !0,
            alias: 'punctuation',
            inside: null,
        },
        s = {
            bash: n,
            environment: {pattern: RegExp('\\$' + t), alias: 'constant'},
            variable: [
                {
                    pattern: /\$?\(\([\s\S]+?\)\)/,
                    greedy: !0,
                    inside: {
                        variable: [{pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0}, /^\$\(\(/],
                        number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
                        operator: /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
                        punctuation: /\(\(?|\)\)?|,|;/,
                    },
                },
                {
                    pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
                    greedy: !0,
                    inside: {variable: /^\$\(|^`|\)$|`$/},
                },
                {
                    pattern: /\$\{[^}]+\}/,
                    greedy: !0,
                    inside: {
                        operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
                        punctuation: /[\[\]]/,
                        environment: {
                            pattern: RegExp('(\\{)' + t),
                            lookbehind: !0,
                            alias: 'constant',
                        },
                    },
                },
                /\$(?:\w+|[#?*!@$])/,
            ],
            entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/,
        };
    (e.languages.bash = {
        shebang: {pattern: /^#!\s*\/.*/, alias: 'important'},
        comment: {pattern: /(^|[^"{\\$])#.*/, lookbehind: !0},
        'function-name': [
            {
                pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
                lookbehind: !0,
                alias: 'function',
            },
            {pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/, alias: 'function'},
        ],
        'for-or-select': {
            pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
            alias: 'variable',
            lookbehind: !0,
        },
        'assign-left': {
            pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
            inside: {
                environment: {
                    pattern: RegExp('(^|[\\s;|&]|[<>]\\()' + t),
                    lookbehind: !0,
                    alias: 'constant',
                },
            },
            alias: 'variable',
            lookbehind: !0,
        },
        parameter: {
            pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
            alias: 'variable',
            lookbehind: !0,
        },
        string: [
            {
                pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
                lookbehind: !0,
                greedy: !0,
                inside: s,
            },
            {
                pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
                lookbehind: !0,
                greedy: !0,
                inside: {bash: n},
            },
            {
                pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
                lookbehind: !0,
                greedy: !0,
                inside: s,
            },
            {pattern: /(^|[^$\\])'[^']*'/, lookbehind: !0, greedy: !0},
            {pattern: /\$'(?:[^'\\]|\\[\s\S])*'/, greedy: !0, inside: {entity: s.entity}},
        ],
        environment: {pattern: RegExp('\\$?' + t), alias: 'constant'},
        variable: s.variable,
        function: {
            pattern:
                /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
            lookbehind: !0,
        },
        keyword: {
            pattern:
                /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
            lookbehind: !0,
        },
        builtin: {
            pattern:
                /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
            lookbehind: !0,
            alias: 'class-name',
        },
        boolean: {pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/, lookbehind: !0},
        'file-descriptor': {pattern: /\B&\d\b/, alias: 'important'},
        operator: {
            pattern: /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
            inside: {'file-descriptor': {pattern: /^\d/, alias: 'important'}},
        },
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
        number: {pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/, lookbehind: !0},
    }),
        (n.inside = e.languages.bash);
    for (
        var r = [
                'comment',
                'function-name',
                'for-or-select',
                'assign-left',
                'parameter',
                'string',
                'environment',
                'function',
                'keyword',
                'builtin',
                'boolean',
                'file-descriptor',
                'operator',
                'punctuation',
                'number',
            ],
            i = s.variable[1].inside,
            o = 0;
        o < r.length;
        o++
    )
        i[r[o]] = e.languages.bash[r[o]];
    (e.languages.sh = e.languages.bash), (e.languages.shell = e.languages.bash);
})(Prism);
Prism.languages.markup = {
    comment: {pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0},
    prolog: {pattern: /<\?[\s\S]+?\?>/, greedy: !0},
    doctype: {
        pattern:
            /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: !0,
        inside: {
            'internal-subset': {
                pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
                lookbehind: !0,
                greedy: !0,
                inside: null,
            },
            string: {pattern: /"[^"]*"|'[^']*'/, greedy: !0},
            punctuation: /^<!|>$|[[\]]/,
            'doctype-tag': /^DOCTYPE/i,
            name: /[^\s<>'"]+/,
        },
    },
    cdata: {pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0},
    tag: {
        pattern:
            /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: !0,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/,
                inside: {punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/},
            },
            'special-attr': [],
            'attr-value': {
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                inside: {
                    punctuation: [
                        {pattern: /^=/, alias: 'attr-equals'},
                        {pattern: /^(\s*)["']|["']$/, lookbehind: !0},
                    ],
                },
            },
            punctuation: /\/?>/,
            'attr-name': {pattern: /[^\s>\/]+/, inside: {namespace: /^[^\s>\/:]+:/}},
        },
    },
    entity: [{pattern: /&[\da-z]{1,8};/i, alias: 'named-entity'}, /&#x?[\da-f]{1,8};/i],
};
Prism.languages.markup.tag.inside['attr-value'].inside.entity = Prism.languages.markup.entity;
Prism.languages.markup.doctype.inside['internal-subset'].inside = Prism.languages.markup;
Prism.hooks.add('wrap', function (e) {
    e.type === 'entity' && (e.attributes.title = e.content.replace(/&amp;/, '&'));
});
Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    value: function (t, n) {
        var s = {};
        (s['language-' + n] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: !0,
            inside: Prism.languages[n],
        }),
            (s.cdata = /^<!\[CDATA\[|\]\]>$/i);
        var r = {'included-cdata': {pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: s}};
        r['language-' + n] = {pattern: /[\s\S]+/, inside: Prism.languages[n]};
        var i = {};
        (i[t] = {
            pattern: RegExp(
                /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
                    /__/g,
                    function () {
                        return t;
                    }
                ),
                'i'
            ),
            lookbehind: !0,
            greedy: !0,
            inside: r,
        }),
            Prism.languages.insertBefore('markup', 'cdata', i);
    },
});
Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
    value: function (e, t) {
        Prism.languages.markup.tag.inside['special-attr'].push({
            pattern: RegExp(
                /(^|["'\s])/.source +
                    '(?:' +
                    e +
                    ')' +
                    /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
                'i'
            ),
            lookbehind: !0,
            inside: {
                'attr-name': /^[^\s=]+/,
                'attr-value': {
                    pattern: /=[\s\S]+/,
                    inside: {
                        value: {
                            pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                            lookbehind: !0,
                            alias: [t, 'language-' + t],
                            inside: Prism.languages[t],
                        },
                        punctuation: [{pattern: /^=/, alias: 'attr-equals'}, /"|'/],
                    },
                },
            },
        });
    },
});
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;
Prism.languages.xml = Prism.languages.extend('markup', {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;
const xa = {class: 'my-prism'},
    wa = ['innerHTML'],
    cs = Be({
        __name: 'MyEditor',
        props: {language: {}, code: {}},
        setup(e) {
            const t = e;
            function n(l) {
                return xt.highlight(l, xt.languages.javascript, 'javascript');
            }
            function s(l) {
                return xt.highlight(l, xt.languages.shell, 'shell');
            }
            function r(l) {
                return xt.highlight(l, xt.languages.html, 'html');
            }
            const i = vt(() => {
                    switch (t.language) {
                        case 'javascript':
                            return n(t.code);
                        case 'shell':
                            return s(t.code);
                        case 'html':
                            return r(t.code);
                        default:
                            return t.code;
                    }
                }),
                o = vt(() => {
                    switch (t.language) {
                        case 'javascript':
                            return 'language-javascript';
                        case 'shell':
                            return 'language-bash';
                        case 'html':
                            return 'language-html';
                        default:
                            return 'language-html';
                    }
                });
            return (l, a) => (
                de(),
                ye('pre', xa, [x('code', {class: je(o.value), innerHTML: i.value}, null, 10, wa)])
            );
        },
    }),
    Aa = {class: 'my-example-layout'},
    Ea = ['id'],
    Sa = {class: 'my-paragraph'},
    wt = Be({
        __name: 'MyExample',
        props: {title: {}, code: {}, language: {}},
        setup(e) {
            const t = el(),
                n = e,
                s = vt(() => n.title.replace(/\s+/g, '-').toLowerCase());
            return (r, i) => (
                de(),
                ye('div', Aa, [
                    x('h2', {id: s.value}, Se(n.title), 9, Ea),
                    ei(x('section', Sa, [Qn(r.$slots, 'description')], 512), [
                        [Ci, nt(t).description],
                    ]),
                    x('div', null, [
                        q(cs, {code: n.code, language: n.language}, null, 8, ['code', 'language']),
                        x('div', null, [Qn(r.$slots, 'default')]),
                    ]),
                ])
            );
        },
    });
function Fa(e, t, n) {
    const s = {top: 0, left: 0},
        r = us(e.getBoundingClientRect()),
        i = e.offsetParent,
        o = Ca(t),
        l = us(i.getBoundingClientRect());
    (s.left = r.left - l.left), (s.top = r.top - l.top);
    const a = {h: 'left', v: 'top'};
    switch (n[0].toLowerCase()) {
        case 'right':
            s.left += r.width;
            break;
        case 'center':
            s.left += r.width / 2;
            break;
    }
    switch (n[1].toLowerCase()) {
        case 'center':
            s.top += r.height / 2;
            break;
        case 'bottom':
            s.top += r.height;
            break;
    }
    switch (n[2].toLowerCase()) {
        case 'center':
            (s.left -= o.width / 2), (a.h = 'center');
            break;
        case 'right':
            (s.left -= o.width), (a.h = 'right');
            break;
    }
    switch (n[3].toLowerCase()) {
        case 'center':
            (s.top -= o.height / 2), (a.v = 'center');
            break;
        case 'bottom':
            (s.top -= o.height), (a.v = 'bottom');
            break;
    }
    return {
        position: 'absolute',
        top: `${Math.round(s.top)}px`,
        left: `${Math.round(s.left)}px`,
        transformOrigin: `${a.h} ${a.v}`,
    };
}
function Ca(e) {
    var s;
    const t = e.cloneNode(!0);
    (t.style.display = 'block'),
        (t.style.visibility = 'hidden'),
        (t.style.position = 'absolute'),
        (s = e.parentNode) == null || s.insertBefore(t, e),
        t.offsetWidth,
        t.offsetHeight;
    const n = us(t.getBoundingClientRect());
    return t.remove(), n;
}
function us(e) {
    const t = {width: 0, height: 0, top: 0, left: 0};
    return (
        Object.keys(t).forEach((n) => {
            t[n] = e[n];
        }),
        t
    );
}
const $a = '0.3s',
    kt = Be({
        __name: 'MyDropdown',
        props: {
            anchor: {},
            visible: {type: Boolean},
            position: {default: () => ['right', 'top', 'left', 'top']},
            animation: {default: 'slide'},
        },
        emits: ['clickout', 'open', 'close'],
        setup(e, {emit: t}) {
            Zl((h) => ({a3a04180: $a}));
            const n = e,
                s = J(null),
                r = t,
                i = J({});
            function o() {
                if (n.anchor !== null && s.value !== null) {
                    if (n.anchor instanceof HTMLElement) {
                        i.value = Fa(n.anchor, s.value, n.position);
                        return;
                    }
                    console.warn('Anchor property is not HTML element.');
                }
            }
            function l() {
                o(),
                    window.addEventListener('resize', o),
                    Xn(() => document.addEventListener('click', d));
            }
            function a(h, b) {
                return b instanceof HTMLElement && b.contains(h);
            }
            function d(h) {
                const b = a(h.target, n.anchor),
                    R = a(h.target, s.value);
                r('clickout', h, R, b);
            }
            function f() {
                window.removeEventListener('resize', o), document.removeEventListener('click', d);
            }
            return (
                un(
                    () => n.visible,
                    async (h, b) => {
                        if (h != b) {
                            if (h) {
                                l();
                                return;
                            }
                            f();
                        }
                    }
                ),
                $t(() => {
                    n.visible && Xn(l);
                }),
                Xt(() => {
                    n.visible && f();
                }),
                (h, b) => (
                    de(),
                    vi(
                        Os,
                        {
                            name: h.animation,
                            onAfterEnter: b[0] || (b[0] = (R) => r('open')),
                            onAfterLeave: b[1] || (b[1] = (R) => r('close')),
                        },
                        {
                            default: ae(() => [
                                ei(
                                    x(
                                        'div',
                                        {ref_key: '$dropdown', ref: s, style: En(i.value)},
                                        [Qn(h.$slots, 'default')],
                                        4
                                    ),
                                    [[Ci, h.visible]]
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
    }),
    Ta = x('div', {class: 'my-dropdown'}, 'My first dropdown', -1),
    ka = Be({
        __name: 'BasicExample',
        setup(e) {
            const t = J(!1),
                n = J(null);
            return (s, r) => (
                de(),
                ye(
                    re,
                    null,
                    [
                        x(
                            'button',
                            {
                                ref_key: 'anchor',
                                ref: n,
                                type: 'button',
                                class: 'my-button',
                                onClick: r[0] || (r[0] = (i) => (t.value = !t.value)),
                            },
                            ' Click me ',
                            512
                        ),
                        q(
                            nt(kt),
                            {anchor: n.value, visible: t.value},
                            {default: ae(() => [Ta]), _: 1},
                            8,
                            ['anchor', 'visible']
                        ),
                    ],
                    64
                )
            );
        },
    }),
    Pa = x('div', {class: 'my-dropdown'}, 'Click out to close the dropdown', -1),
    Oa = Be({
        __name: 'ClickoutExample',
        setup(e) {
            const t = J(!1),
                n = J(null);
            function s(r, i, o) {
                t.value = i || o;
            }
            return (r, i) => (
                de(),
                ye(
                    re,
                    null,
                    [
                        x(
                            'button',
                            {
                                ref_key: 'anchor',
                                ref: n,
                                type: 'button',
                                class: 'my-button',
                                onClick: i[0] || (i[0] = (o) => (t.value = !t.value)),
                            },
                            ' Click me ',
                            512
                        ),
                        q(
                            nt(kt),
                            {anchor: n.value, visible: t.value, onClickout: s},
                            {default: ae(() => [Pa]), _: 1},
                            8,
                            ['anchor', 'visible']
                        ),
                    ],
                    64
                )
            );
        },
    }),
    Ia = {class: 'my-form'},
    La = {class: 'my-input'},
    Ra = x('label', {for: 'button-h'}, 'Button horizontal position', -1),
    Ma = ['value'],
    Na = ['value'],
    Da = {class: 'my-input'},
    ja = x('label', {for: 'button-v'}, 'Button vertical position', -1),
    Ha = ['value'],
    Ba = {class: 'my-input'},
    Ua = x('label', {for: 'dd-h'}, 'Dropdown horizontal position', -1),
    za = ['value'],
    Va = {class: 'my-input'},
    Ga = x('label', {for: 'dd-v'}, 'Dropdown vertical position', -1),
    Ka = ['value'],
    qa = x('p', {class: 'my-2'}, 'Dropdown in this position:', -1),
    Wa = Be({
        __name: 'PositionExample',
        setup(e) {
            const t = J(!1),
                n = J(null),
                s = J(['right', 'top', 'left', 'top']);
            function r(a, d) {
                const f = a.target.value;
                s.value[d] = f;
            }
            function i(a, d, f) {
                t.value = f || d;
            }
            const o = vt(() => [
                    'my-button-corner',
                    `my-button-corner-h-${s.value[0]}`,
                    `my-button-corner-v-${s.value[1]}`,
                ]),
                l = vt(() => [
                    'my-dd-corner',
                    `my-dd-corner-h-${s.value[2]}`,
                    `my-dd-corner-v-${s.value[3]}`,
                ]);
            return (a, d) => (
                de(),
                ye(
                    re,
                    null,
                    [
                        x('div', Ia, [
                            x('div', La, [
                                Ra,
                                x(
                                    'select',
                                    {
                                        id: 'button-h',
                                        value: s.value[0],
                                        onChange: d[0] || (d[0] = (f) => r(f, 0)),
                                    },
                                    [
                                        (de(),
                                        ye(
                                            re,
                                            null,
                                            Rt(['left', 'center', 'right'], (f) =>
                                                x('option', {key: f, value: f}, Se(f), 9, Na)
                                            ),
                                            64
                                        )),
                                    ],
                                    40,
                                    Ma
                                ),
                            ]),
                            x('div', Da, [
                                ja,
                                x(
                                    'select',
                                    {id: 'button-v', onChange: d[1] || (d[1] = (f) => r(f, 1))},
                                    [
                                        (de(),
                                        ye(
                                            re,
                                            null,
                                            Rt(['top', 'center', 'bottom'], (f) =>
                                                x('option', {key: f, value: f}, Se(f), 9, Ha)
                                            ),
                                            64
                                        )),
                                    ],
                                    32
                                ),
                            ]),
                            x('div', Ba, [
                                Ua,
                                x(
                                    'select',
                                    {id: 'dd-h', onChange: d[2] || (d[2] = (f) => r(f, 2))},
                                    [
                                        (de(),
                                        ye(
                                            re,
                                            null,
                                            Rt(['left', 'center', 'right'], (f) =>
                                                x('option', {key: f, value: f}, Se(f), 9, za)
                                            ),
                                            64
                                        )),
                                    ],
                                    32
                                ),
                            ]),
                            x('div', Va, [
                                Ga,
                                x(
                                    'select',
                                    {id: 'dd-v', onChange: d[3] || (d[3] = (f) => r(f, 3))},
                                    [
                                        (de(),
                                        ye(
                                            re,
                                            null,
                                            Rt(['top', 'center', 'bottom'], (f) =>
                                                x('option', {key: f, value: f}, Se(f), 9, Ka)
                                            ),
                                            64
                                        )),
                                    ],
                                    32
                                ),
                            ]),
                        ]),
                        x(
                            'button',
                            {
                                ref_key: 'anchor',
                                ref: n,
                                type: 'button',
                                class: je(['my-button', o.value]),
                                onClick: d[4] || (d[4] = (f) => (t.value = !t.value)),
                            },
                            ' Click me ',
                            2
                        ),
                        q(
                            nt(kt),
                            {anchor: n.value, visible: t.value, position: s.value, onClickout: i},
                            {
                                default: ae(() => [
                                    x(
                                        'div',
                                        {class: je(['my-dropdown', l.value])},
                                        [
                                            qa,
                                            x('ul', null, [
                                                x('li', null, [x('code', null, Se(s.value[0]), 1)]),
                                                x('li', null, [x('code', null, Se(s.value[1]), 1)]),
                                                x('li', null, [x('code', null, Se(s.value[2]), 1)]),
                                                x('li', null, [x('code', null, Se(s.value[3]), 1)]),
                                            ]),
                                        ],
                                        2
                                    ),
                                ]),
                                _: 1,
                            },
                            8,
                            ['anchor', 'visible', 'position']
                        ),
                    ],
                    64
                )
            );
        },
    }),
    Ya = {class: 'my-grid'},
    Xa = {class: 'my-anchors'},
    Za = x('div', {class: 'my-dropdown'}, 'Dropdown here', -1),
    Ja = Be({
        __name: 'AnchorExample',
        setup(e) {
            const t = J(!1),
                n = J(null),
                s = J([null, null, null, null]),
                r = J(0);
            function i(d, f) {
                d !== null && (s.value[f] = d);
            }
            function o(d) {
                t.value = n.value !== null && (n.value == d.target || n.value.contains(d.target));
            }
            function l(d) {
                (r.value = d), (t.value = !1);
            }
            const a = vt(() => {
                switch (r.value) {
                    case 0:
                        return 'Show in anchor 1';
                    case 1:
                        return 'Show in anchor 2';
                    case 2:
                        return 'Show in anchor 3';
                    default:
                        return 'Show in anchor 4';
                }
            });
            return (d, f) => (
                de(),
                ye('div', Ya, [
                    x('div', Xa, [
                        x(
                            'div',
                            {
                                ref: (h) => i(h, 0),
                                class: je({'my-active': r.value == 0}),
                                onClick: f[0] || (f[0] = (h) => l(0)),
                            },
                            ' Anchor 1 ',
                            2
                        ),
                        x(
                            'div',
                            {
                                ref: (h) => i(h, 1),
                                class: je({'my-active': r.value == 1}),
                                onClick: f[1] || (f[1] = (h) => l(1)),
                            },
                            ' Anchor 2 ',
                            2
                        ),
                        x(
                            'div',
                            {
                                ref: (h) => i(h, 2),
                                class: je({'my-active': r.value == 2}),
                                onClick: f[2] || (f[2] = (h) => l(2)),
                            },
                            ' Anchor 3 ',
                            2
                        ),
                        x(
                            'div',
                            {
                                ref: (h) => i(h, 3),
                                class: je({'my-active': r.value == 3}),
                                onClick: f[3] || (f[3] = (h) => l(3)),
                            },
                            ' Anchor 4 ',
                            2
                        ),
                    ]),
                    q(
                        nt(kt),
                        {
                            anchor: s.value[r.value],
                            visible: t.value,
                            position: ['center', 'bottom', 'center', 'top'],
                            onClickout: o,
                        },
                        {default: ae(() => [Za]), _: 1},
                        8,
                        ['anchor', 'visible']
                    ),
                    x(
                        'button',
                        {
                            ref_key: 'button',
                            ref: n,
                            type: 'button',
                            class: 'my-button',
                            onClick: f[4] || (f[4] = (h) => (t.value = !t.value)),
                        },
                        Se(a.value),
                        513
                    ),
                ])
            );
        },
    }),
    Qa = {class: 'my-form'},
    ec = {class: 'my-input'},
    tc = x('label', {for: 'button-h'}, 'Button horizontal position', -1),
    nc = ['value'],
    sc = ['value'],
    rc = {class: 'my-dropdown'},
    ic = Be({
        __name: 'AnimationExample',
        setup(e) {
            const t = J(!1),
                n = J(null),
                s = J(0),
                r = J([
                    {label: 'slide. Included in the library. Default option.', value: 'slide'},
                    {label: 'slide-x. Included in the library.', value: 'slide-x'},
                    {label: 'slide-y. Included in the library.', value: 'slide-y'},
                    {label: 'fade. Included in the library.', value: 'fade'},
                    {label: 'none. Included in the library.', value: 'none'},
                    {label: 'custom. Custom animation.', value: 'custom'},
                ]);
            function i(o) {
                const l = o.target.value;
                s.value = r.value.findIndex((a) => l === a.value);
            }
            return (o, l) => (
                de(),
                ye(
                    re,
                    null,
                    [
                        x('div', Qa, [
                            x('div', ec, [
                                tc,
                                x(
                                    'select',
                                    {id: 'button-h', value: r.value[s.value].value, onChange: i},
                                    [
                                        (de(!0),
                                        ye(
                                            re,
                                            null,
                                            Rt(
                                                r.value,
                                                (a) => (
                                                    de(),
                                                    ye(
                                                        'option',
                                                        {key: a.value, value: a.value},
                                                        Se(a.label),
                                                        9,
                                                        sc
                                                    )
                                                )
                                            ),
                                            128
                                        )),
                                    ],
                                    40,
                                    nc
                                ),
                            ]),
                        ]),
                        x(
                            'button',
                            {
                                ref_key: 'anchor',
                                ref: n,
                                type: 'button',
                                class: 'my-button',
                                onClick: l[0] || (l[0] = (a) => (t.value = !t.value)),
                            },
                            ' Click me ',
                            512
                        ),
                        q(
                            nt(kt),
                            {anchor: n.value, visible: t.value, animation: r.value[s.value].value},
                            {
                                default: ae(() => [
                                    x('div', rc, [
                                        te(' Dropdown with the '),
                                        x('code', null, Se(r.value[s.value].value), 1),
                                        te(' animation. '),
                                    ]),
                                ]),
                                _: 1,
                            },
                            8,
                            ['anchor', 'visible', 'animation']
                        ),
                    ],
                    64
                )
            );
        },
    }),
    oc = x('div', {class: 'my-form'}, null, -1),
    lc = {class: 'mb-2'},
    ac = x('div', {class: 'my-dropdown'}, [x('p', {class: 'my-2'}, 'Dropdown')], -1),
    cc = Be({
        __name: 'CloseOpenExample',
        setup(e) {
            const t = J(!1),
                n = J(null),
                s = J('Closed');
            function r(l, a, d) {
                t.value = d || a;
            }
            function i() {
                s.value = 'Opened';
            }
            function o() {
                s.value = 'Closed';
            }
            return (l, a) => (
                de(),
                ye(
                    re,
                    null,
                    [
                        oc,
                        x('p', lc, 'Dropdown status: ' + Se(s.value), 1),
                        x(
                            'button',
                            {
                                ref_key: 'anchor',
                                ref: n,
                                type: 'button',
                                class: 'my-button',
                                onClick: a[0] || (a[0] = (d) => (t.value = !t.value)),
                            },
                            ' Show dropdown ',
                            512
                        ),
                        q(
                            nt(kt),
                            {
                                anchor: n.value,
                                visible: t.value,
                                onClickout: r,
                                onOpen: i,
                                onClose: o,
                            },
                            {default: ae(() => [ac]), _: 1},
                            8,
                            ['anchor', 'visible']
                        ),
                    ],
                    64
                )
            );
        },
    }),
    uc = $s(
        '<div class="my-main-cover"><nav class="fixed left-0 top-0 z-50 w-full"><div class="container flex justify-between p-2"><ul class="flex list-none space-x-6"><li><a href="#requirements" class="hover:underline">Requirements</a></li><li><a href="#usage" class="hover:underline">Usage</a></li><li><a href="#properties-events" class="hover:underline">Properties &amp; Events</a></li><li><a href="#examples" class="hover:underline">Examples</a></li></ul></div></nav><img src="' +
            ya +
            '" alt="vue logo" class="size-2/4"><p class="text-center">A powerful and customizable dropdown for Vue.js</p><footer class="fixed left-0 top-[calc(100vh-48px)] flex h-[48px] w-full bg-primary px-2 text-white"><ul class="container m-0 flex list-none items-center gap-8 text-center align-middle"><li><a href="https://github.com/davidnotplay" target="_blank" class="hover:underline"> Developed by <b>@davidnotplay</b></a></li><li><a href="https://github.com/davidnotplay/vue-my-dropdown" target="_blank" class="hover:underline"> Star this Repo </a></li><li><a href="https://github.com/davidnotplay" target="_blank" class="hover:underline"> Follow on GitHub </a></li></ul></footer></div>',
        1
    ),
    fc = {class: 'my-content'},
    dc = {class: 'my-main-section'},
    pc = x(
        'section',
        {class: 'pb-8'},
        [
            x('h1', {id: 'requirements'}, 'Requirements'),
            x('p', null, [
                te(' To use '),
                x('code', null, 'vue-my-dropdown'),
                te(', your project must meet the following requirements: '),
            ]),
            x('ul', {class: 'ml-6 list-disc'}, [
                x('li', null, [te('Vue.js version '), x('code', null, '>= 3.3'), te('.')]),
            ]),
        ],
        -1
    ),
    hc = {class: 'pb-8'},
    gc = x('h1', {id: 'usage'}, 'Usage', -1),
    mc = x(
        'p',
        null,
        [
            te(' Follow these steps to install and start using the '),
            x('code', null, 'vue-my-dropdown'),
            te(' library in your project: '),
        ],
        -1
    ),
    vc = x('code', null, 'npm', -1),
    yc = x(
        'p',
        null,
        'Now you’re ready to integrate dropdowns into your Vue components with ease!',
        -1
    ),
    bc = $s(
        '<section class="pb-8"><h1 id="properties-events">Properties and events</h1><table class="min-w-full table-auto border-collapse border border-table-border-color"><thead class="border-b border-table-border-color bg-gray-100"><tr><th class="px-4 py-2 text-left font-semibold text-gray-700"> Property/Event </th><th class="px-4 py-2 text-left font-semibold text-gray-700"> Possible Values </th><th class="px-4 py-2 text-left font-semibold text-gray-700"> Description </th></tr></thead><tbody class="divide-y divide-gray-300"><tr><td class="px-4 py-2 text-gray-600"><code>visible</code></td><td class="px-4 py-2 text-gray-600">true / false</td><td class="px-4 py-2 text-gray-600"> Controls the visibility of the dropdown. Use it to programmatically show or hide the dropdown. </td></tr><tr><td class="px-4 py-2 text-gray-600"><code>anchor</code></td><td class="px-4 py-2 text-gray-600">Any HTML element</td><td class="px-4 py-2 text-gray-600"> Specifies the element to which the dropdown is anchored. Ensures consistent positioning relative to the anchor, even if it moves or resizes. </td></tr><tr><td class="px-4 py-2 text-gray-600"><code>position</code></td><td class="px-4 py-2 text-gray-600"><code>[&#39;left&#39;, &#39;top&#39;, &#39;right&#39;, &#39;bottom&#39;]</code></td><td class="px-4 py-2 text-gray-600"> Defines how the dropdown aligns relative to its anchor. For example, <code>[&#39;right&#39;, &#39;top&#39;]</code> places the dropdown to the right of the anchor and aligns it at the top. </td></tr><tr><td class="px-4 py-2 text-gray-600"><code>animation</code></td><td class="px-4 py-2 text-gray-600"><code>&#39;fade&#39;</code>, <code>&#39;slide&#39;</code>, custom CSS animations </td><td class="px-4 py-2 text-gray-600"> Specifies the animation used for opening and closing the dropdown. Default animations include fade and slide transitions, or you can define custom ones. </td></tr><tr><td class="px-4 py-2 text-gray-600"><code>clickout</code></td><td class="px-4 py-2 text-gray-600">Event</td><td class="px-4 py-2 text-gray-600"> Triggers when the user clicks outside the dropdown or its anchor. Provides two flags: <code>clickedInDropdown</code> and <code>clickedInAnchor</code> to manage visibility logic. </td></tr><tr><td class="px-4 py-2 text-gray-600"><code>open</code> / <code>close</code></td><td class="px-4 py-2 text-gray-600">Event</td><td class="px-4 py-2 text-gray-600"> Fires when the dropdown opens or closes, respectively. Use these events for custom logic, such as fetching data on open or cleaning up resources on close. </td></tr></tbody></table></section><h1 id="examples">Examples</h1>',
        2
    ),
    _c = x(
        'p',
        null,
        [
            te(' The '),
            x('code', null, 'clickout'),
            te(
                ' event is triggered whenever the user clicks anywhere on the screen. This event provides two flags: '
            ),
        ],
        -1
    ),
    xc = x(
        'ul',
        null,
        [
            x('li', null, [
                x('code', null, 'clickedInDropdown'),
                te(': Indicates if the user clicked inside the dropdown. '),
            ]),
            x('li', null, [
                x('code', null, 'clickedInAnchor'),
                te(': Indicates if the user clicked on the anchor element. '),
            ]),
        ],
        -1
    ),
    wc = x(
        'p',
        null,
        ' These flags allow you to precisely determine the click location and handle visibility logic. For example, you can use this event to hide the dropdown when the user clicks outside both the dropdown and the anchor. ',
        -1
    ),
    Ac = x(
        'p',
        null,
        [
            te(' The '),
            x('code', null, 'anchor'),
            te(
                ' property specifies the HTML element to which the dropdown is anchored. This allows the dropdown to dynamically position itself relative to the anchor element. '
            ),
        ],
        -1
    ),
    Ec = x(
        'p',
        null,
        ' For instance, you can anchor the dropdown to a button or any other element to maintain consistent positioning, even when the element moves or resizes. ',
        -1
    ),
    Sc = x(
        'p',
        null,
        " The position property defines how the dropdown aligns relative to its anchor. You can specify the horizontal (e.g., 'left', 'center', 'right') and vertical (e.g., 'top', 'center', 'bottom') alignment. ",
        -1
    ),
    Fc = x(
        'p',
        null,
        [
            te(' For example, the configuration '),
            x('code', null, "['right', 'top', 'left', 'top']"),
            te(
                ' will place the dropdown to the right of the anchor and then adjust as needed for different screen sizes or anchor states. '
            ),
        ],
        -1
    ),
    Cc = x(
        'p',
        null,
        " The animation property allows you to customize the opening and closing transitions of the dropdown. You can use predefined transitions such as 'fade', 'slide', or create your own by defining CSS animations. ",
        -1
    ),
    $c = x(
        'p',
        null,
        ' For instance, the example here demonstrates a custom animation where the dropdown expands and collapses with a smooth transition. ',
        -1
    ),
    Tc = x(
        'p',
        null,
        [
            te(' The dropdown emits '),
            x('code', null, 'open'),
            te(' and '),
            x('code', null, 'close'),
            te(
                " events whenever its visibility changes. These events can be used to track the dropdown's state or trigger additional actions in your application. "
            ),
        ],
        -1
    ),
    kc = x(
        'p',
        null,
        [
            te(' For example, you can use the '),
            x('code', null, 'open'),
            te(' event to load data dynamically or the '),
            x('code', null, 'close'),
            te(' event to clean up resources. '),
        ],
        -1
    ),
    Pc = $s(
        '<ul><li><a href="#requirements" class="my-menu-link">Requirements</a></li><li><a href="#usage" class="my-menu-link">Usage</a></li><li><a href="#properties-events" class="my-menu-link">Properties and Events</a></li><li><a href="#examples" class="my-menu-link">Examples</a></li><ul><li><a href="#basic-example" class="my-menu-link">Basic Example</a></li><li><a href="#clickout-example" class="my-menu-link">Clickout Example</a></li><li><a href="#anchor-example" class="my-menu-link">Anchor Example</a></li><li><a href="#position-example" class="my-menu-link">Position Example</a></li><li><a href="#animation-example" class="my-menu-link">Animation Example</a></li><li><a href="#close-and-open-event-example" class="my-menu-link"> Close/Open Events Example </a></li></ul></ul>',
        1
    ),
    Oc = [Pc],
    Ic = Be({
        __name: 'App',
        setup(e) {
            const t = J(''),
                n = J(''),
                s = J(''),
                r = J(''),
                i = J(''),
                o = J(''),
                l = J(''),
                a = J(null);
            $t(async () => {
                const f = [
                    {url: 'examples/install.js', state: t},
                    {url: 'examples/BasicExample.vue', state: n},
                    {url: 'examples/ClickoutExample.vue', state: s},
                    {url: 'examples/PositionExample.vue', state: r},
                    {url: 'examples/AnchorExample.vue', state: i},
                    {url: 'examples/AnimationExample.vue', state: o},
                    {url: 'examples/CloseOpenExample.vue', state: l},
                ];
                for (const {url: h, state: b} of f) b.value = await (await fetch(`${h}`)).text();
            });
            function d() {
                var f;
                a.value &&
                    ((a.value.style.position = 'static'),
                    (a.value.style.top = 'auto'),
                    ((f = a.value) == null ? void 0 : f.getBoundingClientRect().top) < 0 &&
                        ((a.value.style.position = 'fixed'), (a.value.style.top = '0px')));
            }
            return (
                $t(() => {
                    window.document.addEventListener('scroll', d);
                }),
                Xt(() => {
                    window.document.removeEventListener('scroll', d);
                }),
                (f, h) => (
                    de(),
                    ye(
                        re,
                        null,
                        [
                            uc,
                            x('div', fc, [
                                x('div', dc, [
                                    pc,
                                    x('section', hc, [
                                        gc,
                                        mc,
                                        x('p', null, [
                                            te(' Use '),
                                            vc,
                                            te(' to install the library: '),
                                            q(cs, {
                                                language: 'shell',
                                                code: 'npm install --save vue-my-dropdown',
                                            }),
                                        ]),
                                        x('p', null, [
                                            te(
                                                ' Import the library into your project and register it as a component: '
                                            ),
                                            q(
                                                cs,
                                                {code: t.value, language: 'javascript'},
                                                null,
                                                8,
                                                ['code']
                                            ),
                                        ]),
                                        yc,
                                    ]),
                                    bc,
                                    q(
                                        wt,
                                        {
                                            title: 'Basic example',
                                            language: 'javascript',
                                            code: n.value,
                                        },
                                        {default: ae(() => [q(ka)]), _: 1},
                                        8,
                                        ['code']
                                    ),
                                    q(
                                        wt,
                                        {
                                            title: 'Clickout example',
                                            language: 'javascript',
                                            code: s.value,
                                        },
                                        {
                                            description: ae(() => [_c, xc, wc]),
                                            default: ae(() => [q(Oa)]),
                                            _: 1,
                                        },
                                        8,
                                        ['code']
                                    ),
                                    q(
                                        wt,
                                        {
                                            title: 'Anchor example',
                                            language: 'javascript',
                                            code: i.value,
                                        },
                                        {
                                            description: ae(() => [Ac, Ec]),
                                            default: ae(() => [q(Ja)]),
                                            _: 1,
                                        },
                                        8,
                                        ['code']
                                    ),
                                    q(
                                        wt,
                                        {
                                            title: 'Position example',
                                            language: 'javascript',
                                            code: r.value,
                                        },
                                        {
                                            description: ae(() => [Sc, Fc]),
                                            default: ae(() => [q(Wa)]),
                                            _: 1,
                                        },
                                        8,
                                        ['code']
                                    ),
                                    q(
                                        wt,
                                        {
                                            title: 'Animation example',
                                            language: 'javascript',
                                            code: o.value,
                                        },
                                        {
                                            description: ae(() => [Cc, $c]),
                                            default: ae(() => [q(ic)]),
                                            _: 1,
                                        },
                                        8,
                                        ['code']
                                    ),
                                    q(
                                        wt,
                                        {
                                            title: 'Close and open event example',
                                            language: 'javascript',
                                            code: l.value,
                                        },
                                        {
                                            description: ae(() => [Tc, kc]),
                                            default: ae(() => [q(cc)]),
                                            _: 1,
                                        },
                                        8,
                                        ['code']
                                    ),
                                ]),
                                x('div', null, [
                                    x(
                                        'nav',
                                        {ref_key: 'navMenuElement', ref: a, class: 'my-menu mb-8'},
                                        Oc,
                                        512
                                    ),
                                ]),
                            ]),
                        ],
                        64
                    )
                )
            );
        },
    });
ga(Ic).mount('#app');
