/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2024 Taufik Nurrohman <https://github.com/taufik-nurrohman>
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
    var toCaseCamel = function toCaseCamel(x) {
        return x.replace(/[-_.](\w)/g, function (m0, m1) {
            return toCaseUpper(m1);
        });
    };
    var toCaseUpper = function toCaseUpper(x) {
        return x.toUpperCase();
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
    var letStyle = function letStyle(node, style) {
        return node.style[toCaseCamel(style)] = null, node;
    };
    var setStyle = function setStyle(node, style, value) {
        return node.style[toCaseCamel(style)] = _fromValue(value), node;
    };
    var name = 'TagPicker.Sort';
    var references = new WeakMap();

    function getReference(key) {
        return references.get(key);
    }

    function letReference(key) {
        return references.delete(key);
    }

    function onEnd(e) {
        var t = this,
            picker = t._picker,
            _active = picker._active,
            from = e.from,
            to = e.to;
        if (!_active) {
            return;
        }
        from && letStyle(from, 'cursor');
        to && letStyle(to, 'cursor');
    }

    function onMove(e) {
        var t = this,
            picker = t._picker,
            _active = picker._active,
            _mask = picker._mask,
            text = _mask.text;
        if (!_active) {
            return;
        }
        if (e.related === text) {
            return false;
        }
    }

    function onSort(e) {
        var t = this,
            v,
            picker = t._picker,
            _active = picker._active,
            self = picker.self,
            state = picker.state;
        state.n;
        var item = e.item;
        if (!_active) {
            return;
        }
        var tags = t.toArray().slice(0, -1); // All but the last item (the `.tag-picker__text` item)
        self.value = tags.join(state.join);
        picker.fire('sort.tag', [v = item.title]).fire('change', [v]);
        picker.value = picker.value; // Refresh!
    }

    function onStart(e) {
        var t = this,
            picker = t._picker,
            _active = picker._active,
            from = e.from,
            to = e.to;
        if (!_active) {
            return;
        }
        from && setStyle(from, 'cursor', 'move');
        to && setStyle(to, 'cursor', 'move');
    }

    function setReference(key, value) {
        return references.set(key, value);
    }

    function attach() {
        var $ = this;
        var $$ = $.constructor.prototype;
        !isFunction($$.reverse) && ($$.reverse = function () {
            var $ = this,
                sortable = getReference($),
                _active = $._active,
                self = $.self,
                state = $.state,
                join = state.join;
            if (!_active) {
                return $;
            }
            var tags = sortable.toArray(),
                text = tags.pop();
            tags = tags.reverse();
            self.value = tags.join(join);
            return sortable.sort(tags.concat(text), true), $.fire('sort.tags', [tags]);
        });
        !isFunction($$.sort) && ($$.sort = function (method) {
            var $ = this,
                sortable = getReference($),
                _active = $._active,
                self = $.self,
                state = $.state,
                join = state.join;
            if (!_active) {
                return $;
            }
            method = (method || function (a, b) {
                return a.localeCompare(b, undefined, {
                    numeric: true,
                    sensitivity: 'base'
                });
            }).bind($);
            var tags = sortable.toArray(),
                text = tags.pop();
            tags = tags.sort(method);
            self.value = tags.join(join);
            return sortable.sort(tags.concat(text), true), $.fire('sort.tags', [tags]);
        });
        var _mask = $._mask,
            state = $.state,
            tags = _mask.tags,
            n = state.n;
        var n_tag_ = n + '__tag--';
        var sortable = new Sortable(tags, {
            animation: 150,
            chosenClass: n_tag_ + 'select',
            dataIdAttr: 'title',
            dragClass: n_tag_ + 'move',
            filter: '.' + n + '__text',
            ghostClass: n_tag_ + 'ghost',
            onEnd: onEnd,
            onMove: onMove,
            onSort: onSort,
            onStart: onStart,
            selectedClass: n_tag_ + 'selected'
        });
        sortable._picker = $;
        setReference($, sortable);
        return $;
    }

    function detach() {
        var $ = this,
            sortable = getReference($);
        letReference($);
        sortable && sortable.destroy();
    }
    var index_js = {
        attach: attach,
        detach: detach,
        name: name
    };
    return index_js;
}));