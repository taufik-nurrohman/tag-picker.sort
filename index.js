/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2025 Taufik Nurrohman <https://github.com/taufik-nurrohman>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
(function (g, f) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = f() : typeof define === 'function' && define.amd ? define(f) : (g = typeof globalThis !== 'undefined' ? globalThis : g || self, (g.TagPicker = g.TagPicker || {}, g.TagPicker.Sort = f()));
})(this, (function () {
    'use strict';

    function _arrayLikeToArray(r, a) {
        (null == a || a > r.length) && (a = r.length);
        for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
        return n;
    }

    function _arrayWithHoles(r) {
        if (Array.isArray(r)) return r;
    }

    function _createForOfIteratorHelperLoose(r, e) {
        var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (t) return (t = t.call(r)).next.bind(t);
        if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || r && "number" == typeof r.length) {
            t && (r = t);
            var o = 0;
            return function () {
                return o >= r.length ? {
                    done: !0
                } : {
                    done: !1,
                    value: r[o++]
                };
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
            var e,
                n,
                i,
                u,
                a = [],
                f = !0,
                o = !1;
            try {
                if (i = (t = t.call(r)).next, 0 === l) {
                    if (Object(t) !== t) return;
                    f = !1;
                } else
                    for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
            } catch (r) {
                o = !0, n = r;
            } finally {
                try {
                    if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
                } finally {
                    if (o) throw n;
                }
            }
            return a;
        }
    }

    function _maybeArrayLike(r, a, e) {
        if (a && !Array.isArray(a) && "number" == typeof a.length) {
            var y = a.length;
            return _arrayLikeToArray(a, e < y ? e : y);
        }
        return r(a, e);
    }

    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _slicedToArray(r, e) {
        return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
    }

    function _unsupportedIterableToArray(r, a) {
        if (r) {
            if ("string" == typeof r) return _arrayLikeToArray(r, a);
            var t = {}.toString.call(r).slice(8, -1);
            return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
        }
    }
    var isArray = function isArray(x) {
        return Array.isArray(x);
    };
    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };
    var isFunction = function isFunction(x) {
        return 'function' === typeof x;
    };
    var isInstance = function isInstance(x, of, exact) {
        if (!x || 'object' !== typeof x) {
            return false;
        } {
            return isSet(of) && isSet(x.constructor) && of === x.constructor;
        }
    };
    var isNull = function isNull(x) {
        return null === x;
    };
    var isNumber = function isNumber(x) {
        return 'number' === typeof x;
    };
    var isObject = function isObject(x, isPlain) {
        if (isPlain === void 0) {
            isPlain = true;
        }
        if (!x || 'object' !== typeof x) {
            return false;
        }
        return isPlain ? isInstance(x, Object) : true;
    };
    var isSet = function isSet(x) {
        return isDefined(x) && !isNull(x);
    };
    var _fromValue = function fromValue(x) {
        if (isArray(x)) {
            return x.map(function (v) {
                return _fromValue(x);
            });
        }
        if (isObject(x)) {
            for (var k in x) {
                x[k] = _fromValue(x[k]);
            }
            return x;
        }
        if (false === x) {
            return 'false';
        }
        if (null === x) {
            return 'null';
        }
        if (true === x) {
            return 'true';
        }
        return "" + x;
    };
    var toCaseCamel = function toCaseCamel(x) {
        return x.replace(/[-_.](\w)/g, function (m0, m1) {
            return toCaseUpper(m1);
        });
    };
    var toCaseUpper = function toCaseUpper(x) {
        return x.toUpperCase();
    };
    var toCount = function toCount(x) {
        return x.length;
    };
    var forEachArray = function forEachArray(array, at) {
        for (var i = 0, j = toCount(array), v; i < j; ++i) {
            v = at(array[i], i);
            if (-1 === v) {
                array.splice(i, 1);
                continue;
            }
            if (0 === v) {
                break;
            }
            if (1 === v) {
                continue;
            }
        }
        return array;
    };
    var forEachMap = function forEachMap(map, at) {
        for (var _iterator = _createForOfIteratorHelperLoose(map), _step; !(_step = _iterator()).done;) {
            var _step$value = _maybeArrayLike(_slicedToArray, _step.value, 2),
                k = _step$value[0],
                v = _step$value[1];
            v = at(v, k);
            if (-1 === v) {
                letValueInMap(k, map);
                continue;
            }
            if (0 === v) {
                break;
            }
            if (1 === v) {
                continue;
            }
        }
        return map;
    };
    var forEachObject = function forEachObject(object, at) {
        var v;
        for (var k in object) {
            v = at(object[k], k);
            if (-1 === v) {
                delete object[k];
                continue;
            }
            if (0 === v) {
                break;
            }
            if (1 === v) {
                continue;
            }
        }
        return object;
    };
    var getReference = function getReference(key) {
        return getValueInMap(key, references) || null;
    };
    var getValueInMap = function getValueInMap(k, map) {
        return map.get(k);
    };
    var letReference = function letReference(k) {
        return letValueInMap(k, references);
    };
    var letValueInMap = function letValueInMap(k, map) {
        return map.delete(k);
    };
    var setReference = function setReference(key, value) {
        return setValueInMap(key, value, references);
    };
    var setValueInMap = function setValueInMap(k, v, map) {
        return map.set(k, v);
    };
    var references = new WeakMap();

    function _toArray(iterable) {
        return Array.from(iterable);
    }
    var D = document;
    var W = window;
    var B = D.body;
    var R = D.documentElement;
    var getElements = function getElements(query, scope) {
        return _toArray((scope || D).querySelectorAll(query));
    };
    var getParent = function getParent(node, query) {
        if (query) {
            return node.closest(query) || null;
        }
        return node.parentNode || null;
    };
    var getPrev = function getPrev(node, anyNode) {
        return node['previous' + (anyNode ? "" : 'Element') + 'Sibling'] || null;
    };
    var hasClass = function hasClass(node, value) {
        return node.classList.contains(value);
    };
    var isWindow = function isWindow(node) {
        return node === W;
    };
    var letAttribute = function letAttribute(node, attribute) {
        return node.removeAttribute(attribute), node;
    };
    var letElement = function letElement(node) {
        var parent = getParent(node);
        return node.remove(), parent;
    };
    var letID = function letID(node) {
        return letAttribute(node, 'id');
    };
    var letStyle = function letStyle(node, style) {
        return node.style[toCaseCamel(style)] = null, node;
    };
    var setChildLast = function setChildLast(parent, node) {
        return parent.append(node), node;
    };
    var setNext = function setNext(current, node) {
        return current.after(node), node;
    };
    var setPrev = function setPrev(current, node) {
        return current.before(node), node;
    };
    var setStyle = function setStyle(node, style, value) {
        if (isNumber(value)) {
            value += 'px';
        }
        return node.style[toCaseCamel(style)] = _fromValue(value), node;
    };
    var setStyles = function setStyles(node, styles) {
        return forEachObject(styles, function (v, k) {
            v || "" === v || 0 === v ? setStyle(node, k, v) : letStyle(node, k);
        }), node;
    };
    var setValue = function setValue(node, value) {
        if (null === value) {
            return letAttribute(node, 'value');
        }
        return node.value = _fromValue(value), node;
    };
    var getRect = function getRect(node) {
        var h, rect, w, x, y, X, Y;
        if (isWindow(node)) {
            x = node.pageXOffset || R.scrollLeft || B.scrollLeft;
            y = node.pageYOffset || R.scrollTop || B.scrollTop;
            w = node.innerWidth;
            h = node.innerHeight;
        } else {
            rect = node.getBoundingClientRect();
            x = rect.left;
            y = rect.top;
            w = rect.width;
            h = rect.height;
            X = rect.right;
            Y = rect.bottom;
        }
        return [x, y, w, h, X, Y];
    };
    var offEvent = function offEvent(name, node, then) {
        node.removeEventListener(name, then);
    };
    var offEventDefault = function offEventDefault(e) {
        return e && e.preventDefault();
    };
    var onEvent = function onEvent(name, node, then, options) {
        if (options === void 0) {
            options = false;
        }
        node.addEventListener(name, then, options);
    };
    var name = 'TagPicker.Sort';
    var EVENT_DOWN = 'down';
    var EVENT_MOVE = 'move';
    var EVENT_UP = 'up';
    var EVENT_MOUSE = 'mouse';
    var EVENT_MOUSE_DOWN = EVENT_MOUSE + EVENT_DOWN;
    var EVENT_MOUSE_MOVE = EVENT_MOUSE + EVENT_MOVE;
    var EVENT_MOUSE_UP = EVENT_MOUSE + EVENT_UP;
    var EVENT_TOUCH = 'touch';
    var EVENT_TOUCH_END = EVENT_TOUCH + 'end';
    var EVENT_TOUCH_MOVE = EVENT_TOUCH + EVENT_MOVE;
    var EVENT_TOUCH_START = EVENT_TOUCH + 'start';

    function attach(self, state) {
        var $ = this,
            $$ = $.constructor._,
            _tags = $._tags;
        forEachMap(_tags, function (v) {
            v = v[2];
            onEvent(EVENT_MOUSE_DOWN, v, onPointerDownTag);
            onEvent(EVENT_TOUCH_START, v, onPointerDownTag);
            setReference(v, $);
        });
        !isFunction($$.reverse) && ($$.reverse = function () {
            var $ = this,
                state = $.state,
                value = $.value,
                join = state.join;
            value = value.split(join).reverse();
            $.value = value.join(join);
            return $.fire('sort.tags', [value]);
        });
        !isFunction($$.sort) && ($$.sort = function (method) {
            var $ = this,
                state = $.state,
                value = $.value,
                join = state.join,
                v;
            method = (method || function (a, b) {
                return a.localeCompare(b, undefined, {
                    numeric: true,
                    sensitivity: 'base'
                });
            }).bind($);
            v = value;
            value = value.split(join).sort(method);
            if (v !== value.join(join)) {
                $.value = value.join(join);
                return $.fire('sort.tags', [value]);
            }
            return $;
        });
        return $.on('let.tag', onLetTag).on('set.tag', onSetTag);
    }

    function detach() {
        var $ = this,
            $$ = $.constructor._,
            _tags = $._tags;
        forEachMap(_tags, function (v) {
            v = v[2];
            letReference(v);
            offEvent(EVENT_MOUSE_DOWN, v, onPointerDownTag);
            offEvent(EVENT_TOUCH_START, v, onPointerDownTag);
        });
        delete $$.reverse;
        delete $$.sort;
        return $.off('let.tag', onLetTag).off('set.tag', onSetTag);
    }
    var copy,
        left,
        rect,
        top,
        x = 0,
        y = 0;

    function isBefore(a, b) {
        var c;
        for (c = getPrev(a, 1); c; c = getPrev(c, 1)) {
            if (c === b) {
                return 1;
            }
        }
        return 0;
    }

    function onPointerDownTag(e) {
        offEventDefault(e);
        var $ = this,
            picker = getReference($),
            _mask = picker._mask,
            state = picker.state,
            flex = _mask.flex,
            n = state.n,
            _e = e,
            target = _e.target,
            type = _e.type;
        if (hasClass(target, n + '__x') || getParent(target, '.' + n + '__x')) {
            return;
        }
        $.blur();
        onEvent(EVENT_MOUSE_MOVE, D, onPointerMoveDocument);
        onEvent(EVENT_MOUSE_UP, D, onPointerUpDocument);
        onEvent(EVENT_TOUCH_END, D, onPointerUpDocument);
        onEvent(EVENT_TOUCH_MOVE, D, onPointerMoveDocument);
        if (EVENT_TOUCH_START === type) {
            e = e.touches[0];
        }
        left = e.clientX - x;
        top = e.clientY - y;
        letID(copy = $.cloneNode(true));
        rect = getRect($);
        setReference(copy, $);
        setStyle($, 'visibility', 'hidden');
        setStyles(copy, {
            'height': rect[3],
            'left': rect[0],
            'pointer-events': 'none',
            'position': 'fixed',
            'top': rect[1],
            'transform': false,
            'transition': false,
            'width': rect[2],
            'z-index': 9999
        });
        setChildLast(flex, copy);
        var current = $,
            parent;
        while (parent = getParent(current)) {
            setStyle(current = parent, 'cursor', 'move');
            if (B === current) {
                break;
            }
        }
    }

    function onPointerMoveDocument(e) {
        offEventDefault(e);
        if (!copy) {
            return;
        }
        var copyOf = getReference(copy),
            picker = getReference(copyOf),
            _mask = picker._mask,
            state = picker.state,
            flex = _mask.flex,
            n = state.n,
            current,
            parent;
        if (EVENT_TOUCH_MOVE === e.type) {
            e = e.touches[0];
        }
        x = e.clientX - left;
        y = e.clientY - top;
        current = D.elementFromPoint(e.clientX, e.clientY);
        if (hasClass(current, n + '__tag'));
        else if (parent = getParent(current, '.' + n + '__tag')) {
            current = parent;
        } else {
            current = 0;
        }
        translate(copy, x, y);
        if (current && current !== copyOf && flex === getParent(current)) {
            isBefore(copyOf, current) ? setNext(copyOf, current) : setPrev(copyOf, current);
        }
    }

    function onPointerUpDocument(e) {
        offEvent(EVENT_MOUSE_MOVE, D, onPointerMoveDocument);
        offEvent(EVENT_MOUSE_UP, D, onPointerUpDocument);
        offEvent(EVENT_TOUCH_END, D, onPointerUpDocument);
        offEvent(EVENT_TOUCH_MOVE, D, onPointerMoveDocument);
        if (copy) {
            var current, parent, picker, value;
            letStyle(current = getReference(copy), 'visibility');
            picker = getReference(current);
            value = current.value;
            if (EVENT_TOUCH_END !== e.type) {
                current.focus();
            }
            while (parent = getParent(current)) {
                letStyle(current = parent, 'cursor');
                if (B === current) {
                    break;
                }
            }
            letReference(copy), letElement(copy);
            if (picker) {
                var map = new Map(),
                    _picker = picker,
                    _mask = _picker._mask,
                    _tags = _picker._tags,
                    self = _picker.self,
                    state = _picker.state,
                    flex = _mask.flex,
                    join = state.join,
                    key,
                    values = [];
                forEachArray(getElements('data[value]', flex), function (v) {
                    setValueInMap(key = v.value, _tags.at(key), map);
                    values.push(key);
                });
                setValue(self, values.join(join));
                _tags.values = map;
                picker.fire('sort.tag', [value]);
            }
        }
        copy = x = y = 0;
    }

    function onLetTag(name) {
        var $ = this,
            at = $.tags.at(name);
        if (at = at && at[2]) {
            letReference(at);
            offEvent(EVENT_MOUSE_DOWN, at, onPointerDownTag);
            offEvent(EVENT_TOUCH_START, at, onPointerDownTag);
        }
    }

    function onSetTag(name) {
        var $ = this,
            at = $.tags.at(name);
        if (at = at && at[2]) {
            onEvent(EVENT_MOUSE_DOWN, at, onPointerDownTag);
            onEvent(EVENT_TOUCH_START, at, onPointerDownTag);
            setReference(at, $);
        }
    }

    function translate(node, x, y) {
        setStyle(node, 'transform', 'translate(' + x + 'px,' + y + 'px)');
    }
    var index_js = {
        attach: attach,
        detach: detach,
        name: name
    };
    return index_js;
}));