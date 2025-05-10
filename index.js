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
    var letValueInMap = function letValueInMap(k, map) {
        return map.delete(k);
    };
    var D = document;
    var B = D.body;
    var getParent = function getParent(node, query) {
        if (query) {
            return node.closest(query) || null;
        }
        return node.parentNode || null;
    };
    var hasClass = function hasClass(node, value) {
        return node.classList.contains(value);
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

    function attach(self, state) {
        var $ = this,
            $$ = $.constructor._;
        $._mask;
        var _tags = $._tags;
        forEachMap(_tags, function (v) {
            onEvent('mousedown', v[2], onPointerDownTag);
        });
        !isFunction($$.reverse) && ($$.reverse = function () {});
        !isFunction($$.sort) && ($$.sort = function () {});
    }

    function detach() {
        var $ = this;
        $._tags;
    }
    var clone,
        rect,
        startLeft,
        startTop,
        x = 0,
        y = 0;

    function isBefore(a, b) {
        var c;
        for (c = a.previousSibling; c; c = c.previousSibling) {
            if (c === b) {
                return 1;
            }
        }
        return 0;
    }

    function onPointerDownTag(e) {
        onEvent('mousemove', D, onPointerMoveDocument);
        onEvent('mouseup', D, onPointerUpDocument);
        var $ = this;
        if ('touchstart' === e.type) {
            startLeft = e.touches[0].clientX - x;
            startTop = e.touches[0].clientY - y;
        } else {
            startLeft = e.clientX - x;
            startTop = e.clientY - y;
        }
        letID(clone = $.cloneNode(true));
        clone._ref = $;
        rect = $.getBoundingClientRect();
        setStyle($, 'visibility', 'hidden');
        setStyles(clone, {
            'height': rect.height + 'px',
            'left': rect.left + 'px',
            'pointer-events': 'none',
            'position': 'absolute',
            'top': rect.top + 'px',
            'width': rect.width + 'px',
            'z-index': 9999
        });
        setChildLast(B, clone);
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
        if (!clone) {
            return;
        }
        offEventDefault(e);
        if (e.type === 'touchmove') {
            x = e.touches[0].clientX - startLeft;
            y = e.touches[0].clientY - startTop;
        } else {
            x = e.clientX - startLeft;
            y = e.clientY - startTop;
            var targetElement = D.elementFromPoint(e.clientX, e.clientY),
                parent;
            if (hasClass(targetElement, 'tag-picker__tag'));
            else if (parent = getParent(targetElement, '.tag-picker__tag')) {
                targetElement = parent;
            } else {
                targetElement = 0;
            }
            if (targetElement && targetElement !== clone._ref) {
                targetElement.parentNode.insertBefore(clone._ref, isBefore(clone._ref, targetElement) ? targetElement : targetElement.nextSibling);
            }
        }
        setTranslate(x, y, clone);
    }

    function onPointerUpDocument(e) {
        offEvent('mousemove', D, onPointerMoveDocument);
        offEvent('mouseup', D, onPointerUpDocument);
        if (clone) {
            letElement(clone);
            letStyle(clone._ref, 'visibility');
            var current = clone._ref,
                parent;
            while (parent = getParent(current)) {
                letStyle(current = parent, 'cursor');
                if (B === current) {
                    break;
                }
            }
        }
        clone = x = y = 0;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
    var index_js = {
        attach: attach,
        detach: detach,
        name: name
    };
    return index_js;
}));