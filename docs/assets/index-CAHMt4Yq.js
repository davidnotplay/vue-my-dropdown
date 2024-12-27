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
 **/ function $i(e, t) {
    const n = new Set(e.split(','));
    return (s) => n.has(s);
}
const Ti = () => {},
    ki = Object.prototype.hasOwnProperty,
    dn = (e, t) => ki.call(e, t),
    pt = Array.isArray,
    ln = (e) => vr(e) === '[object Map]',
    Pi = (e) => typeof e == 'function',
    Oi = (e) => typeof e == 'string',
    yn = (e) => typeof e == 'symbol',
    bn = (e) => e !== null && typeof e == 'object',
    Ii = Object.prototype.toString,
    vr = (e) => Ii.call(e),
    Li = (e) => vr(e).slice(8, -1),
    cs = (e) => Oi(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e,
    $t = (e, t) => !Object.is(e, t),
    Ri = (e, t, n) => {
        Object.defineProperty(e, t, {configurable: !0, enumerable: !1, value: n});
    };
/**
 * @vue/reactivity v3.4.19
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let Pe;
class Mi {
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
function Ni(e, t = Pe) {
    t && t.active && t.effects.push(e);
}
function Di() {
    return Pe;
}
let ht;
class us {
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
            Ni(this, r);
    }
    get dirty() {
        if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
            (this._dirtyLevel = 1), vt();
            for (let t = 0; t < this._depsLength; t++) {
                const n = this.deps[t];
                if (n.computed && (ji(n.computed), this._dirtyLevel >= 4)) break;
            }
            this._dirtyLevel === 1 && (this._dirtyLevel = 0), yt();
        }
        return this._dirtyLevel >= 4;
    }
    set dirty(t) {
        this._dirtyLevel = t ? 4 : 0;
    }
    run() {
        if (((this._dirtyLevel = 0), !this.active)) return this.fn();
        let t = Qe,
            n = ht;
        try {
            return (Qe = !0), (ht = this), this._runnings++, Is(this), this.fn();
        } finally {
            Ls(this), this._runnings--, (ht = n), (Qe = t);
        }
    }
    stop() {
        var t;
        this.active &&
            (Is(this), Ls(this), (t = this.onStop) == null || t.call(this), (this.active = !1));
    }
}
function ji(e) {
    return e.value;
}
function Is(e) {
    e._trackId++, (e._depsLength = 0);
}
function Ls(e) {
    if (e.deps.length > e._depsLength) {
        for (let t = e._depsLength; t < e.deps.length; t++) yr(e.deps[t], e);
        e.deps.length = e._depsLength;
    }
}
function yr(e, t) {
    const n = e.get(t);
    n !== void 0 && t._trackId !== n && (e.delete(t), e.size === 0 && e.cleanup());
}
let Qe = !0,
    Un = 0;
const br = [];
function vt() {
    br.push(Qe), (Qe = !1);
}
function yt() {
    const e = br.pop();
    Qe = e === void 0 ? !0 : e;
}
function fs() {
    Un++;
}
function ds() {
    for (Un--; !Un && zn.length; ) zn.shift()();
}
function _r(e, t, n) {
    if (t.get(e) !== e._trackId) {
        t.set(e, e._trackId);
        const s = e.deps[e._depsLength];
        s !== t ? (s && yr(s, e), (e.deps[e._depsLength++] = t)) : e._depsLength++;
    }
}
const zn = [];
function xr(e, t, n) {
    fs();
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
                    ((s._shouldSchedule = !1), s.scheduler && zn.push(s.scheduler)));
    }
    ds();
}
const wr = (e, t) => {
        const n = new Map();
        return (n.cleanup = e), (n.computed = t), n;
    },
    Vn = new WeakMap(),
    gt = Symbol(''),
    Gn = Symbol('');
function _e(e, t, n) {
    if (Qe && ht) {
        let s = Vn.get(e);
        s || Vn.set(e, (s = new Map()));
        let r = s.get(n);
        r || s.set(n, (r = wr(() => s.delete(n)))), _r(ht, r);
    }
}
function Ve(e, t, n, s, r, i) {
    const o = Vn.get(e);
    if (!o) return;
    let l = [];
    if (t === 'clear') l = [...o.values()];
    else if (n === 'length' && pt(e)) {
        const a = Number(s);
        o.forEach((d, f) => {
            (f === 'length' || (!yn(f) && f >= a)) && l.push(d);
        });
    } else
        switch ((n !== void 0 && l.push(o.get(n)), t)) {
            case 'add':
                pt(e)
                    ? cs(n) && l.push(o.get('length'))
                    : (l.push(o.get(gt)), ln(e) && l.push(o.get(Gn)));
                break;
            case 'delete':
                pt(e) || (l.push(o.get(gt)), ln(e) && l.push(o.get(Gn)));
                break;
            case 'set':
                ln(e) && l.push(o.get(gt));
                break;
        }
    fs();
    for (const a of l) a && xr(a, 4);
    ds();
}
const Hi = $i('__proto__,__v_isRef,__isVue'),
    Ar = new Set(
        Object.getOwnPropertyNames(Symbol)
            .filter((e) => e !== 'arguments' && e !== 'caller')
            .map((e) => Symbol[e])
            .filter(yn)
    ),
    Rs = Bi();
function Bi() {
    const e = {};
    return (
        ['includes', 'indexOf', 'lastIndexOf'].forEach((t) => {
            e[t] = function (...n) {
                const s = Y(this);
                for (let i = 0, o = this.length; i < o; i++) _e(s, 'get', i + '');
                const r = s[t](...n);
                return r === -1 || r === !1 ? s[t](...n.map(Y)) : r;
            };
        }),
        ['push', 'pop', 'shift', 'unshift', 'splice'].forEach((t) => {
            e[t] = function (...n) {
                vt(), fs();
                const s = Y(this)[t].apply(this, n);
                return ds(), yt(), s;
            };
        }),
        e
    );
}
function Ui(e) {
    const t = Y(this);
    return _e(t, 'has', e), t.hasOwnProperty(e);
}
class Er {
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
            return s === (r ? (i ? to : $r) : i ? Cr : Fr).get(t) ||
                Object.getPrototypeOf(t) === Object.getPrototypeOf(s)
                ? t
                : void 0;
        const o = pt(t);
        if (!r) {
            if (o && dn(Rs, n)) return Reflect.get(Rs, n, s);
            if (n === 'hasOwnProperty') return Ui;
        }
        const l = Reflect.get(t, n, s);
        return (yn(n) ? Ar.has(n) : Hi(n)) || (r || _e(t, 'get', n), i)
            ? l
            : xe(l)
              ? o && cs(n)
                  ? l
                  : l.value
              : bn(l)
                ? r
                    ? Tr(l)
                    : gs(l)
                : l;
    }
}
class Sr extends Er {
    constructor(t = !1) {
        super(!1, t);
    }
    set(t, n, s, r) {
        let i = t[n];
        if (!this._shallow) {
            const a = St(i);
            if ((!pn(s) && !St(s) && ((i = Y(i)), (s = Y(s))), !pt(t) && xe(i) && !xe(s)))
                return a ? !1 : ((i.value = s), !0);
        }
        const o = pt(t) && cs(n) ? Number(n) < t.length : dn(t, n),
            l = Reflect.set(t, n, s, r);
        return t === Y(r) && (o ? $t(s, i) && Ve(t, 'set', n, s) : Ve(t, 'add', n, s)), l;
    }
    deleteProperty(t, n) {
        const s = dn(t, n);
        t[n];
        const r = Reflect.deleteProperty(t, n);
        return r && s && Ve(t, 'delete', n, void 0), r;
    }
    has(t, n) {
        const s = Reflect.has(t, n);
        return (!yn(n) || !Ar.has(n)) && _e(t, 'has', n), s;
    }
    ownKeys(t) {
        return _e(t, 'iterate', pt(t) ? 'length' : gt), Reflect.ownKeys(t);
    }
}
class zi extends Er {
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
const Vi = new Sr(),
    Gi = new zi(),
    Ki = new Sr(!0),
    ps = (e) => e,
    _n = (e) => Reflect.getPrototypeOf(e);
function Qt(e, t, n = !1, s = !1) {
    e = e.__v_raw;
    const r = Y(e),
        i = Y(t);
    n || ($t(t, i) && _e(r, 'get', t), _e(r, 'get', i));
    const {has: o} = _n(r),
        l = s ? ps : n ? vs : zt;
    if (o.call(r, t)) return l(e.get(t));
    if (o.call(r, i)) return l(e.get(i));
    e !== r && e.get(t);
}
function en(e, t = !1) {
    const n = this.__v_raw,
        s = Y(n),
        r = Y(e);
    return (
        t || ($t(e, r) && _e(s, 'has', e), _e(s, 'has', r)),
        e === r ? n.has(e) : n.has(e) || n.has(r)
    );
}
function tn(e, t = !1) {
    return (e = e.__v_raw), !t && _e(Y(e), 'iterate', gt), Reflect.get(e, 'size', e);
}
function Ms(e) {
    e = Y(e);
    const t = Y(this);
    return _n(t).has.call(t, e) || (t.add(e), Ve(t, 'add', e, e)), this;
}
function Ns(e, t) {
    t = Y(t);
    const n = Y(this),
        {has: s, get: r} = _n(n);
    let i = s.call(n, e);
    i || ((e = Y(e)), (i = s.call(n, e)));
    const o = r.call(n, e);
    return n.set(e, t), i ? $t(t, o) && Ve(n, 'set', e, t) : Ve(n, 'add', e, t), this;
}
function Ds(e) {
    const t = Y(this),
        {has: n, get: s} = _n(t);
    let r = n.call(t, e);
    r || ((e = Y(e)), (r = n.call(t, e))), s && s.call(t, e);
    const i = t.delete(e);
    return r && Ve(t, 'delete', e, void 0), i;
}
function js() {
    const e = Y(this),
        t = e.size !== 0,
        n = e.clear();
    return t && Ve(e, 'clear', void 0, void 0), n;
}
function nn(e, t) {
    return function (s, r) {
        const i = this,
            o = i.__v_raw,
            l = Y(o),
            a = t ? ps : e ? vs : zt;
        return !e && _e(l, 'iterate', gt), o.forEach((d, f) => s.call(r, a(d), a(f), i));
    };
}
function sn(e, t, n) {
    return function (...s) {
        const r = this.__v_raw,
            i = Y(r),
            o = ln(i),
            l = e === 'entries' || (e === Symbol.iterator && o),
            a = e === 'keys' && o,
            d = r[e](...s),
            f = n ? ps : t ? vs : zt;
        return (
            !t && _e(i, 'iterate', a ? Gn : gt),
            {
                next() {
                    const {value: h, done: x} = d.next();
                    return x
                        ? {value: h, done: x}
                        : {value: l ? [f(h[0]), f(h[1])] : f(h), done: x};
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
function qi() {
    const e = {
            get(i) {
                return Qt(this, i);
            },
            get size() {
                return tn(this);
            },
            has: en,
            add: Ms,
            set: Ns,
            delete: Ds,
            clear: js,
            forEach: nn(!1, !1),
        },
        t = {
            get(i) {
                return Qt(this, i, !1, !0);
            },
            get size() {
                return tn(this);
            },
            has: en,
            add: Ms,
            set: Ns,
            delete: Ds,
            clear: js,
            forEach: nn(!1, !0),
        },
        n = {
            get(i) {
                return Qt(this, i, !0);
            },
            get size() {
                return tn(this, !0);
            },
            has(i) {
                return en.call(this, i, !0);
            },
            add: Ke('add'),
            set: Ke('set'),
            delete: Ke('delete'),
            clear: Ke('clear'),
            forEach: nn(!0, !1),
        },
        s = {
            get(i) {
                return Qt(this, i, !0, !0);
            },
            get size() {
                return tn(this, !0);
            },
            has(i) {
                return en.call(this, i, !0);
            },
            add: Ke('add'),
            set: Ke('set'),
            delete: Ke('delete'),
            clear: Ke('clear'),
            forEach: nn(!0, !0),
        };
    return (
        ['keys', 'values', 'entries', Symbol.iterator].forEach((i) => {
            (e[i] = sn(i, !1, !1)),
                (n[i] = sn(i, !0, !1)),
                (t[i] = sn(i, !1, !0)),
                (s[i] = sn(i, !0, !0));
        }),
        [e, n, t, s]
    );
}
const [Wi, Yi, Xi, Zi] = qi();
function hs(e, t) {
    const n = t ? (e ? Zi : Xi) : e ? Yi : Wi;
    return (s, r, i) =>
        r === '__v_isReactive'
            ? !e
            : r === '__v_isReadonly'
              ? e
              : r === '__v_raw'
                ? s
                : Reflect.get(dn(n, r) && r in s ? n : s, r, i);
}
const Ji = {get: hs(!1, !1)},
    Qi = {get: hs(!1, !0)},
    eo = {get: hs(!0, !1)},
    Fr = new WeakMap(),
    Cr = new WeakMap(),
    $r = new WeakMap(),
    to = new WeakMap();
function no(e) {
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
function so(e) {
    return e.__v_skip || !Object.isExtensible(e) ? 0 : no(Li(e));
}
function gs(e) {
    return St(e) ? e : ms(e, !1, Vi, Ji, Fr);
}
function ro(e) {
    return ms(e, !1, Ki, Qi, Cr);
}
function Tr(e) {
    return ms(e, !0, Gi, eo, $r);
}
function ms(e, t, n, s, r) {
    if (!bn(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
    const i = r.get(e);
    if (i) return i;
    const o = so(e);
    if (o === 0) return e;
    const l = new Proxy(e, o === 2 ? s : n);
    return r.set(e, l), l;
}
function wt(e) {
    return St(e) ? wt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function St(e) {
    return !!(e && e.__v_isReadonly);
}
function pn(e) {
    return !!(e && e.__v_isShallow);
}
function kr(e) {
    return wt(e) || St(e);
}
function Y(e) {
    const t = e && e.__v_raw;
    return t ? Y(t) : e;
}
function Pr(e) {
    return Object.isExtensible(e) && Ri(e, '__v_skip', !0), e;
}
const zt = (e) => (bn(e) ? gs(e) : e),
    vs = (e) => (bn(e) ? Tr(e) : e);
class Or {
    constructor(t, n, s, r) {
        (this._setter = n),
            (this.dep = void 0),
            (this.__v_isRef = !0),
            (this.__v_isReadonly = !1),
            (this.effect = new us(
                () => t(this._value),
                () => an(this, this.effect._dirtyLevel === 2 ? 2 : 3)
            )),
            (this.effect.computed = this),
            (this.effect.active = this._cacheable = !r),
            (this.__v_isReadonly = s);
    }
    get value() {
        const t = Y(this);
        return (
            (!t._cacheable || t.effect.dirty) &&
                $t(t._value, (t._value = t.effect.run())) &&
                an(t, 4),
            Ir(t),
            t.effect._dirtyLevel >= 2 && an(t, 2),
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
function io(e, t, n = !1) {
    let s, r;
    const i = Pi(e);
    return i ? ((s = e), (r = Ti)) : ((s = e.get), (r = e.set)), new Or(s, r, i || !r, n);
}
function Ir(e) {
    var t;
    Qe &&
        ht &&
        ((e = Y(e)),
        _r(
            ht,
            (t = e.dep) != null
                ? t
                : (e.dep = wr(() => (e.dep = void 0), e instanceof Or ? e : void 0))
        ));
}
function an(e, t = 4, n) {
    e = Y(e);
    const s = e.dep;
    s && xr(s, t);
}
function xe(e) {
    return !!(e && e.__v_isRef === !0);
}
function J(e) {
    return oo(e, !1);
}
function oo(e, t) {
    return xe(e) ? e : new lo(e, t);
}
class lo {
    constructor(t, n) {
        (this.__v_isShallow = n),
            (this.dep = void 0),
            (this.__v_isRef = !0),
            (this._rawValue = n ? t : Y(t)),
            (this._value = n ? t : zt(t));
    }
    get value() {
        return Ir(this), this._value;
    }
    set value(t) {
        const n = this.__v_isShallow || pn(t) || St(t);
        (t = n ? t : Y(t)),
            $t(t, this._rawValue) &&
                ((this._rawValue = t), (this._value = n ? t : zt(t)), an(this, 4));
    }
}
function nt(e) {
    return xe(e) ? e.value : e;
}
const ao = {
    get: (e, t, n) => nt(Reflect.get(e, t, n)),
    set: (e, t, n, s) => {
        const r = e[t];
        return xe(r) && !xe(n) ? ((r.value = n), !0) : Reflect.set(e, t, n, s);
    },
};
function Lr(e) {
    return wt(e) ? e : new Proxy(e, ao);
}
/**
 * @vue/shared v3.4.19
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function co(e, t) {
    const n = new Set(e.split(','));
    return (s) => n.has(s);
}
const ne = {},
    At = [],
    Oe = () => {},
    uo = () => !1,
    ys = (e) =>
        e.charCodeAt(0) === 111 &&
        e.charCodeAt(1) === 110 &&
        (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
    Rr = (e) => e.startsWith('onUpdate:'),
    we = Object.assign,
    bs = (e, t) => {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
    },
    fo = Object.prototype.hasOwnProperty,
    X = (e, t) => fo.call(e, t),
    K = Array.isArray,
    Mr = (e) => _s(e) === '[object Map]',
    Nr = (e) => _s(e) === '[object Set]',
    V = (e) => typeof e == 'function',
    Ae = (e) => typeof e == 'string',
    Dr = (e) => typeof e == 'symbol',
    le = (e) => e !== null && typeof e == 'object',
    jr = (e) => (le(e) || V(e)) && V(e.then) && V(e.catch),
    Hr = Object.prototype.toString,
    _s = (e) => Hr.call(e),
    Br = (e) => _s(e) === '[object Object]',
    Nt = co(
        ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted'
    ),
    xn = (e) => {
        const t = Object.create(null);
        return (n) => t[n] || (t[n] = e(n));
    },
    po = /-(\w)/g,
    Ft = xn((e) => e.replace(po, (t, n) => (n ? n.toUpperCase() : ''))),
    ho = /\B([A-Z])/g,
    wn = xn((e) => e.replace(ho, '-$1').toLowerCase()),
    go = xn((e) => e.charAt(0).toUpperCase() + e.slice(1)),
    In = xn((e) => (e ? `on${go(e)}` : '')),
    Hs = (e, t) => !Object.is(e, t),
    Ln = (e, t) => {
        for (let n = 0; n < e.length; n++) e[n](t);
    },
    Kn = (e, t, n) => {
        Object.defineProperty(e, t, {configurable: !0, enumerable: !1, value: n});
    },
    mo = (e) => {
        const t = parseFloat(e);
        return isNaN(t) ? e : t;
    };
let Bs;
const Ur = () =>
    Bs ||
    (Bs =
        typeof globalThis < 'u'
            ? globalThis
            : typeof self < 'u'
              ? self
              : typeof window < 'u'
                ? window
                : typeof global < 'u'
                  ? global
                  : {});
function An(e) {
    if (K(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++) {
            const s = e[n],
                r = Ae(s) ? _o(s) : An(s);
            if (r) for (const i in r) t[i] = r[i];
        }
        return t;
    } else if (Ae(e) || le(e)) return e;
}
const vo = /;(?![^(]*\))/g,
    yo = /:([^]+)/,
    bo = /\/\*[^]*?\*\//g;
function _o(e) {
    const t = {};
    return (
        e
            .replace(bo, '')
            .split(vo)
            .forEach((n) => {
                if (n) {
                    const s = n.split(yo);
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
              : K(e) || (le(e) && (e.toString === Hr || !V(e.toString)))
                ? JSON.stringify(e, zr, 2)
                : String(e),
    zr = (e, t) =>
        t && t.__v_isRef
            ? zr(e, t.value)
            : Mr(t)
              ? {
                    [`Map(${t.size})`]: [...t.entries()].reduce(
                        (n, [s, r], i) => ((n[Rn(s, i) + ' =>'] = r), n),
                        {}
                    ),
                }
              : Nr(t)
                ? {[`Set(${t.size})`]: [...t.values()].map((n) => Rn(n))}
                : Dr(t)
                  ? Rn(t)
                  : le(t) && !K(t) && !Br(t)
                    ? String(t)
                    : t,
    Rn = (e, t = '') => {
        var n;
        return Dr(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
    };
/**
 * @vue/runtime-core v3.4.19
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function et(e, t, n, s) {
    try {
        return s ? e(...s) : e();
    } catch (r) {
        En(r, t, n);
    }
}
function $e(e, t, n, s) {
    if (V(e)) {
        const i = et(e, t, n, s);
        return (
            i &&
                jr(i) &&
                i.catch((o) => {
                    En(o, t, n);
                }),
            i
        );
    }
    const r = [];
    for (let i = 0; i < e.length; i++) r.push($e(e[i], t, n, s));
    return r;
}
function En(e, t, n, s = !0) {
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
    xo(e, n, r, s);
}
function xo(e, t, n, s = !0) {
    console.error(e);
}
let Vt = !1,
    qn = !1;
const pe = [];
let De = 0;
const Et = [];
let Ye = null,
    ut = 0;
const Vr = Promise.resolve();
let xs = null;
function Wn(e) {
    const t = xs || Vr;
    return e ? t.then(this ? e.bind(this) : e) : t;
}
function wo(e) {
    let t = De + 1,
        n = pe.length;
    for (; t < n; ) {
        const s = (t + n) >>> 1,
            r = pe[s],
            i = Gt(r);
        i < e || (i === e && r.pre) ? (t = s + 1) : (n = s);
    }
    return t;
}
function ws(e) {
    (!pe.length || !pe.includes(e, Vt && e.allowRecurse ? De + 1 : De)) &&
        (e.id == null ? pe.push(e) : pe.splice(wo(e.id), 0, e), Gr());
}
function Gr() {
    !Vt && !qn && ((qn = !0), (xs = Vr.then(qr)));
}
function Ao(e) {
    const t = pe.indexOf(e);
    t > De && pe.splice(t, 1);
}
function Eo(e) {
    K(e) ? Et.push(...e) : (!Ye || !Ye.includes(e, e.allowRecurse ? ut + 1 : ut)) && Et.push(e),
        Gr();
}
function Us(e, t, n = Vt ? De + 1 : 0) {
    for (; n < pe.length; n++) {
        const s = pe[n];
        if (s && s.pre) {
            if (e && s.id !== e.uid) continue;
            pe.splice(n, 1), n--, s();
        }
    }
}
function Kr(e) {
    if (Et.length) {
        const t = [...new Set(Et)].sort((n, s) => Gt(n) - Gt(s));
        if (((Et.length = 0), Ye)) {
            Ye.push(...t);
            return;
        }
        for (Ye = t, ut = 0; ut < Ye.length; ut++) Ye[ut]();
        (Ye = null), (ut = 0);
    }
}
const Gt = (e) => (e.id == null ? 1 / 0 : e.id),
    So = (e, t) => {
        const n = Gt(e) - Gt(t);
        if (n === 0) {
            if (e.pre && !t.pre) return -1;
            if (t.pre && !e.pre) return 1;
        }
        return n;
    };
function qr(e) {
    (qn = !1), (Vt = !0), pe.sort(So);
    try {
        for (De = 0; De < pe.length; De++) {
            const t = pe[De];
            t && t.active !== !1 && et(t, null, 14);
        }
    } finally {
        (De = 0), (pe.length = 0), Kr(), (Vt = !1), (xs = null), (pe.length || Et.length) && qr();
    }
}
function Fo(e, t, ...n) {
    if (e.isUnmounted) return;
    const s = e.vnode.props || ne;
    let r = n;
    const i = t.startsWith('update:'),
        o = i && t.slice(7);
    if (o && o in s) {
        const f = `${o === 'modelValue' ? 'model' : o}Modifiers`,
            {number: h, trim: x} = s[f] || ne;
        x && (r = n.map((R) => (Ae(R) ? R.trim() : R))), h && (r = n.map(mo));
    }
    let l,
        a = s[(l = In(t))] || s[(l = In(Ft(t)))];
    !a && i && (a = s[(l = In(wn(t)))]), a && $e(a, e, 6, r);
    const d = s[l + 'Once'];
    if (d) {
        if (!e.emitted) e.emitted = {};
        else if (e.emitted[l]) return;
        (e.emitted[l] = !0), $e(d, e, 6, r);
    }
}
function Wr(e, t, n = !1) {
    const s = t.emitsCache,
        r = s.get(e);
    if (r !== void 0) return r;
    const i = e.emits;
    let o = {},
        l = !1;
    if (!V(e)) {
        const a = (d) => {
            const f = Wr(d, t, !0);
            f && ((l = !0), we(o, f));
        };
        !n && t.mixins.length && t.mixins.forEach(a),
            e.extends && a(e.extends),
            e.mixins && e.mixins.forEach(a);
    }
    return !i && !l
        ? (le(e) && s.set(e, null), null)
        : (K(i) ? i.forEach((a) => (o[a] = null)) : we(o, i), le(e) && s.set(e, o), o);
}
function Sn(e, t) {
    return !e || !ys(t)
        ? !1
        : ((t = t.slice(2).replace(/Once$/, '')),
          X(e, t[0].toLowerCase() + t.slice(1)) || X(e, wn(t)) || X(e, t));
}
let ue = null,
    Yr = null;
function hn(e) {
    const t = ue;
    return (ue = e), (Yr = (e && e.type.__scopeId) || null), t;
}
function ae(e, t = ue, n) {
    if (!t || e._n) return e;
    const s = (...r) => {
        s._d && er(-1);
        const i = hn(t);
        let o;
        try {
            o = e(...r);
        } finally {
            hn(i), s._d && er(1);
        }
        return o;
    };
    return (s._n = !0), (s._c = !0), (s._d = !0), s;
}
function zs(e) {
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
        data: x,
        setupState: R,
        ctx: z,
        inheritAttrs: I,
    } = e;
    let N, H;
    const g = hn(e);
    try {
        if (n.shapeFlag & 4) {
            const y = r || s,
                A = y;
            (N = Ne(f.call(A, y, h, i, R, x, z))), (H = a);
        } else {
            const y = t;
            (N = Ne(y.length > 1 ? y(i, {attrs: a, slots: l, emit: d}) : y(i, null))),
                (H = t.props ? a : Co(a));
        }
    } catch (y) {
        (Ut.length = 0), En(y, e, 1), (N = q(He));
    }
    let p = N;
    if (H && I !== !1) {
        const y = Object.keys(H),
            {shapeFlag: A} = p;
        y.length && A & 7 && (o && y.some(Rr) && (H = $o(H, o)), (p = tt(p, H)));
    }
    return (
        n.dirs && ((p = tt(p)), (p.dirs = p.dirs ? p.dirs.concat(n.dirs) : n.dirs)),
        n.transition && (p.transition = n.transition),
        (N = p),
        hn(g),
        N
    );
}
const Co = (e) => {
        let t;
        for (const n in e) (n === 'class' || n === 'style' || ys(n)) && ((t || (t = {}))[n] = e[n]);
        return t;
    },
    $o = (e, t) => {
        const n = {};
        for (const s in e) (!Rr(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
        return n;
    };
function To(e, t, n) {
    const {props: s, children: r, component: i} = e,
        {props: o, children: l, patchFlag: a} = t,
        d = i.emitsOptions;
    if (t.dirs || t.transition) return !0;
    if (n && a >= 0) {
        if (a & 1024) return !0;
        if (a & 16) return s ? Vs(s, o, d) : !!o;
        if (a & 8) {
            const f = t.dynamicProps;
            for (let h = 0; h < f.length; h++) {
                const x = f[h];
                if (o[x] !== s[x] && !Sn(d, x)) return !0;
            }
        }
    } else
        return (r || l) && (!l || !l.$stable)
            ? !0
            : s === o
              ? !1
              : s
                ? o
                    ? Vs(s, o, d)
                    : !0
                : !!o;
    return !1;
}
function Vs(e, t, n) {
    const s = Object.keys(t);
    if (s.length !== Object.keys(e).length) return !0;
    for (let r = 0; r < s.length; r++) {
        const i = s[r];
        if (t[i] !== e[i] && !Sn(n, i)) return !0;
    }
    return !1;
}
function ko({vnode: e, parent: t}, n) {
    for (; t; ) {
        const s = t.subTree;
        if ((s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e))
            ((e = t.vnode).el = n), (t = t.parent);
        else break;
    }
}
const Po = Symbol.for('v-ndc'),
    Oo = (e) => e.__isSuspense;
function Io(e, t) {
    t && t.pendingBranch ? (K(e) ? t.effects.push(...e) : t.effects.push(e)) : Eo(e);
}
const Lo = Symbol.for('v-scx'),
    Ro = () => un(Lo);
function Mo(e, t) {
    return As(e, null, {flush: 'post'});
}
const rn = {};
function cn(e, t, n) {
    return As(e, t, n);
}
function As(e, t, {immediate: n, deep: s, flush: r, once: i, onTrack: o, onTrigger: l} = ne) {
    if (t && i) {
        const v = t;
        t = (...P) => {
            v(...P), A();
        };
    }
    const a = he,
        d = (v) => (s === !0 ? v : dt(v, s === !1 ? 1 : void 0));
    let f,
        h = !1,
        x = !1;
    if (
        (xe(e)
            ? ((f = () => e.value), (h = pn(e)))
            : wt(e)
              ? ((f = () => d(e)), (h = !0))
              : K(e)
                ? ((x = !0),
                  (h = e.some((v) => wt(v) || pn(v))),
                  (f = () =>
                      e.map((v) => {
                          if (xe(v)) return v.value;
                          if (wt(v)) return d(v);
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
        f = () => dt(v());
    }
    let R,
        z = (v) => {
            R = p.onStop = () => {
                et(v, a, 4), (R = p.onStop = void 0);
            };
        },
        I;
    if (kn)
        if (((z = Oe), t ? n && $e(t, a, 3, [f(), x ? [] : void 0, z]) : f(), r === 'sync')) {
            const v = Ro();
            I = v.__watcherHandles || (v.__watcherHandles = []);
        } else return Oe;
    let N = x ? new Array(e.length).fill(rn) : rn;
    const H = () => {
        if (!(!p.active || !p.dirty))
            if (t) {
                const v = p.run();
                (s || h || (x ? v.some((P, $) => Hs(P, N[$])) : Hs(v, N))) &&
                    (R && R(),
                    $e(t, a, 3, [v, N === rn ? void 0 : x && N[0] === rn ? [] : N, z]),
                    (N = v));
            } else p.run();
    };
    H.allowRecurse = !!t;
    let g;
    r === 'sync'
        ? (g = H)
        : r === 'post'
          ? (g = () => be(H, a && a.suspense))
          : ((H.pre = !0), a && (H.id = a.uid), (g = () => ws(H)));
    const p = new us(f, Oe, g),
        y = Di(),
        A = () => {
            p.stop(), y && bs(y.effects, p);
        };
    return (
        t ? (n ? H() : (N = p.run())) : r === 'post' ? be(p.run.bind(p), a && a.suspense) : p.run(),
        I && I.push(A),
        A
    );
}
function No(e, t, n) {
    const s = this.proxy,
        r = Ae(e) ? (e.includes('.') ? Xr(s, e) : () => s[e]) : e.bind(s, s);
    let i;
    V(t) ? (i = t) : ((i = t.handler), (n = t));
    const o = Zt(this),
        l = As(r, i.bind(s), n);
    return o(), l;
}
function Xr(e, t) {
    const n = t.split('.');
    return () => {
        let s = e;
        for (let r = 0; r < n.length && s; r++) s = s[n[r]];
        return s;
    };
}
function dt(e, t, n = 0, s) {
    if (!le(e) || e.__v_skip) return e;
    if (t && t > 0) {
        if (n >= t) return e;
        n++;
    }
    if (((s = s || new Set()), s.has(e))) return e;
    if ((s.add(e), xe(e))) dt(e.value, t, n, s);
    else if (K(e)) for (let r = 0; r < e.length; r++) dt(e[r], t, n, s);
    else if (Nr(e) || Mr(e))
        e.forEach((r) => {
            dt(r, t, n, s);
        });
    else if (Br(e)) for (const r in e) dt(e[r], t, n, s);
    return e;
}
function Zr(e, t) {
    if (ue === null) return e;
    const n = Pn(ue) || ue.proxy,
        s = e.dirs || (e.dirs = []);
    for (let r = 0; r < t.length; r++) {
        let [i, o, l, a = ne] = t[r];
        i &&
            (V(i) && (i = {mounted: i, updated: i}),
            i.deep && dt(o),
            s.push({dir: i, instance: n, value: o, oldValue: void 0, arg: l, modifiers: a}));
    }
    return e;
}
function ot(e, t, n, s) {
    const r = e.dirs,
        i = t && t.dirs;
    for (let o = 0; o < r.length; o++) {
        const l = r[o];
        i && (l.oldValue = i[o].value);
        let a = l.dir[s];
        a && (vt(), $e(a, n, 8, [e.el, l, e, t]), yt());
    }
}
const Xe = Symbol('_leaveCb'),
    on = Symbol('_enterCb');
function Do() {
    const e = {isMounted: !1, isLeaving: !1, isUnmounting: !1, leavingVNodes: new Map()};
    return (
        Ct(() => {
            e.isMounted = !0;
        }),
        ni(() => {
            e.isUnmounting = !0;
        }),
        e
    );
}
const Ce = [Function, Array],
    Jr = {
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
    jo = {
        name: 'BaseTransition',
        props: Jr,
        setup(e, {slots: t}) {
            const n = Cs(),
                s = Do();
            let r;
            return () => {
                const i = t.default && ei(t.default(), !0);
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
                if (s.isLeaving) return Mn(o);
                const d = Gs(o);
                if (!d) return Mn(o);
                const f = Yn(d, l, s, n);
                Xn(d, f);
                const h = n.subTree,
                    x = h && Gs(h);
                let R = !1;
                const {getTransitionKey: z} = d.type;
                if (z) {
                    const I = z();
                    r === void 0 ? (r = I) : I !== r && ((r = I), (R = !0));
                }
                if (x && x.type !== He && (!ft(d, x) || R)) {
                    const I = Yn(x, l, s, n);
                    if ((Xn(x, I), a === 'out-in'))
                        return (
                            (s.isLeaving = !0),
                            (I.afterLeave = () => {
                                (s.isLeaving = !1),
                                    n.update.active !== !1 && ((n.effect.dirty = !0), n.update());
                            }),
                            Mn(o)
                        );
                    a === 'in-out' &&
                        d.type !== He &&
                        (I.delayLeave = (N, H, g) => {
                            const p = Qr(s, x);
                            (p[String(x.key)] = x),
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
    Ho = jo;
function Qr(e, t) {
    const {leavingVNodes: n} = e;
    let s = n.get(t.type);
    return s || ((s = Object.create(null)), n.set(t.type, s)), s;
}
function Yn(e, t, n, s) {
    const {
            appear: r,
            mode: i,
            persisted: o = !1,
            onBeforeEnter: l,
            onEnter: a,
            onAfterEnter: d,
            onEnterCancelled: f,
            onBeforeLeave: h,
            onLeave: x,
            onAfterLeave: R,
            onLeaveCancelled: z,
            onBeforeAppear: I,
            onAppear: N,
            onAfterAppear: H,
            onAppearCancelled: g,
        } = t,
        p = String(e.key),
        y = Qr(n, e),
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
                j && ft(e, j) && j.el[Xe] && j.el[Xe](), A(T, [$]);
            },
            enter($) {
                let T = a,
                    j = d,
                    W = f;
                if (!n.isMounted)
                    if (r) (T = N || a), (j = H || d), (W = g || f);
                    else return;
                let L = !1;
                const Q = ($[on] = (de) => {
                    L ||
                        ((L = !0),
                        de ? A(W, [$]) : A(j, [$]),
                        P.delayedLeave && P.delayedLeave(),
                        ($[on] = void 0));
                });
                T ? v(T, [$, Q]) : Q();
            },
            leave($, T) {
                const j = String(e.key);
                if (($[on] && $[on](!0), n.isUnmounting)) return T();
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
                (y[j] = e), x ? v(x, [$, L]) : L();
            },
            clone($) {
                return Yn($, t, n, s);
            },
        };
    return P;
}
function Mn(e) {
    if (Fn(e)) return (e = tt(e)), (e.children = null), e;
}
function Gs(e) {
    return Fn(e) ? (e.children ? e.children[0] : void 0) : e;
}
function Xn(e, t) {
    e.shapeFlag & 6 && e.component
        ? Xn(e.component.subTree, t)
        : e.shapeFlag & 128
          ? ((e.ssContent.transition = t.clone(e.ssContent)),
            (e.ssFallback.transition = t.clone(e.ssFallback)))
          : (e.transition = t);
}
function ei(e, t = !1, n) {
    let s = [],
        r = 0;
    for (let i = 0; i < e.length; i++) {
        let o = e[i];
        const l = n == null ? o.key : String(n) + String(o.key != null ? o.key : i);
        o.type === se
            ? (o.patchFlag & 128 && r++, (s = s.concat(ei(o.children, t, l))))
            : (t || o.type !== He) && s.push(l != null ? tt(o, {key: l}) : o);
    }
    if (r > 1) for (let i = 0; i < s.length; i++) s[i].patchFlag = -2;
    return s;
}
/*! #__NO_SIDE_EFFECTS__ */ function Be(e, t) {
    return V(e) ? we({name: e.name}, t, {setup: e}) : e;
}
const Dt = (e) => !!e.type.__asyncLoader,
    Fn = (e) => e.type.__isKeepAlive;
function Bo(e, t) {
    ti(e, 'a', t);
}
function Uo(e, t) {
    ti(e, 'da', t);
}
function ti(e, t, n = he) {
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
    if ((Cn(t, s, n), n)) {
        let r = n.parent;
        for (; r && r.parent; ) Fn(r.parent.vnode) && zo(s, t, n, r), (r = r.parent);
    }
}
function zo(e, t, n, s) {
    const r = Cn(t, e, s, !0);
    Xt(() => {
        bs(s[t], r);
    }, n);
}
function Cn(e, t, n = he, s = !1) {
    if (n) {
        const r = n[e] || (n[e] = []),
            i =
                t.__weh ||
                (t.__weh = (...o) => {
                    if (n.isUnmounted) return;
                    vt();
                    const l = Zt(n),
                        a = $e(t, n, e, o);
                    return l(), yt(), a;
                });
        return s ? r.unshift(i) : r.push(i), i;
    }
}
const Ge =
        (e) =>
        (t, n = he) =>
            (!kn || e === 'sp') && Cn(e, (...s) => t(...s), n),
    Vo = Ge('bm'),
    Ct = Ge('m'),
    Go = Ge('bu'),
    Ko = Ge('u'),
    ni = Ge('bum'),
    Xt = Ge('um'),
    qo = Ge('sp'),
    Wo = Ge('rtg'),
    Yo = Ge('rtc');
function Xo(e, t = he) {
    Cn('ec', e, t);
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
function Zn(e, t, n = {}, s, r) {
    if (ue.isCE || (ue.parent && Dt(ue.parent) && ue.parent.isCE))
        return t !== 'default' && (n.name = t), q('slot', n, s);
    let i = e[t];
    i && i._c && (i._d = !1), fe();
    const o = i && si(i(n)),
        l = gi(se, {key: n.key || (o && o.key) || `_${t}`}, o || [], o && e._ === 1 ? 64 : -2);
    return l.scopeId && (l.slotScopeIds = [l.scopeId + '-s']), i && i._c && (i._d = !0), l;
}
function si(e) {
    return e.some((t) => (mn(t) ? !(t.type === He || (t.type === se && !si(t.children))) : !0))
        ? e
        : null;
}
const Jn = (e) => (e ? (vi(e) ? Pn(e) || e.proxy : Jn(e.parent)) : null),
    jt = we(Object.create(null), {
        $: (e) => e,
        $el: (e) => e.vnode.el,
        $data: (e) => e.data,
        $props: (e) => e.props,
        $attrs: (e) => e.attrs,
        $slots: (e) => e.slots,
        $refs: (e) => e.refs,
        $parent: (e) => Jn(e.parent),
        $root: (e) => Jn(e.root),
        $emit: (e) => e.emit,
        $options: (e) => ii(e),
        $forceUpdate: (e) =>
            e.f ||
            (e.f = () => {
                (e.effect.dirty = !0), ws(e.update);
            }),
        $nextTick: (e) => e.n || (e.n = Wn.bind(e.proxy)),
        $watch: (e) => No.bind(e),
    }),
    Nn = (e, t) => e !== ne && !e.__isScriptSetup && X(e, t),
    Zo = {
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
                    if (Nn(s, t)) return (o[t] = 1), s[t];
                    if (r !== ne && X(r, t)) return (o[t] = 2), r[t];
                    if ((d = e.propsOptions[0]) && X(d, t)) return (o[t] = 3), i[t];
                    if (n !== ne && X(n, t)) return (o[t] = 4), n[t];
                    Qn && (o[t] = 0);
                }
            }
            const f = jt[t];
            let h, x;
            if (f) return t === '$attrs' && _e(e, 'get', t), f(e);
            if ((h = l.__cssModules) && (h = h[t])) return h;
            if (n !== ne && X(n, t)) return (o[t] = 4), n[t];
            if (((x = a.config.globalProperties), X(x, t))) return x[t];
        },
        set({_: e}, t, n) {
            const {data: s, setupState: r, ctx: i} = e;
            return Nn(r, t)
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
                Nn(t, o) ||
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
function Jo() {
    return Qo().slots;
}
function Qo() {
    const e = Cs();
    return e.setupContext || (e.setupContext = bi(e));
}
function Ks(e) {
    return K(e) ? e.reduce((t, n) => ((t[n] = null), t), {}) : e;
}
let Qn = !0;
function el(e) {
    const t = ii(e),
        n = e.proxy,
        s = e.ctx;
    (Qn = !1), t.beforeCreate && qs(t.beforeCreate, e, 'bc');
    const {
        data: r,
        computed: i,
        methods: o,
        watch: l,
        provide: a,
        inject: d,
        created: f,
        beforeMount: h,
        mounted: x,
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
        filters: de,
    } = t;
    if ((d && tl(d, s, null), o))
        for (const ee in o) {
            const U = o[ee];
            V(U) && (s[ee] = U.bind(n));
        }
    if (r) {
        const ee = r.call(n, n);
        le(ee) && (e.data = gs(ee));
    }
    if (((Qn = !0), i))
        for (const ee in i) {
            const U = i[ee],
                ce = V(U) ? U.bind(n, n) : V(U.get) ? U.get.bind(n, n) : Oe,
                Te = !V(U) && V(U.set) ? U.set.bind(n) : Oe,
                Fe = mt({get: ce, set: Te});
            Object.defineProperty(s, ee, {
                enumerable: !0,
                configurable: !0,
                get: () => Fe.value,
                set: (ie) => (Fe.value = ie),
            });
        }
    if (l) for (const ee in l) ri(l[ee], s, n, ee);
    if (a) {
        const ee = V(a) ? a.call(n) : a;
        Reflect.ownKeys(ee).forEach((U) => {
            ll(U, ee[U]);
        });
    }
    f && qs(f, e, 'c');
    function oe(ee, U) {
        K(U) ? U.forEach((ce) => ee(ce.bind(n))) : U && ee(U.bind(n));
    }
    if (
        (oe(Vo, h),
        oe(Ct, x),
        oe(Go, R),
        oe(Ko, z),
        oe(Bo, I),
        oe(Uo, N),
        oe(Xo, $),
        oe(Yo, v),
        oe(Wo, P),
        oe(ni, g),
        oe(Xt, y),
        oe(qo, T),
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
function tl(e, t, n = Oe) {
    K(e) && (e = es(e));
    for (const s in e) {
        const r = e[s];
        let i;
        le(r)
            ? 'default' in r
                ? (i = un(r.from || s, r.default, !0))
                : (i = un(r.from || s))
            : (i = un(r)),
            xe(i)
                ? Object.defineProperty(t, s, {
                      enumerable: !0,
                      configurable: !0,
                      get: () => i.value,
                      set: (o) => (i.value = o),
                  })
                : (t[s] = i);
    }
}
function qs(e, t, n) {
    $e(K(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function ri(e, t, n, s) {
    const r = s.includes('.') ? Xr(n, s) : () => n[s];
    if (Ae(e)) {
        const i = t[e];
        V(i) && cn(r, i);
    } else if (V(e)) cn(r, e.bind(n));
    else if (le(e))
        if (K(e)) e.forEach((i) => ri(i, t, n, s));
        else {
            const i = V(e.handler) ? e.handler.bind(n) : t[e.handler];
            V(i) && cn(r, i, e);
        }
}
function ii(e) {
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
              : ((a = {}), r.length && r.forEach((d) => gn(a, d, o, !0)), gn(a, t, o)),
        le(t) && i.set(t, a),
        a
    );
}
function gn(e, t, n, s = !1) {
    const {mixins: r, extends: i} = t;
    i && gn(e, i, n, !0), r && r.forEach((o) => gn(e, o, n, !0));
    for (const o in t)
        if (!(s && o === 'expose')) {
            const l = nl[o] || (n && n[o]);
            e[o] = l ? l(e[o], t[o]) : t[o];
        }
    return e;
}
const nl = {
    data: Ws,
    props: Ys,
    emits: Ys,
    methods: Mt,
    computed: Mt,
    beforeCreate: me,
    created: me,
    beforeMount: me,
    mounted: me,
    beforeUpdate: me,
    updated: me,
    beforeDestroy: me,
    beforeUnmount: me,
    destroyed: me,
    unmounted: me,
    activated: me,
    deactivated: me,
    errorCaptured: me,
    serverPrefetch: me,
    components: Mt,
    directives: Mt,
    watch: rl,
    provide: Ws,
    inject: sl,
};
function Ws(e, t) {
    return t
        ? e
            ? function () {
                  return we(V(e) ? e.call(this, this) : e, V(t) ? t.call(this, this) : t);
              }
            : t
        : e;
}
function sl(e, t) {
    return Mt(es(e), es(t));
}
function es(e) {
    if (K(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
        return t;
    }
    return e;
}
function me(e, t) {
    return e ? [...new Set([].concat(e, t))] : t;
}
function Mt(e, t) {
    return e ? we(Object.create(null), e, t) : t;
}
function Ys(e, t) {
    return e
        ? K(e) && K(t)
            ? [...new Set([...e, ...t])]
            : we(Object.create(null), Ks(e), Ks(t ?? {}))
        : t;
}
function rl(e, t) {
    if (!e) return t;
    if (!t) return e;
    const n = we(Object.create(null), e);
    for (const s in t) n[s] = me(e[s], t[s]);
    return n;
}
function oi() {
    return {
        app: null,
        config: {
            isNativeTag: uo,
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
let il = 0;
function ol(e, t) {
    return function (s, r = null) {
        V(s) || (s = we({}, s)), r != null && !le(r) && (r = null);
        const i = oi(),
            o = new WeakSet();
        let l = !1;
        const a = (i.app = {
            _uid: il++,
            _component: s,
            _props: r,
            _container: null,
            _context: i,
            _instance: null,
            version: kl,
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
                    const x = q(s, r);
                    return (
                        (x.appContext = i),
                        h === !0 ? (h = 'svg') : h === !1 && (h = void 0),
                        e(x, d, h),
                        (l = !0),
                        (a._container = d),
                        (d.__vue_app__ = a),
                        Pn(x.component) || x.component.proxy
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
function ll(e, t) {
    if (he) {
        let n = he.provides;
        const s = he.parent && he.parent.provides;
        s === n && (n = he.provides = Object.create(s)), (n[e] = t);
    }
}
function un(e, t, n = !1) {
    const s = he || ue;
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
function al(e, t, n, s = !1) {
    const r = {},
        i = {};
    Kn(i, Tn, 1), (e.propsDefaults = Object.create(null)), li(e, t, r, i);
    for (const o in e.propsOptions[0]) o in r || (r[o] = void 0);
    n ? (e.props = s ? r : ro(r)) : e.type.props ? (e.props = r) : (e.props = i), (e.attrs = i);
}
function cl(e, t, n, s) {
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
                let x = f[h];
                if (Sn(e.emitsOptions, x)) continue;
                const R = t[x];
                if (a)
                    if (X(i, x)) R !== i[x] && ((i[x] = R), (d = !0));
                    else {
                        const z = Ft(x);
                        r[z] = ts(a, l, z, R, e, !1);
                    }
                else R !== i[x] && ((i[x] = R), (d = !0));
            }
        }
    } else {
        li(e, t, r, i) && (d = !0);
        let f;
        for (const h in l)
            (!t || (!X(t, h) && ((f = wn(h)) === h || !X(t, f)))) &&
                (a
                    ? n &&
                      (n[h] !== void 0 || n[f] !== void 0) &&
                      (r[h] = ts(a, l, h, void 0, e, !0))
                    : delete r[h]);
        if (i !== l) for (const h in i) (!t || !X(t, h)) && (delete i[h], (d = !0));
    }
    d && Ve(e, 'set', '$attrs');
}
function li(e, t, n, s) {
    const [r, i] = e.propsOptions;
    let o = !1,
        l;
    if (t)
        for (let a in t) {
            if (Nt(a)) continue;
            const d = t[a];
            let f;
            r && X(r, (f = Ft(a)))
                ? !i || !i.includes(f)
                    ? (n[f] = d)
                    : ((l || (l = {}))[f] = d)
                : Sn(e.emitsOptions, a) || ((!(a in s) || d !== s[a]) && ((s[a] = d), (o = !0)));
        }
    if (i) {
        const a = Y(n),
            d = l || ne;
        for (let f = 0; f < i.length; f++) {
            const h = i[f];
            n[h] = ts(r, a, h, d[h], e, !X(d, h));
        }
    }
    return o;
}
function ts(e, t, n, s, r, i) {
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
        o[0] && (i && !l ? (s = !1) : o[1] && (s === '' || s === wn(n)) && (s = !0));
    }
    return s;
}
function ai(e, t, n = !1) {
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
            const [x, R] = ai(h, t, !0);
            we(o, x), R && l.push(...R);
        };
        !n && t.mixins.length && t.mixins.forEach(f),
            e.extends && f(e.extends),
            e.mixins && e.mixins.forEach(f);
    }
    if (!i && !a) return le(e) && s.set(e, At), At;
    if (K(i))
        for (let f = 0; f < i.length; f++) {
            const h = Ft(i[f]);
            Xs(h) && (o[h] = ne);
        }
    else if (i)
        for (const f in i) {
            const h = Ft(f);
            if (Xs(h)) {
                const x = i[f],
                    R = (o[h] = K(x) || V(x) ? {type: x} : we({}, x));
                if (R) {
                    const z = Qs(Boolean, R.type),
                        I = Qs(String, R.type);
                    (R[0] = z > -1),
                        (R[1] = I < 0 || z < I),
                        (z > -1 || X(R, 'default')) && l.push(h);
                }
            }
        }
    const d = [o, l];
    return le(e) && s.set(e, d), d;
}
function Xs(e) {
    return e[0] !== '$' && !Nt(e);
}
function Zs(e) {
    return e === null
        ? 'null'
        : typeof e == 'function'
          ? e.name || ''
          : (typeof e == 'object' && e.constructor && e.constructor.name) || '';
}
function Js(e, t) {
    return Zs(e) === Zs(t);
}
function Qs(e, t) {
    return K(t) ? t.findIndex((n) => Js(n, e)) : V(t) && Js(t, e) ? 0 : -1;
}
const ci = (e) => e[0] === '_' || e === '$stable',
    Es = (e) => (K(e) ? e.map(Ne) : [Ne(e)]),
    ul = (e, t, n) => {
        if (t._n) return t;
        const s = ae((...r) => Es(t(...r)), n);
        return (s._c = !1), s;
    },
    ui = (e, t, n) => {
        const s = e._ctx;
        for (const r in e) {
            if (ci(r)) continue;
            const i = e[r];
            if (V(i)) t[r] = ul(r, i, s);
            else if (i != null) {
                const o = Es(i);
                t[r] = () => o;
            }
        }
    },
    fi = (e, t) => {
        const n = Es(t);
        e.slots.default = () => n;
    },
    fl = (e, t) => {
        if (e.vnode.shapeFlag & 32) {
            const n = t._;
            n ? ((e.slots = Y(t)), Kn(t, '_', n)) : ui(t, (e.slots = {}));
        } else (e.slots = {}), t && fi(e, t);
        Kn(e.slots, Tn, 1);
    },
    dl = (e, t, n) => {
        const {vnode: s, slots: r} = e;
        let i = !0,
            o = ne;
        if (s.shapeFlag & 32) {
            const l = t._;
            l
                ? n && l === 1
                    ? (i = !1)
                    : (we(r, t), !n && l === 1 && delete r._)
                : ((i = !t.$stable), ui(t, r)),
                (o = t);
        } else t && (fi(e, t), (o = {default: 1}));
        if (i) for (const l in r) !ci(l) && o[l] == null && delete r[l];
    };
function ns(e, t, n, s, r = !1) {
    if (K(e)) {
        e.forEach((x, R) => ns(x, t && (K(t) ? t[R] : t), n, s, r));
        return;
    }
    if (Dt(s) && !r) return;
    const i = s.shapeFlag & 4 ? Pn(s.component) || s.component.proxy : s.el,
        o = r ? null : i,
        {i: l, r: a} = e,
        d = t && t.r,
        f = l.refs === ne ? (l.refs = {}) : l.refs,
        h = l.setupState;
    if (
        (d != null &&
            d !== a &&
            (Ae(d) ? ((f[d] = null), X(h, d) && (h[d] = null)) : xe(d) && (d.value = null)),
        V(a))
    )
        et(a, l, 12, [o, f]);
    else {
        const x = Ae(a),
            R = xe(a);
        if (x || R) {
            const z = () => {
                if (e.f) {
                    const I = x ? (X(h, a) ? h[a] : f[a]) : a.value;
                    r
                        ? K(I) && bs(I, i)
                        : K(I)
                          ? I.includes(i) || I.push(i)
                          : x
                            ? ((f[a] = [i]), X(h, a) && (h[a] = f[a]))
                            : ((a.value = [i]), e.k && (f[e.k] = a.value));
                } else
                    x
                        ? ((f[a] = o), X(h, a) && (h[a] = o))
                        : R && ((a.value = o), e.k && (f[e.k] = o));
            };
            o ? ((z.id = -1), be(z, n)) : z();
        }
    }
}
const be = Io;
function pl(e) {
    return hl(e);
}
function hl(e, t) {
    const n = Ur();
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
            nextSibling: x,
            setScopeId: R = Oe,
            insertStaticContent: z,
        } = e,
        I = (
            c,
            u,
            m,
            b = null,
            w = null,
            F = null,
            k = void 0,
            S = null,
            C = !!u.dynamicChildren
        ) => {
            if (c === u) return;
            c && !ft(c, u) && ((b = Ue(c)), ie(c, w, F, !0), (c = null)),
                u.patchFlag === -2 && ((C = !1), (u.dynamicChildren = null));
            const {type: E, ref: O, shapeFlag: D} = u;
            switch (E) {
                case $n:
                    N(c, u, m, b);
                    break;
                case He:
                    H(c, u, m, b);
                    break;
                case Bt:
                    c == null && g(u, m, b, k);
                    break;
                case se:
                    L(c, u, m, b, w, F, k, S, C);
                    break;
                default:
                    D & 1
                        ? A(c, u, m, b, w, F, k, S, C)
                        : D & 6
                          ? Q(c, u, m, b, w, F, k, S, C)
                          : (D & 64 || D & 128) && E.process(c, u, m, b, w, F, k, S, C, ze);
            }
            O != null && w && ns(O, c && c.ref, F, u || c, !u);
        },
        N = (c, u, m, b) => {
            if (c == null) s((u.el = l(u.children)), m, b);
            else {
                const w = (u.el = c.el);
                u.children !== c.children && d(w, u.children);
            }
        },
        H = (c, u, m, b) => {
            c == null ? s((u.el = a(u.children || '')), m, b) : (u.el = c.el);
        },
        g = (c, u, m, b) => {
            [c.el, c.anchor] = z(c.children, u, m, b, c.el, c.anchor);
        },
        p = ({el: c, anchor: u}, m, b) => {
            let w;
            for (; c && c !== u; ) (w = x(c)), s(c, m, b), (c = w);
            s(u, m, b);
        },
        y = ({el: c, anchor: u}) => {
            let m;
            for (; c && c !== u; ) (m = x(c)), r(c), (c = m);
            r(u);
        },
        A = (c, u, m, b, w, F, k, S, C) => {
            u.type === 'svg' ? (k = 'svg') : u.type === 'math' && (k = 'mathml'),
                c == null ? v(u, m, b, w, F, k, S, C) : T(c, u, w, F, k, S, C);
        },
        v = (c, u, m, b, w, F, k, S) => {
            let C, E;
            const {props: O, shapeFlag: D, transition: M, dirs: B} = c;
            if (
                ((C = c.el = o(c.type, F, O && O.is, O)),
                D & 8 ? f(C, c.children) : D & 16 && $(c.children, C, null, b, w, Dn(c, F), k, S),
                B && ot(c, null, b, 'created'),
                P(C, c, c.scopeId, k, b),
                O)
            ) {
                for (const Z in O)
                    Z !== 'value' && !Nt(Z) && i(C, Z, null, O[Z], F, c.children, b, w, ye);
                'value' in O && i(C, 'value', null, O.value, F),
                    (E = O.onVnodeBeforeMount) && Me(E, b, c);
            }
            B && ot(c, null, b, 'beforeMount');
            const G = gl(w, M);
            G && M.beforeEnter(C),
                s(C, u, m),
                ((E = O && O.onVnodeMounted) || G || B) &&
                    be(() => {
                        E && Me(E, b, c), G && M.enter(C), B && ot(c, null, b, 'mounted');
                    }, w);
        },
        P = (c, u, m, b, w) => {
            if ((m && R(c, m), b)) for (let F = 0; F < b.length; F++) R(c, b[F]);
            if (w) {
                let F = w.subTree;
                if (u === F) {
                    const k = w.vnode;
                    P(c, k, k.scopeId, k.slotScopeIds, w.parent);
                }
            }
        },
        $ = (c, u, m, b, w, F, k, S, C = 0) => {
            for (let E = C; E < c.length; E++) {
                const O = (c[E] = S ? Ze(c[E]) : Ne(c[E]));
                I(null, O, u, m, b, w, F, k, S);
            }
        },
        T = (c, u, m, b, w, F, k) => {
            const S = (u.el = c.el);
            let {patchFlag: C, dynamicChildren: E, dirs: O} = u;
            C |= c.patchFlag & 16;
            const D = c.props || ne,
                M = u.props || ne;
            let B;
            if (
                (m && lt(m, !1),
                (B = M.onVnodeBeforeUpdate) && Me(B, m, u, c),
                O && ot(u, c, m, 'beforeUpdate'),
                m && lt(m, !0),
                E
                    ? j(c.dynamicChildren, E, S, m, b, Dn(u, w), F)
                    : k || U(c, u, S, null, m, b, Dn(u, w), F, !1),
                C > 0)
            ) {
                if (C & 16) W(S, u, D, M, m, b, w);
                else if (
                    (C & 2 && D.class !== M.class && i(S, 'class', null, M.class, w),
                    C & 4 && i(S, 'style', D.style, M.style, w),
                    C & 8)
                ) {
                    const G = u.dynamicProps;
                    for (let Z = 0; Z < G.length; Z++) {
                        const re = G[Z],
                            ge = D[re],
                            ke = M[re];
                        (ke !== ge || re === 'value') && i(S, re, ge, ke, w, c.children, m, b, ye);
                    }
                }
                C & 1 && c.children !== u.children && f(S, u.children);
            } else !k && E == null && W(S, u, D, M, m, b, w);
            ((B = M.onVnodeUpdated) || O) &&
                be(() => {
                    B && Me(B, m, u, c), O && ot(u, c, m, 'updated');
                }, b);
        },
        j = (c, u, m, b, w, F, k) => {
            for (let S = 0; S < u.length; S++) {
                const C = c[S],
                    E = u[S],
                    O = C.el && (C.type === se || !ft(C, E) || C.shapeFlag & 70) ? h(C.el) : m;
                I(C, E, O, null, b, w, F, k, !0);
            }
        },
        W = (c, u, m, b, w, F, k) => {
            if (m !== b) {
                if (m !== ne)
                    for (const S in m)
                        !Nt(S) && !(S in b) && i(c, S, m[S], null, k, u.children, w, F, ye);
                for (const S in b) {
                    if (Nt(S)) continue;
                    const C = b[S],
                        E = m[S];
                    C !== E && S !== 'value' && i(c, S, E, C, k, u.children, w, F, ye);
                }
                'value' in b && i(c, 'value', m.value, b.value, k);
            }
        },
        L = (c, u, m, b, w, F, k, S, C) => {
            const E = (u.el = c ? c.el : l('')),
                O = (u.anchor = c ? c.anchor : l(''));
            let {patchFlag: D, dynamicChildren: M, slotScopeIds: B} = u;
            B && (S = S ? S.concat(B) : B),
                c == null
                    ? (s(E, m, b), s(O, m, b), $(u.children || [], m, O, w, F, k, S, C))
                    : D > 0 && D & 64 && M && c.dynamicChildren
                      ? (j(c.dynamicChildren, M, m, w, F, k, S),
                        (u.key != null || (w && u === w.subTree)) && di(c, u, !0))
                      : U(c, u, m, O, w, F, k, S, C);
        },
        Q = (c, u, m, b, w, F, k, S, C) => {
            (u.slotScopeIds = S),
                c == null
                    ? u.shapeFlag & 512
                        ? w.ctx.activate(u, m, b, k, C)
                        : de(u, m, b, w, F, k, C)
                    : st(c, u, C);
        },
        de = (c, u, m, b, w, F, k) => {
            const S = (c.component = El(c, b, w));
            if ((Fn(c) && (S.ctx.renderer = ze), Sl(S), S.asyncDep)) {
                if ((w && w.registerDep(S, oe), !c.el)) {
                    const C = (S.subTree = q(He));
                    H(null, C, u, m);
                }
            } else oe(S, c, u, m, w, F, k);
        },
        st = (c, u, m) => {
            const b = (u.component = c.component);
            if (To(c, u, m))
                if (b.asyncDep && !b.asyncResolved) {
                    ee(b, u, m);
                    return;
                } else (b.next = u), Ao(b.update), (b.effect.dirty = !0), b.update();
            else (u.el = c.el), (b.vnode = u);
        },
        oe = (c, u, m, b, w, F, k) => {
            const S = () => {
                    if (c.isMounted) {
                        let {next: O, bu: D, u: M, parent: B, vnode: G} = c;
                        {
                            const bt = pi(c);
                            if (bt) {
                                O && ((O.el = G.el), ee(c, O, k)),
                                    bt.asyncDep.then(() => {
                                        c.isUnmounted || S();
                                    });
                                return;
                            }
                        }
                        let Z = O,
                            re;
                        lt(c, !1),
                            O ? ((O.el = G.el), ee(c, O, k)) : (O = G),
                            D && Ln(D),
                            (re = O.props && O.props.onVnodeBeforeUpdate) && Me(re, B, O, G),
                            lt(c, !0);
                        const ge = zs(c),
                            ke = c.subTree;
                        (c.subTree = ge),
                            I(ke, ge, h(ke.el), Ue(ke), c, w, F),
                            (O.el = ge.el),
                            Z === null && ko(c, ge.el),
                            M && be(M, w),
                            (re = O.props && O.props.onVnodeUpdated) &&
                                be(() => Me(re, B, O, G), w);
                    } else {
                        let O;
                        const {el: D, props: M} = u,
                            {bm: B, m: G, parent: Z} = c,
                            re = Dt(u);
                        lt(c, !1),
                            B && Ln(B),
                            !re && (O = M && M.onVnodeBeforeMount) && Me(O, Z, u),
                            lt(c, !0);
                        {
                            const ge = (c.subTree = zs(c));
                            I(null, ge, m, b, c, w, F), (u.el = ge.el);
                        }
                        if ((G && be(G, w), !re && (O = M && M.onVnodeMounted))) {
                            const ge = u;
                            be(() => Me(O, Z, ge), w);
                        }
                        (u.shapeFlag & 256 || (Z && Dt(Z.vnode) && Z.vnode.shapeFlag & 256)) &&
                            c.a &&
                            be(c.a, w),
                            (c.isMounted = !0),
                            (u = m = b = null);
                    }
                },
                C = (c.effect = new us(S, Oe, () => ws(E), c.scope)),
                E = (c.update = () => {
                    C.dirty && C.run();
                });
            (E.id = c.uid), lt(c, !0), E();
        },
        ee = (c, u, m) => {
            u.component = c;
            const b = c.vnode.props;
            (c.vnode = u),
                (c.next = null),
                cl(c, u.props, b, m),
                dl(c, u.children, m),
                vt(),
                Us(c),
                yt();
        },
        U = (c, u, m, b, w, F, k, S, C = !1) => {
            const E = c && c.children,
                O = c ? c.shapeFlag : 0,
                D = u.children,
                {patchFlag: M, shapeFlag: B} = u;
            if (M > 0) {
                if (M & 128) {
                    Te(E, D, m, b, w, F, k, S, C);
                    return;
                } else if (M & 256) {
                    ce(E, D, m, b, w, F, k, S, C);
                    return;
                }
            }
            B & 8
                ? (O & 16 && ye(E, w, F), D !== E && f(m, D))
                : O & 16
                  ? B & 16
                      ? Te(E, D, m, b, w, F, k, S, C)
                      : ye(E, w, F, !0)
                  : (O & 8 && f(m, ''), B & 16 && $(D, m, b, w, F, k, S, C));
        },
        ce = (c, u, m, b, w, F, k, S, C) => {
            (c = c || At), (u = u || At);
            const E = c.length,
                O = u.length,
                D = Math.min(E, O);
            let M;
            for (M = 0; M < D; M++) {
                const B = (u[M] = C ? Ze(u[M]) : Ne(u[M]));
                I(c[M], B, m, null, w, F, k, S, C);
            }
            E > O ? ye(c, w, F, !0, !1, D) : $(u, m, b, w, F, k, S, C, D);
        },
        Te = (c, u, m, b, w, F, k, S, C) => {
            let E = 0;
            const O = u.length;
            let D = c.length - 1,
                M = O - 1;
            for (; E <= D && E <= M; ) {
                const B = c[E],
                    G = (u[E] = C ? Ze(u[E]) : Ne(u[E]));
                if (ft(B, G)) I(B, G, m, null, w, F, k, S, C);
                else break;
                E++;
            }
            for (; E <= D && E <= M; ) {
                const B = c[D],
                    G = (u[M] = C ? Ze(u[M]) : Ne(u[M]));
                if (ft(B, G)) I(B, G, m, null, w, F, k, S, C);
                else break;
                D--, M--;
            }
            if (E > D) {
                if (E <= M) {
                    const B = M + 1,
                        G = B < O ? u[B].el : b;
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
                let re,
                    ge = 0;
                const ke = M - G + 1;
                let bt = !1,
                    ks = 0;
                const Ot = new Array(ke);
                for (E = 0; E < ke; E++) Ot[E] = 0;
                for (E = B; E <= D; E++) {
                    const Ee = c[E];
                    if (ge >= ke) {
                        ie(Ee, w, F, !0);
                        continue;
                    }
                    let Re;
                    if (Ee.key != null) Re = Z.get(Ee.key);
                    else
                        for (re = G; re <= M; re++)
                            if (Ot[re - G] === 0 && ft(Ee, u[re])) {
                                Re = re;
                                break;
                            }
                    Re === void 0
                        ? ie(Ee, w, F, !0)
                        : ((Ot[Re - G] = E + 1),
                          Re >= ks ? (ks = Re) : (bt = !0),
                          I(Ee, u[Re], m, null, w, F, k, S, C),
                          ge++);
                }
                const Ps = bt ? ml(Ot) : At;
                for (re = Ps.length - 1, E = ke - 1; E >= 0; E--) {
                    const Ee = G + E,
                        Re = u[Ee],
                        Os = Ee + 1 < O ? u[Ee + 1].el : b;
                    Ot[E] === 0
                        ? I(null, Re, m, Os, w, F, k, S, C)
                        : bt && (re < 0 || E !== Ps[re] ? Fe(Re, m, Os, 2) : re--);
                }
            }
        },
        Fe = (c, u, m, b, w = null) => {
            const {el: F, type: k, transition: S, children: C, shapeFlag: E} = c;
            if (E & 6) {
                Fe(c.component.subTree, u, m, b);
                return;
            }
            if (E & 128) {
                c.suspense.move(u, m, b);
                return;
            }
            if (E & 64) {
                k.move(c, u, m, ze);
                return;
            }
            if (k === se) {
                s(F, u, m);
                for (let D = 0; D < C.length; D++) Fe(C[D], u, m, b);
                s(c.anchor, u, m);
                return;
            }
            if (k === Bt) {
                p(c, u, m);
                return;
            }
            if (b !== 2 && E & 1 && S)
                if (b === 0) S.beforeEnter(F), s(F, u, m), be(() => S.enter(F), w);
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
        ie = (c, u, m, b = !1, w = !1) => {
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
            if ((S != null && ns(S, null, m, c, !0), O & 256)) {
                u.ctx.deactivate(c);
                return;
            }
            const B = O & 1 && M,
                G = !Dt(c);
            let Z;
            if ((G && (Z = k && k.onVnodeBeforeUnmount) && Me(Z, u, c), O & 6))
                rt(c.component, m, b);
            else {
                if (O & 128) {
                    c.suspense.unmount(m, b);
                    return;
                }
                B && ot(c, null, u, 'beforeUnmount'),
                    O & 64
                        ? c.type.remove(c, u, m, w, ze, b)
                        : E && (F !== se || (D > 0 && D & 64))
                          ? ye(E, u, m, !1, !0)
                          : ((F === se && D & 384) || (!w && O & 16)) && ye(C, u, m),
                    b && Jt(c);
            }
            ((G && (Z = k && k.onVnodeUnmounted)) || B) &&
                be(() => {
                    Z && Me(Z, u, c), B && ot(c, null, u, 'unmounted');
                }, m);
        },
        Jt = (c) => {
            const {type: u, el: m, anchor: b, transition: w} = c;
            if (u === se) {
                Le(m, b);
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
            for (; c !== u; ) (m = x(c)), r(c), (c = m);
            r(u);
        },
        rt = (c, u, m) => {
            const {bum: b, scope: w, update: F, subTree: k, um: S} = c;
            b && Ln(b),
                w.stop(),
                F && ((F.active = !1), ie(k, c, u, m)),
                S && be(S, u),
                be(() => {
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
        ye = (c, u, m, b = !1, w = !1, F = 0) => {
            for (let k = F; k < c.length; k++) ie(c[k], u, m, b, w);
        },
        Ue = (c) =>
            c.shapeFlag & 6
                ? Ue(c.component.subTree)
                : c.shapeFlag & 128
                  ? c.suspense.next()
                  : x(c.anchor || c.el);
    let it = !1;
    const kt = (c, u, m) => {
            c == null
                ? u._vnode && ie(u._vnode, null, null, !0)
                : I(u._vnode || null, c, u, null, null, null, m),
                it || ((it = !0), Us(), Kr(), (it = !1)),
                (u._vnode = c);
        },
        ze = {p: I, um: ie, m: Fe, r: Jt, mt: de, mc: $, pc: U, pbc: j, n: Ue, o: e};
    return {render: kt, hydrate: void 0, createApp: ol(kt)};
}
function Dn({type: e, props: t}, n) {
    return (n === 'svg' && e === 'foreignObject') ||
        (n === 'mathml' && e === 'annotation-xml' && t && t.encoding && t.encoding.includes('html'))
        ? void 0
        : n;
}
function lt({effect: e, update: t}, n) {
    e.allowRecurse = t.allowRecurse = n;
}
function gl(e, t) {
    return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function di(e, t, n = !1) {
    const s = e.children,
        r = t.children;
    if (K(s) && K(r))
        for (let i = 0; i < s.length; i++) {
            const o = s[i];
            let l = r[i];
            l.shapeFlag & 1 &&
                !l.dynamicChildren &&
                ((l.patchFlag <= 0 || l.patchFlag === 32) && ((l = r[i] = Ze(r[i])), (l.el = o.el)),
                n || di(o, l)),
                l.type === $n && (l.el = o.el);
        }
}
function ml(e) {
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
function pi(e) {
    const t = e.subTree.component;
    if (t) return t.asyncDep && !t.asyncResolved ? t : pi(t);
}
const vl = (e) => e.__isTeleport,
    se = Symbol.for('v-fgt'),
    $n = Symbol.for('v-txt'),
    He = Symbol.for('v-cmt'),
    Bt = Symbol.for('v-stc'),
    Ut = [];
let Ie = null;
function fe(e = !1) {
    Ut.push((Ie = e ? null : []));
}
function yl() {
    Ut.pop(), (Ie = Ut[Ut.length - 1] || null);
}
let Kt = 1;
function er(e) {
    Kt += e;
}
function hi(e) {
    return (e.dynamicChildren = Kt > 0 ? Ie || At : null), yl(), Kt > 0 && Ie && Ie.push(e), e;
}
function ve(e, t, n, s, r, i) {
    return hi(_(e, t, n, s, r, i, !0));
}
function gi(e, t, n, s, r) {
    return hi(q(e, t, n, s, r, !0));
}
function mn(e) {
    return e ? e.__v_isVNode === !0 : !1;
}
function ft(e, t) {
    return e.type === t.type && e.key === t.key;
}
const Tn = '__vInternal',
    mi = ({key: e}) => e ?? null,
    fn = ({ref: e, ref_key: t, ref_for: n}) => (
        typeof e == 'number' && (e = '' + e),
        e != null ? (Ae(e) || xe(e) || V(e) ? {i: ue, r: e, k: t, f: !!n} : e) : null
    );
function _(e, t = null, n = null, s = 0, r = null, i = e === se ? 0 : 1, o = !1, l = !1) {
    const a = {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e,
        props: t,
        key: t && mi(t),
        ref: t && fn(t),
        scopeId: Yr,
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
        ctx: ue,
    };
    return (
        l ? (Fs(a, n), i & 128 && e.normalize(a)) : n && (a.shapeFlag |= Ae(n) ? 8 : 16),
        Kt > 0 && !o && Ie && (a.patchFlag > 0 || i & 6) && a.patchFlag !== 32 && Ie.push(a),
        a
    );
}
const q = bl;
function bl(e, t = null, n = null, s = 0, r = null, i = !1) {
    if (((!e || e === Po) && (e = He), mn(e))) {
        const l = tt(e, t, !0);
        return (
            n && Fs(l, n),
            Kt > 0 && !i && Ie && (l.shapeFlag & 6 ? (Ie[Ie.indexOf(e)] = l) : Ie.push(l)),
            (l.patchFlag |= -2),
            l
        );
    }
    if (($l(e) && (e = e.__vccOpts), t)) {
        t = _l(t);
        let {class: l, style: a} = t;
        l && !Ae(l) && (t.class = je(l)),
            le(a) && (kr(a) && !K(a) && (a = we({}, a)), (t.style = An(a)));
    }
    const o = Ae(e) ? 1 : Oo(e) ? 128 : vl(e) ? 64 : le(e) ? 4 : V(e) ? 2 : 0;
    return _(e, t, n, s, r, o, i, !0);
}
function _l(e) {
    return e ? (kr(e) || Tn in e ? we({}, e) : e) : null;
}
function tt(e, t, n = !1) {
    const {props: s, ref: r, patchFlag: i, children: o} = e,
        l = t ? xl(s || {}, t) : s;
    return {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e.type,
        props: l,
        key: l && mi(l),
        ref: t && t.ref ? (n && r ? (K(r) ? r.concat(fn(t)) : [r, fn(t)]) : fn(t)) : r,
        scopeId: e.scopeId,
        slotScopeIds: e.slotScopeIds,
        children: o,
        target: e.target,
        targetAnchor: e.targetAnchor,
        staticCount: e.staticCount,
        shapeFlag: e.shapeFlag,
        patchFlag: t && e.type !== se ? (i === -1 ? 16 : i | 16) : i,
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
    return q($n, null, e, t);
}
function Ss(e, t) {
    const n = q(Bt, null, e);
    return (n.staticCount = t), n;
}
function Ne(e) {
    return e == null || typeof e == 'boolean'
        ? q(He)
        : K(e)
          ? q(se, null, e.slice())
          : typeof e == 'object'
            ? Ze(e)
            : q($n, null, String(e));
}
function Ze(e) {
    return (e.el === null && e.patchFlag !== -1) || e.memo ? e : tt(e);
}
function Fs(e, t) {
    let n = 0;
    const {shapeFlag: s} = e;
    if (t == null) t = null;
    else if (K(t)) n = 16;
    else if (typeof t == 'object')
        if (s & 65) {
            const r = t.default;
            r && (r._c && (r._d = !1), Fs(e, r()), r._c && (r._d = !0));
            return;
        } else {
            n = 32;
            const r = t._;
            !r && !(Tn in t)
                ? (t._ctx = ue)
                : r === 3 &&
                  ue &&
                  (ue.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
        }
    else
        V(t)
            ? ((t = {default: t, _ctx: ue}), (n = 32))
            : ((t = String(t)), s & 64 ? ((n = 16), (t = [te(t)])) : (n = 8));
    (e.children = t), (e.shapeFlag |= n);
}
function xl(...e) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
        const s = e[n];
        for (const r in s)
            if (r === 'class') t.class !== s.class && (t.class = je([t.class, s.class]));
            else if (r === 'style') t.style = An([t.style, s.style]);
            else if (ys(r)) {
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
const wl = oi();
let Al = 0;
function El(e, t, n) {
    const s = e.type,
        r = (t ? t.appContext : e.appContext) || wl,
        i = {
            uid: Al++,
            vnode: e,
            type: s,
            parent: t,
            appContext: r,
            root: null,
            next: null,
            subTree: null,
            effect: null,
            update: null,
            scope: new Mi(!0),
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
            propsOptions: ai(s, r),
            emitsOptions: Wr(s, r),
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
        (i.ctx = {_: i}), (i.root = t ? t.root : i), (i.emit = Fo.bind(null, i)), e.ce && e.ce(i), i
    );
}
let he = null;
const Cs = () => he || ue;
let vn, ss;
{
    const e = Ur(),
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
    (vn = t('__VUE_INSTANCE_SETTERS__', (n) => (he = n))),
        (ss = t('__VUE_SSR_SETTERS__', (n) => (kn = n)));
}
const Zt = (e) => {
        const t = he;
        return (
            vn(e),
            e.scope.on(),
            () => {
                e.scope.off(), vn(t);
            }
        );
    },
    tr = () => {
        he && he.scope.off(), vn(null);
    };
function vi(e) {
    return e.vnode.shapeFlag & 4;
}
let kn = !1;
function Sl(e, t = !1) {
    t && ss(t);
    const {props: n, children: s} = e.vnode,
        r = vi(e);
    al(e, n, r, t), fl(e, s);
    const i = r ? Fl(e, t) : void 0;
    return t && ss(!1), i;
}
function Fl(e, t) {
    const n = e.type;
    (e.accessCache = Object.create(null)), (e.proxy = Pr(new Proxy(e.ctx, Zo)));
    const {setup: s} = n;
    if (s) {
        const r = (e.setupContext = s.length > 1 ? bi(e) : null),
            i = Zt(e);
        vt();
        const o = et(s, e, 0, [e.props, r]);
        if ((yt(), i(), jr(o))) {
            if ((o.then(tr, tr), t))
                return o
                    .then((l) => {
                        nr(e, l);
                    })
                    .catch((l) => {
                        En(l, e, 0);
                    });
            e.asyncDep = o;
        } else nr(e, o);
    } else yi(e);
}
function nr(e, t, n) {
    V(t)
        ? e.type.__ssrInlineRender
            ? (e.ssrRender = t)
            : (e.render = t)
        : le(t) && (e.setupState = Lr(t)),
        yi(e);
}
function yi(e, t, n) {
    const s = e.type;
    e.render || (e.render = s.render || Oe);
    {
        const r = Zt(e);
        vt();
        try {
            el(e);
        } finally {
            yt(), r();
        }
    }
}
function Cl(e) {
    return (
        e.attrsProxy ||
        (e.attrsProxy = new Proxy(e.attrs, {
            get(t, n) {
                return _e(e, 'get', '$attrs'), t[n];
            },
        }))
    );
}
function bi(e) {
    const t = (n) => {
        e.exposed = n || {};
    };
    return {
        get attrs() {
            return Cl(e);
        },
        slots: e.slots,
        emit: e.emit,
        expose: t,
    };
}
function Pn(e) {
    if (e.exposed)
        return (
            e.exposeProxy ||
            (e.exposeProxy = new Proxy(Lr(Pr(e.exposed)), {
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
function $l(e) {
    return V(e) && '__vccOpts' in e;
}
const mt = (e, t) => io(e, t, kn);
function Tl(e, t, n) {
    const s = arguments.length;
    return s === 2
        ? le(t) && !K(t)
            ? mn(t)
                ? q(e, null, [t])
                : q(e, t)
            : q(e, null, t)
        : (s > 3 ? (n = Array.prototype.slice.call(arguments, 2)) : s === 3 && mn(n) && (n = [n]),
          q(e, t, n));
}
const kl = '3.4.19';
/**
 * @vue/shared v3.4.19
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function Pl(e, t) {
    const n = new Set(e.split(','));
    return (s) => n.has(s);
}
const Ol = (e) =>
        e.charCodeAt(0) === 111 &&
        e.charCodeAt(1) === 110 &&
        (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
    Il = (e) => e.startsWith('onUpdate:'),
    $s = Object.assign,
    On = Array.isArray,
    _i = (e) => typeof e == 'function',
    qt = (e) => typeof e == 'string',
    Ll = (e) => e !== null && typeof e == 'object',
    xi = (e) => {
        const t = Object.create(null);
        return (n) => t[n] || (t[n] = e(n));
    },
    Rl = /\B([A-Z])/g,
    wi = xi((e) => e.replace(Rl, '-$1').toLowerCase()),
    Ml = xi((e) => e.charAt(0).toUpperCase() + e.slice(1)),
    Nl = (e) => {
        const t = qt(e) ? Number(e) : NaN;
        return isNaN(t) ? e : t;
    },
    Dl = 'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly',
    jl = Pl(Dl);
function Ai(e) {
    return !!e || e === '';
}
/**
 * @vue/runtime-dom v3.4.19
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ const Hl = 'http://www.w3.org/2000/svg',
    Bl = 'http://www.w3.org/1998/Math/MathML',
    Je = typeof document < 'u' ? document : null,
    sr = Je && Je.createElement('template'),
    Ul = {
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
                    ? Je.createElementNS(Hl, e)
                    : t === 'mathml'
                      ? Je.createElementNS(Bl, e)
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
                sr.innerHTML =
                    s === 'svg' ? `<svg>${e}</svg>` : s === 'mathml' ? `<math>${e}</math>` : e;
                const l = sr.content;
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
    Ts = (e, {slots: t}) => Tl(Ho, zl(e), t);
Ts.displayName = 'Transition';
const Ei = {
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
Ts.props = $s({}, Jr, Ei);
const at = (e, t = []) => {
        On(e) ? e.forEach((n) => n(...t)) : e && e(...t);
    },
    rr = (e) => (e ? (On(e) ? e.some((t) => t.length > 1) : e.length > 1) : !1);
function zl(e) {
    const t = {};
    for (const L in e) L in Ei || (t[L] = e[L]);
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
            leaveActiveClass: x = `${n}-leave-active`,
            leaveToClass: R = `${n}-leave-to`,
        } = e,
        z = Vl(r),
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
        T = (L, Q, de) => {
            ct(L, Q ? f : l), ct(L, Q ? d : o), de && de();
        },
        j = (L, Q) => {
            (L._isLeaving = !1), ct(L, h), ct(L, R), ct(L, x), Q && Q();
        },
        W = (L) => (Q, de) => {
            const st = L ? P : g,
                oe = () => T(Q, L, de);
            at(st, [Q, oe]),
                ir(() => {
                    ct(Q, L ? a : i), We(Q, L ? f : l), rr(st) || or(Q, s, I, oe);
                });
        };
    return $s(t, {
        onBeforeEnter(L) {
            at(H, [L]), We(L, i), We(L, o);
        },
        onBeforeAppear(L) {
            at(v, [L]), We(L, a), We(L, d);
        },
        onEnter: W(!1),
        onAppear: W(!0),
        onLeave(L, Q) {
            L._isLeaving = !0;
            const de = () => j(L, Q);
            We(L, h),
                ql(),
                We(L, x),
                ir(() => {
                    L._isLeaving && (ct(L, h), We(L, R), rr(y) || or(L, s, N, de));
                }),
                at(y, [L, de]);
        },
        onEnterCancelled(L) {
            T(L, !1), at(p, [L]);
        },
        onAppearCancelled(L) {
            T(L, !0), at($, [L]);
        },
        onLeaveCancelled(L) {
            j(L), at(A, [L]);
        },
    });
}
function Vl(e) {
    if (e == null) return null;
    if (Ll(e)) return [jn(e.enter), jn(e.leave)];
    {
        const t = jn(e);
        return [t, t];
    }
}
function jn(e) {
    return Nl(e);
}
function We(e, t) {
    t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Wt] || (e[Wt] = new Set())).add(t);
}
function ct(e, t) {
    t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
    const n = e[Wt];
    n && (n.delete(t), n.size || (e[Wt] = void 0));
}
function ir(e) {
    requestAnimationFrame(() => {
        requestAnimationFrame(e);
    });
}
let Gl = 0;
function or(e, t, n, s) {
    const r = (e._endId = ++Gl),
        i = () => {
            r === e._endId && s();
        };
    if (n) return setTimeout(i, n);
    const {type: o, timeout: l, propCount: a} = Kl(e, t);
    if (!o) return s();
    const d = o + 'end';
    let f = 0;
    const h = () => {
            e.removeEventListener(d, x), i();
        },
        x = (R) => {
            R.target === e && ++f >= a && h();
        };
    setTimeout(() => {
        f < a && h();
    }, l + 1),
        e.addEventListener(d, x);
}
function Kl(e, t) {
    const n = window.getComputedStyle(e),
        s = (z) => (n[z] || '').split(', '),
        r = s(`${qe}Delay`),
        i = s(`${qe}Duration`),
        o = lr(r, i),
        l = s(`${It}Delay`),
        a = s(`${It}Duration`),
        d = lr(l, a);
    let f = null,
        h = 0,
        x = 0;
    t === qe
        ? o > 0 && ((f = qe), (h = o), (x = i.length))
        : t === It
          ? d > 0 && ((f = It), (h = d), (x = a.length))
          : ((h = Math.max(o, d)),
            (f = h > 0 ? (o > d ? qe : It) : null),
            (x = f ? (f === qe ? i.length : a.length) : 0));
    const R = f === qe && /\b(transform|all)(,|$)/.test(s(`${qe}Property`).toString());
    return {type: f, timeout: h, propCount: x, hasTransform: R};
}
function lr(e, t) {
    for (; e.length < t.length; ) e = e.concat(e);
    return Math.max(...t.map((n, s) => ar(n) + ar(e[s])));
}
function ar(e) {
    return e === 'auto' ? 0 : Number(e.slice(0, -1).replace(',', '.')) * 1e3;
}
function ql() {
    return document.body.offsetHeight;
}
function Wl(e, t, n) {
    const s = e[Wt];
    s && (t = (t ? [t, ...s] : [...s]).join(' ')),
        t == null ? e.removeAttribute('class') : n ? e.setAttribute('class', t) : (e.className = t);
}
const Yt = Symbol('_vod'),
    Si = {
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
const Fi = Symbol('');
function Yl(e) {
    const t = Cs();
    if (!t) return;
    const n = (t.ut = (r = e(t.proxy)) => {
            Array.from(document.querySelectorAll(`[data-v-owner="${t.uid}"]`)).forEach((i) =>
                is(i, r)
            );
        }),
        s = () => {
            const r = e(t.proxy);
            rs(t.subTree, r), n(r);
        };
    Mo(s),
        Ct(() => {
            const r = new MutationObserver(s);
            r.observe(t.subTree.el.parentNode, {childList: !0}), Xt(() => r.disconnect());
        });
}
function rs(e, t) {
    if (e.shapeFlag & 128) {
        const n = e.suspense;
        (e = n.activeBranch),
            n.pendingBranch &&
                !n.isHydrating &&
                n.effects.push(() => {
                    rs(n.activeBranch, t);
                });
    }
    for (; e.component; ) e = e.component.subTree;
    if (e.shapeFlag & 1 && e.el) is(e.el, t);
    else if (e.type === se) e.children.forEach((n) => rs(n, t));
    else if (e.type === Bt) {
        let {el: n, anchor: s} = e;
        for (; n && (is(n, t), n !== s); ) n = n.nextSibling;
    }
}
function is(e, t) {
    if (e.nodeType === 1) {
        const n = e.style;
        let s = '';
        for (const r in t) n.setProperty(`--${r}`, t[r]), (s += `--${r}: ${t[r]};`);
        n[Fi] = s;
    }
}
const Xl = /(^|;)\s*display\s*:/;
function Zl(e, t, n) {
    const s = e.style,
        r = qt(n),
        i = s.display;
    let o = !1;
    if (n && !r) {
        if (t && !qt(t)) for (const l in t) n[l] == null && os(s, l, '');
        for (const l in n) l === 'display' && (o = !0), os(s, l, n[l]);
    } else if (r) {
        if (t !== n) {
            const l = s[Fi];
            l && (n += ';' + l), (s.cssText = n), (o = Xl.test(n));
        }
    } else t && e.removeAttribute('style');
    Yt in e && ((e[Yt] = o ? s.display : ''), (s.display = i));
}
const cr = /\s*!important$/;
function os(e, t, n) {
    if (On(n)) n.forEach((s) => os(e, t, s));
    else if ((n == null && (n = ''), t.startsWith('--'))) e.setProperty(t, n);
    else {
        const s = Jl(e, t);
        cr.test(n) ? e.setProperty(wi(s), n.replace(cr, ''), 'important') : (e[s] = n);
    }
}
const ur = ['Webkit', 'Moz', 'ms'],
    Hn = {};
function Jl(e, t) {
    const n = Hn[t];
    if (n) return n;
    let s = Ft(t);
    if (s !== 'filter' && s in e) return (Hn[t] = s);
    s = Ml(s);
    for (let r = 0; r < ur.length; r++) {
        const i = ur[r] + s;
        if (i in e) return (Hn[t] = i);
    }
    return t;
}
const fr = 'http://www.w3.org/1999/xlink';
function Ql(e, t, n, s, r) {
    if (s && t.startsWith('xlink:'))
        n == null ? e.removeAttributeNS(fr, t.slice(6, t.length)) : e.setAttributeNS(fr, t, n);
    else {
        const i = jl(t);
        n == null || (i && !Ai(n)) ? e.removeAttribute(t) : e.setAttribute(t, i ? '' : n);
    }
}
function ea(e, t, n, s, r, i, o) {
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
            ? (n = Ai(n))
            : n == null && d === 'string'
              ? ((n = ''), (a = !0))
              : d === 'number' && ((n = 0), (a = !0));
    }
    try {
        e[t] = n;
    } catch {}
    a && e.removeAttribute(t);
}
function ta(e, t, n, s) {
    e.addEventListener(t, n, s);
}
function na(e, t, n, s) {
    e.removeEventListener(t, n, s);
}
const dr = Symbol('_vei');
function sa(e, t, n, s, r = null) {
    const i = e[dr] || (e[dr] = {}),
        o = i[t];
    if (s && o) o.value = s;
    else {
        const [l, a] = ra(t);
        if (s) {
            const d = (i[t] = la(s, r));
            ta(e, l, d, a);
        } else o && (na(e, l, o, a), (i[t] = void 0));
    }
}
const pr = /(?:Once|Passive|Capture)$/;
function ra(e) {
    let t;
    if (pr.test(e)) {
        t = {};
        let s;
        for (; (s = e.match(pr)); )
            (e = e.slice(0, e.length - s[0].length)), (t[s[0].toLowerCase()] = !0);
    }
    return [e[2] === ':' ? e.slice(3) : wi(e.slice(2)), t];
}
let Bn = 0;
const ia = Promise.resolve(),
    oa = () => Bn || (ia.then(() => (Bn = 0)), (Bn = Date.now()));
function la(e, t) {
    const n = (s) => {
        if (!s._vts) s._vts = Date.now();
        else if (s._vts <= n.attached) return;
        $e(aa(s, n.value), t, 5, [s]);
    };
    return (n.value = e), (n.attached = oa()), n;
}
function aa(e, t) {
    if (On(t)) {
        const n = e.stopImmediatePropagation;
        return (
            (e.stopImmediatePropagation = () => {
                n.call(e), (e._stopped = !0);
            }),
            t.map((s) => (r) => !r._stopped && s && s(r))
        );
    } else return t;
}
const hr = (e) =>
        e.charCodeAt(0) === 111 &&
        e.charCodeAt(1) === 110 &&
        e.charCodeAt(2) > 96 &&
        e.charCodeAt(2) < 123,
    ca = (e, t, n, s, r, i, o, l, a) => {
        const d = r === 'svg';
        t === 'class'
            ? Wl(e, s, d)
            : t === 'style'
              ? Zl(e, n, s)
              : Ol(t)
                ? Il(t) || sa(e, t, n, s, o)
                : (
                        t[0] === '.'
                            ? ((t = t.slice(1)), !0)
                            : t[0] === '^'
                              ? ((t = t.slice(1)), !1)
                              : ua(e, t, s, d)
                    )
                  ? ea(e, t, s, i, o, l, a)
                  : (t === 'true-value'
                        ? (e._trueValue = s)
                        : t === 'false-value' && (e._falseValue = s),
                    Ql(e, t, s, d));
    };
function ua(e, t, n, s) {
    if (s) return !!(t === 'innerHTML' || t === 'textContent' || (t in e && hr(t) && _i(n)));
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
    return hr(t) && qt(n) ? !1 : t in e;
}
const fa = $s({patchProp: ca}, Ul);
let gr;
function da() {
    return gr || (gr = pl(fa));
}
const pa = (...e) => {
    const t = da().createApp(...e),
        {mount: n} = t;
    return (
        (t.mount = (s) => {
            const r = ga(s);
            if (!r) return;
            const i = t._component;
            !_i(i) && !i.render && !i.template && (i.template = r.innerHTML), (r.innerHTML = '');
            const o = n(r, !1, ha(r));
            return (
                r instanceof Element &&
                    (r.removeAttribute('v-cloak'), r.setAttribute('data-v-app', '')),
                o
            );
        }),
        t
    );
};
function ha(e) {
    if (e instanceof SVGElement) return 'svg';
    if (typeof MathMLElement == 'function' && e instanceof MathMLElement) return 'mathml';
}
function ga(e) {
    return qt(e) ? document.querySelector(e) : e;
}
const ma = '' + new URL('../images/vue.svg', import.meta.url).href;
var mr =
    typeof globalThis < 'u'
        ? globalThis
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : typeof self < 'u'
              ? self
              : {};
function va(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default') ? e.default : e;
}
var Ci = {exports: {}};
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
                    return x(v, v.head, g), f(g, v, p, v.head, 0), z(v);
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
                            de = !!W.greedy,
                            st = W.alias;
                        if (de && !W.pattern.global) {
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
                                if (de) {
                                    if (((ie = d(ee, ce, g, Q)), !ie || ie.index >= g.length))
                                        break;
                                    var ye = ie.index,
                                        Jt = ie.index + ie[0].length,
                                        Le = ce;
                                    for (Le += U.value.length; ye >= Le; )
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
                                var ye = ie.index,
                                    Ue = ie[0],
                                    it = Te.slice(0, ye),
                                    kt = Te.slice(ye + Ue.length),
                                    ze = ce + Te.length;
                                P && ze > P.reach && (P.reach = ze);
                                var Pt = U.prev;
                                it && ((Pt = x(p, Pt, it)), (ce += it.length)), R(p, Pt, Fe);
                                var c = new a($, L ? l.tokenize(Ue, L) : Ue, st, Ue);
                                if (((U = x(p, Pt, c)), kt && x(p, U, kt), Fe > 1)) {
                                    var u = {cause: $ + ',' + j, reach: ze};
                                    f(g, p, y, U.prev, ce, u),
                                        P && u.reach > P.reach && (P.reach = u.reach);
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
        function x(g, p, y) {
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
        typeof mr < 'u' && (mr.Prism = n),
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
            function x(I, N, H) {
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
                            x(
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
})(Ci);
var ya = Ci.exports;
const _t = va(ya);
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
const ba = {class: 'my-prism'},
    _a = ['innerHTML'],
    ls = Be({
        __name: 'MyEditor',
        props: {language: {}, code: {}},
        setup(e) {
            const t = e;
            function n(l) {
                return _t.highlight(l, _t.languages.javascript, 'javascript');
            }
            function s(l) {
                return _t.highlight(l, _t.languages.shell, 'shell');
            }
            function r(l) {
                return _t.highlight(l, _t.languages.html, 'html');
            }
            const i = mt(() => {
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
                o = mt(() => {
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
                fe(),
                ve('pre', ba, [_('code', {class: je(o.value), innerHTML: i.value}, null, 10, _a)])
            );
        },
    }),
    xa = {class: 'my-example-layout'},
    wa = ['id'],
    Aa = {class: 'my-paragraph'},
    xt = Be({
        __name: 'MyExample',
        props: {title: {}, code: {}, language: {}},
        setup(e) {
            const t = Jo(),
                n = e,
                s = mt(() => n.title.replace(/\s+/g, '-').toLowerCase());
            return (r, i) => (
                fe(),
                ve('div', xa, [
                    _('h2', {id: s.value}, Se(n.title), 9, wa),
                    Zr(_('section', Aa, [Zn(r.$slots, 'description')], 512), [
                        [Si, nt(t).description],
                    ]),
                    _('div', null, [
                        q(ls, {code: n.code, language: n.language}, null, 8, ['code', 'language']),
                        _('div', null, [Zn(r.$slots, 'default')]),
                    ]),
                ])
            );
        },
    });
function Ea(e, t, n) {
    const s = {top: 0, left: 0},
        r = as(e.getBoundingClientRect()),
        i = e.offsetParent,
        o = Sa(t),
        l = as(i.getBoundingClientRect());
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
function Sa(e) {
    var s;
    const t = e.cloneNode(!0);
    (t.style.display = 'block'),
        (t.style.visibility = 'hidden'),
        (t.style.position = 'absolute'),
        (s = e.parentNode) == null || s.insertBefore(t, e),
        t.offsetWidth,
        t.offsetHeight;
    const n = as(t.getBoundingClientRect());
    return t.remove(), n;
}
function as(e) {
    const t = {width: 0, height: 0, top: 0, left: 0};
    return (
        Object.keys(t).forEach((n) => {
            t[n] = e[n];
        }),
        t
    );
}
const Fa = '0.3s',
    Tt = Be({
        __name: 'MyDropdown',
        props: {
            anchor: {},
            visible: {type: Boolean},
            position: {default: () => ['right', 'top', 'left', 'top']},
            animation: {default: 'slide'},
        },
        emits: ['clickout', 'open', 'close'],
        setup(e, {emit: t}) {
            Yl((h) => ({a3a04180: Fa}));
            const n = e,
                s = J(null),
                r = t,
                i = J({});
            function o() {
                if (n.anchor !== null && s.value !== null) {
                    if (n.anchor instanceof HTMLElement) {
                        i.value = Ea(n.anchor, s.value, n.position);
                        return;
                    }
                    console.warn('Anchor property is not HTML element.');
                }
            }
            function l() {
                o(),
                    window.addEventListener('resize', o),
                    Wn(() => document.addEventListener('click', d));
            }
            function a(h, x) {
                return x instanceof HTMLElement && x.contains(h);
            }
            function d(h) {
                const x = a(h.target, n.anchor),
                    R = a(h.target, s.value);
                r('clickout', h, R, x);
            }
            function f() {
                window.removeEventListener('resize', o), document.removeEventListener('click', d);
            }
            return (
                cn(
                    () => n.visible,
                    async (h, x) => {
                        if (h != x) {
                            if (h) {
                                l();
                                return;
                            }
                            f();
                        }
                    }
                ),
                Ct(() => {
                    n.visible && Wn(l);
                }),
                Xt(() => {
                    n.visible && f();
                }),
                (h, x) => (
                    fe(),
                    gi(
                        Ts,
                        {
                            name: h.animation,
                            onAfterEnter: x[0] || (x[0] = (R) => r('open')),
                            onAfterLeave: x[1] || (x[1] = (R) => r('close')),
                        },
                        {
                            default: ae(() => [
                                Zr(
                                    _(
                                        'div',
                                        {ref_key: '$dropdown', ref: s, style: An(i.value)},
                                        [Zn(h.$slots, 'default')],
                                        4
                                    ),
                                    [[Si, h.visible]]
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
    Ca = _('div', {class: 'my-dropdown'}, 'My first dropdown', -1),
    $a = Be({
        __name: 'BasicExample',
        setup(e) {
            const t = J(!1),
                n = J(null);
            return (s, r) => (
                fe(),
                ve(
                    se,
                    null,
                    [
                        _(
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
                            nt(Tt),
                            {anchor: n.value, visible: t.value},
                            {default: ae(() => [Ca]), _: 1},
                            8,
                            ['anchor', 'visible']
                        ),
                    ],
                    64
                )
            );
        },
    }),
    Ta = _('div', {class: 'my-dropdown'}, 'Click out to close the dropdown', -1),
    ka = Be({
        __name: 'ClickoutExample',
        setup(e) {
            const t = J(!1),
                n = J(null);
            function s(r, i, o) {
                t.value = i || o;
            }
            return (r, i) => (
                fe(),
                ve(
                    se,
                    null,
                    [
                        _(
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
                            nt(Tt),
                            {anchor: n.value, visible: t.value, onClickout: s},
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
    Pa = {class: 'my-form'},
    Oa = {class: 'my-input'},
    Ia = _('label', {for: 'button-h'}, 'Button horizontal position', -1),
    La = ['value'],
    Ra = ['value'],
    Ma = {class: 'my-input'},
    Na = _('label', {for: 'button-v'}, 'Button vertical position', -1),
    Da = ['value'],
    ja = {class: 'my-input'},
    Ha = _('label', {for: 'dd-h'}, 'Dropdown horizontal position', -1),
    Ba = ['value'],
    Ua = {class: 'my-input'},
    za = _('label', {for: 'dd-v'}, 'Dropdown vertical position', -1),
    Va = ['value'],
    Ga = _('p', {class: 'my-2'}, 'Dropdown in this position:', -1),
    Ka = Be({
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
            const o = mt(() => [
                    'my-button-corner',
                    `my-button-corner-h-${s.value[0]}`,
                    `my-button-corner-v-${s.value[1]}`,
                ]),
                l = mt(() => [
                    'my-dd-corner',
                    `my-dd-corner-h-${s.value[2]}`,
                    `my-dd-corner-v-${s.value[3]}`,
                ]);
            return (a, d) => (
                fe(),
                ve(
                    se,
                    null,
                    [
                        _('div', Pa, [
                            _('div', Oa, [
                                Ia,
                                _(
                                    'select',
                                    {
                                        id: 'button-h',
                                        value: s.value[0],
                                        onChange: d[0] || (d[0] = (f) => r(f, 0)),
                                    },
                                    [
                                        (fe(),
                                        ve(
                                            se,
                                            null,
                                            Rt(['left', 'center', 'right'], (f) =>
                                                _('option', {key: f, value: f}, Se(f), 9, Ra)
                                            ),
                                            64
                                        )),
                                    ],
                                    40,
                                    La
                                ),
                            ]),
                            _('div', Ma, [
                                Na,
                                _(
                                    'select',
                                    {id: 'button-v', onChange: d[1] || (d[1] = (f) => r(f, 1))},
                                    [
                                        (fe(),
                                        ve(
                                            se,
                                            null,
                                            Rt(['top', 'center', 'bottom'], (f) =>
                                                _('option', {key: f, value: f}, Se(f), 9, Da)
                                            ),
                                            64
                                        )),
                                    ],
                                    32
                                ),
                            ]),
                            _('div', ja, [
                                Ha,
                                _(
                                    'select',
                                    {id: 'dd-h', onChange: d[2] || (d[2] = (f) => r(f, 2))},
                                    [
                                        (fe(),
                                        ve(
                                            se,
                                            null,
                                            Rt(['left', 'center', 'right'], (f) =>
                                                _('option', {key: f, value: f}, Se(f), 9, Ba)
                                            ),
                                            64
                                        )),
                                    ],
                                    32
                                ),
                            ]),
                            _('div', Ua, [
                                za,
                                _(
                                    'select',
                                    {id: 'dd-v', onChange: d[3] || (d[3] = (f) => r(f, 3))},
                                    [
                                        (fe(),
                                        ve(
                                            se,
                                            null,
                                            Rt(['top', 'center', 'bottom'], (f) =>
                                                _('option', {key: f, value: f}, Se(f), 9, Va)
                                            ),
                                            64
                                        )),
                                    ],
                                    32
                                ),
                            ]),
                        ]),
                        _(
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
                            nt(Tt),
                            {anchor: n.value, visible: t.value, position: s.value, onClickout: i},
                            {
                                default: ae(() => [
                                    _(
                                        'div',
                                        {class: je(['my-dropdown', l.value])},
                                        [
                                            Ga,
                                            _('ul', null, [
                                                _('li', null, [_('code', null, Se(s.value[0]), 1)]),
                                                _('li', null, [_('code', null, Se(s.value[1]), 1)]),
                                                _('li', null, [_('code', null, Se(s.value[2]), 1)]),
                                                _('li', null, [_('code', null, Se(s.value[3]), 1)]),
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
    qa = {class: 'my-grid'},
    Wa = {class: 'my-anchors'},
    Ya = _('div', {class: 'my-dropdown'}, 'Dropdown here', -1),
    Xa = Be({
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
            const a = mt(() => {
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
                fe(),
                ve('div', qa, [
                    _('div', Wa, [
                        _(
                            'div',
                            {
                                ref: (h) => i(h, 0),
                                class: je({'my-active': r.value == 0}),
                                onClick: f[0] || (f[0] = (h) => l(0)),
                            },
                            ' Anchor 1 ',
                            2
                        ),
                        _(
                            'div',
                            {
                                ref: (h) => i(h, 1),
                                class: je({'my-active': r.value == 1}),
                                onClick: f[1] || (f[1] = (h) => l(1)),
                            },
                            ' Anchor 2 ',
                            2
                        ),
                        _(
                            'div',
                            {
                                ref: (h) => i(h, 2),
                                class: je({'my-active': r.value == 2}),
                                onClick: f[2] || (f[2] = (h) => l(2)),
                            },
                            ' Anchor 3 ',
                            2
                        ),
                        _(
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
                        nt(Tt),
                        {
                            anchor: s.value[r.value],
                            visible: t.value,
                            position: ['center', 'bottom', 'center', 'top'],
                            onClickout: o,
                        },
                        {default: ae(() => [Ya]), _: 1},
                        8,
                        ['anchor', 'visible']
                    ),
                    _(
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
    Za = {class: 'my-form'},
    Ja = {class: 'my-input'},
    Qa = _('label', {for: 'button-h'}, 'Button horizontal position', -1),
    ec = ['value'],
    tc = ['value'],
    nc = {class: 'my-dropdown'},
    sc = Be({
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
                fe(),
                ve(
                    se,
                    null,
                    [
                        _('div', Za, [
                            _('div', Ja, [
                                Qa,
                                _(
                                    'select',
                                    {id: 'button-h', value: r.value[s.value].value, onChange: i},
                                    [
                                        (fe(!0),
                                        ve(
                                            se,
                                            null,
                                            Rt(
                                                r.value,
                                                (a) => (
                                                    fe(),
                                                    ve(
                                                        'option',
                                                        {key: a.value, value: a.value},
                                                        Se(a.label),
                                                        9,
                                                        tc
                                                    )
                                                )
                                            ),
                                            128
                                        )),
                                    ],
                                    40,
                                    ec
                                ),
                            ]),
                        ]),
                        _(
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
                            nt(Tt),
                            {anchor: n.value, visible: t.value, animation: r.value[s.value].value},
                            {
                                default: ae(() => [
                                    _('div', nc, [
                                        te(' Dropdown with the '),
                                        _('code', null, Se(r.value[s.value].value), 1),
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
    rc = _('div', {class: 'my-form'}, null, -1),
    ic = {class: 'mb-2'},
    oc = _('div', {class: 'my-dropdown'}, [_('p', {class: 'my-2'}, 'Dropdown')], -1),
    lc = Be({
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
                fe(),
                ve(
                    se,
                    null,
                    [
                        rc,
                        _('p', ic, 'Dropdown status: ' + Se(s.value), 1),
                        _(
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
                            nt(Tt),
                            {
                                anchor: n.value,
                                visible: t.value,
                                onClickout: r,
                                onOpen: i,
                                onClose: o,
                            },
                            {default: ae(() => [oc]), _: 1},
                            8,
                            ['anchor', 'visible']
                        ),
                    ],
                    64
                )
            );
        },
    }),
    ac = Ss(
        '<div class="my-main-cover"><nav class="fixed left-0 top-0 z-50 w-full"><div class="container flex justify-between p-2"><ul class="flex list-none space-x-6"><li><a href="#requirements" class="hover:underline">Requirements</a></li><li><a href="#usage" class="hover:underline">Usage</a></li><li><a href="#properties-events" class="hover:underline">Properties &amp; Events</a></li><li><a href="#examples" class="hover:underline">Examples</a></li></ul></div></nav><img src="' +
            ma +
            '" alt="vue logo" class="size-2/4"><p class="text-center">A powerful and customizable dropdown for Vue.js</p><footer class="fixed left-0 top-[calc(100vh-48px)] flex h-[48px] w-full bg-primary px-2 text-white"><ul class="container m-0 flex list-none items-center gap-8 text-center align-middle"><li><a href="https://github.com/davidnotplay" target="_blank" class="hover:underline"> Developed by <b>@davidnotplay</b></a></li><li><a href="https://github.com/davidnotplay/vue-my-dropdown" target="_blank" class="hover:underline"> Star this Repo </a></li><li><a href="https://github.com/davidnotplay" target="_blank" class="hover:underline"> Follow on GitHub </a></li></ul></footer></div>',
        1
    ),
    cc = {class: 'my-content'},
    uc = {class: 'my-main-section'},
    fc = _(
        'section',
        {class: 'pb-8'},
        [
            _('h1', {id: 'requirements'}, 'Requirements'),
            _('p', null, [
                te(' To use '),
                _('code', null, 'vue-my-dropdown'),
                te(', your project must meet the following requirements: '),
            ]),
            _('ul', {class: 'ml-6 list-disc'}, [
                _('li', null, [te('Vue.js version '), _('code', null, '>= 3.3'), te('.')]),
            ]),
        ],
        -1
    ),
    dc = {class: 'pb-8'},
    pc = _('h1', {id: 'usage'}, 'Usage', -1),
    hc = _(
        'p',
        null,
        [
            te(' Follow these steps to install and start using the '),
            _('code', null, 'vue-my-dropdown'),
            te(' library in your project: '),
        ],
        -1
    ),
    gc = _('code', null, 'npm', -1),
    mc = _(
        'p',
        null,
        'Now you’re ready to integrate dropdowns into your Vue components with ease!',
        -1
    ),
    vc = Ss(
        '<section class="pb-8"><h1 id="properties-events">Properties and events</h1><table class="min-w-full table-auto border-collapse border border-table-border-color"><thead class="border-b border-table-border-color bg-gray-100"><tr><th class="px-4 py-2 text-left font-semibold text-gray-700"> Property/Event </th><th class="px-4 py-2 text-left font-semibold text-gray-700"> Possible Values </th><th class="px-4 py-2 text-left font-semibold text-gray-700"> Description </th></tr></thead><tbody class="divide-y divide-gray-300"><tr><td class="px-4 py-2 text-gray-600"><code>visible</code></td><td class="px-4 py-2 text-gray-600">true / false</td><td class="px-4 py-2 text-gray-600"> Controls the visibility of the dropdown. Use it to programmatically show or hide the dropdown. </td></tr><tr><td class="px-4 py-2 text-gray-600"><code>anchor</code></td><td class="px-4 py-2 text-gray-600">Any HTML element</td><td class="px-4 py-2 text-gray-600"> Specifies the element to which the dropdown is anchored. Ensures consistent positioning relative to the anchor, even if it moves or resizes. </td></tr><tr><td class="px-4 py-2 text-gray-600"><code>position</code></td><td class="px-4 py-2 text-gray-600"><code>[&#39;left&#39;, &#39;top&#39;, &#39;right&#39;, &#39;bottom&#39;]</code></td><td class="px-4 py-2 text-gray-600"> Defines how the dropdown aligns relative to its anchor. For example, <code>[&#39;right&#39;, &#39;top&#39;]</code> places the dropdown to the right of the anchor and aligns it at the top. </td></tr><tr><td class="px-4 py-2 text-gray-600"><code>animation</code></td><td class="px-4 py-2 text-gray-600"><code>&#39;fade&#39;</code>, <code>&#39;slide&#39;</code>, custom CSS animations </td><td class="px-4 py-2 text-gray-600"> Specifies the animation used for opening and closing the dropdown. Default animations include fade and slide transitions, or you can define custom ones. </td></tr><tr><td class="px-4 py-2 text-gray-600"><code>clickout</code></td><td class="px-4 py-2 text-gray-600">Event</td><td class="px-4 py-2 text-gray-600"> Triggers when the user clicks outside the dropdown or its anchor. Provides two flags: <code>clickedInDropdown</code> and <code>clickedInAnchor</code> to manage visibility logic. </td></tr><tr><td class="px-4 py-2 text-gray-600"><code>open</code> / <code>close</code></td><td class="px-4 py-2 text-gray-600">Event</td><td class="px-4 py-2 text-gray-600"> Fires when the dropdown opens or closes, respectively. Use these events for custom logic, such as fetching data on open or cleaning up resources on close. </td></tr></tbody></table></section><h1 id="examples">Examples</h1>',
        2
    ),
    yc = _(
        'p',
        null,
        [
            te(' The '),
            _('code', null, 'clickout'),
            te(
                ' event is triggered whenever the user clicks anywhere on the screen. This event provides two flags: '
            ),
        ],
        -1
    ),
    bc = _(
        'ul',
        null,
        [
            _('li', null, [
                _('code', null, 'clickedInDropdown'),
                te(': Indicates if the user clicked inside the dropdown. '),
            ]),
            _('li', null, [
                _('code', null, 'clickedInAnchor'),
                te(': Indicates if the user clicked on the anchor element. '),
            ]),
        ],
        -1
    ),
    _c = _(
        'p',
        null,
        ' These flags allow you to precisely determine the click location and handle visibility logic. For example, you can use this event to hide the dropdown when the user clicks outside both the dropdown and the anchor. ',
        -1
    ),
    xc = _(
        'p',
        null,
        [
            te(' The '),
            _('code', null, 'anchor'),
            te(
                ' property specifies the HTML element to which the dropdown is anchored. This allows the dropdown to dynamically position itself relative to the anchor element. '
            ),
        ],
        -1
    ),
    wc = _(
        'p',
        null,
        ' For instance, you can anchor the dropdown to a button or any other element to maintain consistent positioning, even when the element moves or resizes. ',
        -1
    ),
    Ac = _(
        'p',
        null,
        " The position property defines how the dropdown aligns relative to its anchor. You can specify the horizontal (e.g., 'left', 'center', 'right') and vertical (e.g., 'top', 'center', 'bottom') alignment. ",
        -1
    ),
    Ec = _(
        'p',
        null,
        [
            te(' For example, the configuration '),
            _('code', null, "['right', 'top', 'left', 'top']"),
            te(
                ' will place the dropdown to the right of the anchor and then adjust as needed for different screen sizes or anchor states. '
            ),
        ],
        -1
    ),
    Sc = _(
        'p',
        null,
        " The animation property allows you to customize the opening and closing transitions of the dropdown. You can use predefined transitions such as 'fade', 'slide', or create your own by defining CSS animations. ",
        -1
    ),
    Fc = _(
        'p',
        null,
        ' For instance, the example here demonstrates a custom animation where the dropdown expands and collapses with a smooth transition. ',
        -1
    ),
    Cc = _(
        'p',
        null,
        [
            te(' The dropdown emits '),
            _('code', null, 'open'),
            te(' and '),
            _('code', null, 'close'),
            te(
                " events whenever its visibility changes. These events can be used to track the dropdown's state or trigger additional actions in your application. "
            ),
        ],
        -1
    ),
    $c = _(
        'p',
        null,
        [
            te(' For example, you can use the '),
            _('code', null, 'open'),
            te(' event to load data dynamically or the '),
            _('code', null, 'close'),
            te(' event to clean up resources. '),
        ],
        -1
    ),
    Tc = Ss(
        '<ul><li><a href="#requirements" class="my-menu-link">Requirements</a></li><li><a href="#usage" class="my-menu-link">Usage</a></li><li><a href="#properties-events" class="my-menu-link">Properties and Events</a></li><li><a href="#examples" class="my-menu-link">Examples</a></li><ul><li><a href="#basic-example" class="my-menu-link">Basic Example</a></li><li><a href="#clickout-example" class="my-menu-link">Clickout Example</a></li><li><a href="#anchor-example" class="my-menu-link">Anchor Example</a></li><li><a href="#position-example" class="my-menu-link">Position Example</a></li><li><a href="#animation-example" class="my-menu-link">Animation Example</a></li><li><a href="#close-and-open-event-example" class="my-menu-link"> Close/Open Events Example </a></li></ul></ul>',
        1
    ),
    kc = [Tc],
    Pc = Be({
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
            Ct(async () => {
                const f = [
                    {url: 'examples/install.js', state: t},
                    {url: 'examples/BasicExample.vue', state: n},
                    {url: 'examples/ClickoutExample.vue', state: s},
                    {url: 'examples/PositionExample.vue', state: r},
                    {url: 'examples/AnchorExample.vue', state: i},
                    {url: 'examples/AnimationExample.vue', state: o},
                    {url: 'examples/CloseOpenExample.vue', state: l},
                ];
                for (const {url: h, state: x} of f) x.value = await (await fetch(`${h}`)).text();
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
                Ct(() => {
                    window.document.addEventListener('scroll', d);
                }),
                Xt(() => {
                    window.document.removeEventListener('scroll', d);
                }),
                (f, h) => (
                    fe(),
                    ve(
                        se,
                        null,
                        [
                            ac,
                            _('div', cc, [
                                _('div', uc, [
                                    fc,
                                    _('section', dc, [
                                        pc,
                                        hc,
                                        _('p', null, [
                                            te(' Use '),
                                            gc,
                                            te(' to install the library: '),
                                            q(ls, {
                                                language: 'shell',
                                                code: 'npm install --save vue-my-dropdown',
                                            }),
                                        ]),
                                        _('p', null, [
                                            te(
                                                ' Import the library into your project and register it as a component: '
                                            ),
                                            q(
                                                ls,
                                                {code: t.value, language: 'javascript'},
                                                null,
                                                8,
                                                ['code']
                                            ),
                                        ]),
                                        mc,
                                    ]),
                                    vc,
                                    q(
                                        xt,
                                        {
                                            title: 'Basic example',
                                            language: 'javascript',
                                            code: n.value,
                                        },
                                        {default: ae(() => [q($a)]), _: 1},
                                        8,
                                        ['code']
                                    ),
                                    q(
                                        xt,
                                        {
                                            title: 'Clickout example',
                                            language: 'javascript',
                                            code: s.value,
                                        },
                                        {
                                            description: ae(() => [yc, bc, _c]),
                                            default: ae(() => [q(ka)]),
                                            _: 1,
                                        },
                                        8,
                                        ['code']
                                    ),
                                    q(
                                        xt,
                                        {
                                            title: 'Anchor example',
                                            language: 'javascript',
                                            code: i.value,
                                        },
                                        {
                                            description: ae(() => [xc, wc]),
                                            default: ae(() => [q(Xa)]),
                                            _: 1,
                                        },
                                        8,
                                        ['code']
                                    ),
                                    q(
                                        xt,
                                        {
                                            title: 'Position example',
                                            language: 'javascript',
                                            code: r.value,
                                        },
                                        {
                                            description: ae(() => [Ac, Ec]),
                                            default: ae(() => [q(Ka)]),
                                            _: 1,
                                        },
                                        8,
                                        ['code']
                                    ),
                                    q(
                                        xt,
                                        {
                                            title: 'Animation example',
                                            language: 'javascript',
                                            code: o.value,
                                        },
                                        {
                                            description: ae(() => [Sc, Fc]),
                                            default: ae(() => [q(sc)]),
                                            _: 1,
                                        },
                                        8,
                                        ['code']
                                    ),
                                    q(
                                        xt,
                                        {
                                            title: 'Close and open event example',
                                            language: 'javascript',
                                            code: l.value,
                                        },
                                        {
                                            description: ae(() => [Cc, $c]),
                                            default: ae(() => [q(lc)]),
                                            _: 1,
                                        },
                                        8,
                                        ['code']
                                    ),
                                ]),
                                _('div', null, [
                                    _(
                                        'nav',
                                        {ref_key: 'navMenuElement', ref: a, class: 'my-menu mb-8'},
                                        kc,
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
pa(Pc).mount('#app');
